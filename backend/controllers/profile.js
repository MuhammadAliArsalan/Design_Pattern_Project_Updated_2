/**
 * Profile Controller
 *
 * Patterns in use:
 *   • Singleton  — CloudinaryService
 *   • Repository — UserRepository
 *   • Factory    — ApiResponseFactory
 */

const Profile            = require('../models/profile');
const Course             = require('../models/course');
const CourseProgress     = require('../models/courseProgress');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const cloudinary         = require('../config/CloudinaryService');
const userRepo           = require('../repositories/UserRepository');
const { convertSecondsToDuration } = require('../utils/secToDuration');
require('dotenv').config();


// ================ UPDATE PROFILE ================
exports.updateProfile = async (req, res) => {
  try {
    const { gender = '', dateOfBirth = '', about = '', contactNumber = '', firstName, lastName } = req.body;
    const userId = req.user.id;

    const userDetails = await userRepo.findById(userId);
    if (!userDetails) return ApiResponseFactory.notFound(res, 'User not found');

    // Update user name
    userDetails.firstName = firstName;
    userDetails.lastName  = lastName;
    await userDetails.save();

    // Update profile
    const profile = await Profile.findById(userDetails.additionalDetails);
    Object.assign(profile, { gender, dateOfBirth, about, contactNumber });
    await profile.save();

    const updated = await userRepo.findByIdWithProfile(userId);

    return ApiResponseFactory.success(res, {
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while updating profile');
  }
};


// ================ DELETE ACCOUNT ================
exports.deleteAccount = async (req, res) => {
  try {
    const userId      = req.user.id;
    const userDetails = await userRepo.findById(userId);
    if (!userDetails) return ApiResponseFactory.notFound(res, 'User not found');

    // ── SINGLETON: remove profile picture from Cloudinary ──────────
    await cloudinary.delete(userDetails.image);

    // Unenroll from all courses
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(courseId, { $pull: { studentsEnrolled: userId } });
    }

    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await userRepo.deleteById(userId);

    return ApiResponseFactory.success(res, { message: 'Account deleted successfully' });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while deleting account');
  }
};


// ================ GET USER DETAILS ================
exports.getUserDetails = async (req, res) => {
  try {
    const userDetails = await userRepo.findByIdWithProfile(req.user.id);
    return ApiResponseFactory.success(res, {
      message: 'User data fetched successfully',
      data: userDetails,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching user details');
  }
};


// ================ UPDATE PROFILE IMAGE ================
exports.updateUserProfileImage = async (req, res) => {
  try {
    const profileImage = req.files?.profileImage;
    if (!profileImage) return ApiResponseFactory.badRequest(res, 'No image file provided');

    // ── SINGLETON: upload via CloudinaryService ─────────────────────
    const uploaded = await cloudinary.upload(profileImage, process.env.FOLDER_NAME, 1000, 1000);
    const updated  = await userRepo.updateProfileImage(req.user.id, uploaded.secure_url);
    const result   = await userRepo.findByIdWithProfile(req.user.id);

    return ApiResponseFactory.success(res, {
      message: 'Profile image updated successfully',
      data: result,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while updating profile image');
  }
};


// ================ GET ENROLLED COURSES ================
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId      = req.user.id;
    let   userDetails = await userRepo.findOne(
      { _id: userId },
      { path: 'courses', populate: { path: 'courseContent', populate: { path: 'subSection' } } }
    );

    if (!userDetails) {
      return ApiResponseFactory.notFound(res, `User not found: ${userId}`);
    }

    userDetails = userDetails.toObject();

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalSeconds  = 0;
      let subSectionLen = 0;

      for (const content of userDetails.courses[i].courseContent) {
        totalSeconds  += content.subSection.reduce((acc, s) => acc + parseInt(s.timeDuration || 0), 0);
        subSectionLen += content.subSection.length;
      }

      userDetails.courses[i].totalDuration = convertSecondsToDuration(totalSeconds);

      const progress = await CourseProgress.findOne({ courseID: userDetails.courses[i]._id, userId });
      const completed = progress?.completedVideos.length || 0;

      userDetails.courses[i].progressPercentage =
        subSectionLen === 0
          ? 100
          : Math.round((completed / subSectionLen) * 100 * 100) / 100;
    }

    return ApiResponseFactory.success(res, { data: userDetails.courses });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching enrolled courses');
  }
};


// ================ INSTRUCTOR DASHBOARD ================
exports.instructorDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id });

    const courseData = courses.map((course) => ({
      _id:                  course._id,
      courseName:           course.courseName,
      courseDescription:    course.courseDescription,
      totalStudentsEnrolled: course.studentsEnrolled.length,
      totalAmountGenerated: course.studentsEnrolled.length * course.price,
    }));

    console.log(courseData);  

    return ApiResponseFactory.success(res, {
      message: 'Instructor dashboard data fetched successfully',
      data: courseData,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching instructor dashboard');
  }
};
