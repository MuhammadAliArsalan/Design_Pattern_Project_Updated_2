/**
 * Payments Controller
 *
 * Patterns in use:
 *   • Observer   — EventManager broadcasts "student:enrolled" so email
 *                  and progress-tracking run as decoupled side-effects
 *   • Singleton  — RazorpayService / MailTransporter
 *   • Repository — CourseRepository / UserRepository
 *   • Factory    — ApiResponseFactory
 */

const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();

const razorpay = require("../config/RazorpayService");
const eventManager = require("../patterns/observer/EventManager");
const ApiResponseFactory = require("../patterns/factory/ApiResponseFactory");
const courseRepo = require("../repositories/CourseRepository");
const userRepo = require("../repositories/UserRepository");
const CourseProgress = require("../models/courseProgress");
const User = require("../models/user");

const _isDemoPaymentMode = () => {
  const mode = (process.env.PAYMENT_MODE || "").toLowerCase();
  if (mode === "demo") return true;

  const key = process.env.RAZORPAY_KEY || "";
  const secret = process.env.RAZORPAY_SECRET || "";
  return (
    !key ||
    !secret ||
    key.includes("your_razorpay_key") ||
    secret.includes("your_razorpay_secret")
  );
};

// ── Wire up observers exactly once when the module is first loaded ────────
const EnrollmentEmailObserver = require("../patterns/observer/observers/EnrollmentEmailObserver");
const CourseProgressObserver = require("../patterns/observer/observers/CourseProgressObserver");

eventManager.subscribe("student:enrolled", EnrollmentEmailObserver);
eventManager.subscribe("student:enrolled", CourseProgressObserver);

// ================ CAPTURE PAYMENT ================
exports.capturePayment = async (req, res) => {
  try {
    const { coursesId } = req.body;
    const userId = req.user.id;

    if (!coursesId || coursesId.length === 0) {
      return ApiResponseFactory.badRequest(
        res,
        "Please provide at least one course ID",
      );
    }

    let totalAmount = 0;

    for (const courseId of coursesId) {
      // ── REPOSITORY: validate each course ──────────────────────────
      const course = await courseRepo.findById(courseId);
      if (!course) {
        return ApiResponseFactory.notFound(
          res,
          `Course not found: ${courseId}`,
        );
      }

      const alreadyEnrolled = await courseRepo.isStudentEnrolled(
        courseId,
        userId,
      );
      if (alreadyEnrolled) {
        return ApiResponseFactory.badRequest(
          res,
          "Student is already enrolled in one of the selected courses",
        );
      }

      totalAmount += course.price;
    }

    const amount = totalAmount * 100;
    const currency = "INR";
    const receipt = `rcpt_${Date.now()}`;

    if (_isDemoPaymentMode()) {
      return ApiResponseFactory.success(res, {
        message: "Demo order created",
        data: {
          id: `order_demo_${Date.now()}`,
          amount,
          currency,
          receipt,
          isDemo: true,
        },
      });
    }

    // ── SINGLETON: create Razorpay order ──────────────────────────────
    const paymentResponse = await razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    return ApiResponseFactory.success(res, {
      message: "Order created",
      data: paymentResponse,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(
      res,
      error,
      "Could not initiate order",
    );
  }
};

// ================ VERIFY PAYMENT ================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      coursesId,
    } = req.body;
    const userId = req.user.id;

    if (!coursesId || !userId) {
      return ApiResponseFactory.badRequest(
        res,
        "Payment failed — missing data",
      );
    }

    if (_isDemoPaymentMode()) {
      await _enrollStudents(coursesId, userId);
      return ApiResponseFactory.success(res, {
        message: "Demo payment verified and student enrolled",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return ApiResponseFactory.badRequest(
        res,
        "Payment failed — missing data",
      );
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return ApiResponseFactory.badRequest(
        res,
        "Payment verification failed — invalid signature",
      );
    }

    // Enroll student in each course
    await _enrollStudents(coursesId, userId);

    return ApiResponseFactory.success(res, {
      message: "Payment verified and student enrolled",
    });
  } catch (error) {
    return ApiResponseFactory.serverError(
      res,
      error,
      "Error while verifying payment",
    );
  }
};

// ── Private: enroll a student in multiple courses ─────────────────────────
const _enrollStudents = async (courseIds, userId) => {
  for (const courseId of courseIds) {
    // ── REPOSITORY: enroll student in course ──────────────────────────
    const enrolledCourse = await courseRepo.enrollStudent(courseId, userId);
    if (!enrolledCourse)
      throw new Error(`Course not found during enrollment: ${courseId}`);

    // Create initial progress record
    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId,
      completedVideos: [],
    });

    // ── REPOSITORY: update student record ─────────────────────────────
    const enrolledStudent = await userRepo.enrollInCourse(
      userId,
      courseId,
      courseProgress._id,
    );

    // ── OBSERVER: fire event — observers handle email + progress ───────
    await eventManager.notify("student:enrolled", {
      student: enrolledStudent,
      course: enrolledCourse,
      userId,
    });
  }
};

// ================ SEND PAYMENT SUCCESS EMAIL ================
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
      return ApiResponseFactory.badRequest(
        res,
        "Please provide all required fields",
      );
    }

    const student = await userRepo.findById(userId);
    const mailer = require("../config/MailTransporter");

    await mailer.send(
      student.email,
      "Payment Received",
      `<p>Hi ${student.firstName},</p>
       <p>Your payment of ₹${amount / 100} has been received.</p>
       <p>Order ID: ${orderId} | Payment ID: ${paymentId}</p>`,
    );

    return ApiResponseFactory.success(res, {
      message: "Payment success email sent",
    });
  } catch (error) {
    return ApiResponseFactory.serverError(
      res,
      error,
      "Could not send payment success email",
    );
  }
};
