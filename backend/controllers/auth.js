/**
 * Auth Controller
 *
 * Patterns in use:
 *   • Factory  — UserFactory creates typed User documents
 *   • Factory  — ApiResponseFactory standardises every JSON response
 *   • Repository — UserRepository abstracts all DB calls
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
require("dotenv").config();

const UserFactory = require("../patterns/factory/UserFactory");
const ApiResponseFactory = require("../patterns/factory/ApiResponseFactory");
const userRepo = require("../repositories/UserRepository");
const mailer = require("../config/MailTransporter");
const OTP = require("../models/OTP");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// ── Helper ─────────────────────────────────────────────────────────────────
const _extractName = (email) =>
  email
    .split("@")[0]
    .split(".")
    .map((p) => p.replace(/\d+/g, ""))
    .join(" ");

// ================ SEND OTP ================
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await userRepo.findByEmail(email);
    if (existing) {
      return ApiResponseFactory.error(res, {
        message: "User is already registered",
        statusCode: 401,
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const name = _extractName(email);
    await mailer.send(email, "OTP Verification Email", otpTemplate(otp, name));
    await OTP.create({ email, otp });

    console.log(`📧 OTP sent to ${email}: ${otp}`); // remove in production

    return ApiResponseFactory.success(res, {
      message: "OTP sent successfully",
      data: { otp }, // remove in production
    });
  } catch (error) {
    return ApiResponseFactory.serverError(
      res,
      error,
      "Error while generating OTP",
    );
  }
};

// ================ SIGNUP ================
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !otp
    ) {
      return ApiResponseFactory.badRequest(res, "All fields are required");
    }

    if (password !== confirmPassword) {
      return ApiResponseFactory.badRequest(
        res,
        "Password and confirm password do not match",
      );
    }

    const alreadyExists = await userRepo.findByEmail(email);
    if (alreadyExists) {
      return ApiResponseFactory.badRequest(
        res,
        "User already registered — please login",
      );
    }

    console.log("SIGNUP BODY:", req.body);
    // Verify OTP
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!recentOtp) {
      return ApiResponseFactory.badRequest(
        res,
        "OTP not found — please request a new one",
      );
    }
    if (otp !== recentOtp.otp) {
      return ApiResponseFactory.badRequest(res, "Invalid OTP");
    }

    // ── FACTORY: create the right type of user ──────────────────────
    await UserFactory.createUser(accountType, {
      firstName,
      lastName,
      email,
      password,
      contactNumber,
    });

    return ApiResponseFactory.success(res, {
      message: "User registered successfully",
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, "Error during signup");
  }
};

// ================ LOGIN ================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponseFactory.badRequest(res, "All fields are required");
    }

    let user = await userRepo.findByEmailWithProfile(email);

    if (!user) {
      return ApiResponseFactory.unauthorized(
        res,
        "You are not registered with us",
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return ApiResponseFactory.unauthorized(res, "Password does not match");
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    user = user.toObject();
    user.token = token;
    user.password = undefined;

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    return ApiResponseFactory.success(res, {
      message: "User logged in successfully",
      data: { user, token },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, "Error during login");
  }
};

// ================ CHANGE PASSWORD ================
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return ApiResponseFactory.badRequest(res, "All fields are required");
    }

    const userDetails = await userRepo.findById(req.user.id);
    const isMatch = await bcrypt.compare(oldPassword, userDetails.password);

    if (!isMatch) {
      return ApiResponseFactory.unauthorized(res, "Old password is incorrect");
    }

    if (newPassword !== confirmNewPassword) {
      return ApiResponseFactory.badRequest(
        res,
        "New password and confirm password do not match",
      );
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    // ── REPOSITORY: update password ─────────────────────────────────
    const updated = await userRepo.updatePassword(req.user.id, hashed);

    await mailer.send(
      updated.email,
      "Password updated",
      passwordUpdated(
        updated.email,
        `${updated.firstName} ${updated.lastName}`,
      ),
    );

    return ApiResponseFactory.success(res, {
      message: "Password changed successfully",
    });
  } catch (error) {
    return ApiResponseFactory.serverError(
      res,
      error,
      "Error while changing password",
    );
  }
};
