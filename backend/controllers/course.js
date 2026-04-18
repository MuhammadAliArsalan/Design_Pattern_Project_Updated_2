/**
 * Course Controller
 *
 * Patterns in use:
 *   • Builder    — CourseBuilder assembles a new course fluently
 *   • Prototype  — CoursePrototype.clone() duplicates an existing course
 *   • Repository — CourseRepository / UserRepository for all DB calls
 *   • Factory    — ApiResponseFactory standardises all JSON responses
 */

const Category       = require('../models/category');
const Section        = require('../models/section');
const SubSection     = require('../models/subSection');

const CourseBuilder      = require('../patterns/builder/CourseBuilder');
const CoursePrototype    = require('../patterns/prototype/CoursePrototype');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const cloudinary         = require('../config/CloudinaryService');
const courseRepo         = require('../repositories/CourseRepository');
const userRepo           = require('../repositories/UserRepository');

const { convertSecondsToDuration } = require('../utils/secToDuration');
require('dotenv').config();


// ── Shared helper: sum total course duration ─────────────────────────────
const _totalDuration = (courseDetails) => {
  let seconds = 0;
  courseDetails.courseContent.forEach((section) => {
    section.subSection.forEach((sub) => {
      seconds += parseInt(sub.timeDuration) || 0;
    });
  });
  return convertSecondsToDuration(seconds);
};


// ================ CREATE COURSE ================
exports.createCourse = async (req, res) => {
  try {
    let { courseName, courseDescription, whatYouWillLearn, price,
          category, instructions: _instructions, status, tag: _tag } = req.body;

    const tag          = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);
    const thumbnail    = req.files?.thumbnailImage;

    if (!courseName || !courseDescription || !whatYouWillLearn || !price
        || !category || !thumbnail || !tag.length || !instructions.length) {
      return ApiResponseFactory.badRequest(res, 'All fields are required');
    }

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return ApiResponseFactory.notFound(res, 'Category not found');
    }

    // ── SINGLETON: upload via CloudinaryService ──────────────────────
    const thumbnailDetails = await cloudinary.upload(thumbnail, process.env.FOLDER_NAME);

    // ── BUILDER: assemble the course step by step ────────────────────
    const newCourse = await new CourseBuilder()
      .setBasicInfo(courseName, courseDescription, whatYouWillLearn)
      .setInstructor(req.user.id)
      .setPrice(price)
      .setCategory(categoryDetails._id)
      .setMedia(thumbnailDetails.secure_url)
      .setMeta({ tag, instructions, status })
      .build();

    // ── REPOSITORY: link course to instructor + category ────────────
    await userRepo.pushCourse(req.user.id, newCourse._id);
    await Category.findByIdAndUpdate(category, { $push: { courses: newCourse._id } });

    return ApiResponseFactory.success(res, {
      message: 'Course created successfully',
      data: newCourse,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while creating course');
  }
};


// ================ GET ALL COURSES ================
exports.getAllCourses = async (req, res) => {
  try {
    // ── REPOSITORY ───────────────────────────────────────────────────
    const courses = await courseRepo.findAllPublished();
    return ApiResponseFactory.success(res, {
      message: 'All courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching courses');
  }
};


// ================ GET COURSE DETAILS (public — no video URLs) ================
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ── REPOSITORY ───────────────────────────────────────────────────
    const courseDetails = await courseRepo.findPublicDetails(courseId);
    if (!courseDetails) {
      return ApiResponseFactory.notFound(res, `Course not found: ${courseId}`);
    }

    return ApiResponseFactory.success(res, {
      message: 'Course details fetched successfully',
      data: { courseDetails, totalDuration: _totalDuration(courseDetails) },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching course details');
  }
};


// ================ GET FULL COURSE DETAILS (enrolled student) ================
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId       = req.user.id;

    // ── REPOSITORY ───────────────────────────────────────────────────
    const courseDetails = await courseRepo.findWithFullDetails(courseId);
    if (!courseDetails) {
      return ApiResponseFactory.notFound(res, `Course not found: ${courseId}`);
    }

    const CourseProgress  = require('../models/courseProgress');
    const courseProgress  = await CourseProgress.findOne({ courseID: courseId, userId });

    return ApiResponseFactory.success(res, {
      data: {
        courseDetails,
        totalDuration: _totalDuration(courseDetails),
        completedVideos: courseProgress?.completedVideos ?? [],
      },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching full course details');
  }
};


// ================ EDIT COURSE ================
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates      = req.body;

    const course = await courseRepo.findById(courseId);
    if (!course) return ApiResponseFactory.notFound(res, 'Course not found');

    if (req.files?.thumbnailImage) {
      const uploaded    = await cloudinary.upload(req.files.thumbnailImage, process.env.FOLDER_NAME);
      course.thumbnail  = uploaded.secure_url;
    }

    for (const key of Object.keys(updates)) {
      if (key === 'tag' || key === 'instructions') {
        course[key] = JSON.parse(updates[key]);
      } else {
        course[key] = updates[key];
      }
    }
    course.updatedAt = Date.now();
    await course.save();

    // ── REPOSITORY: re-fetch fully populated course ──────────────────
    const updatedCourse = await courseRepo.findWithFullDetails(courseId);

    return ApiResponseFactory.success(res, {
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while updating course');
  }
};


// ================ GET INSTRUCTOR COURSES ================
exports.getInstructorCourses = async (req, res) => {
  try {
    // ── REPOSITORY ───────────────────────────────────────────────────
    const courses = await courseRepo.findByInstructor(req.user.id);
    return ApiResponseFactory.success(res, {
      message: 'Instructor courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching instructor courses');
  }
};


// ================ DELETE COURSE ================
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await courseRepo.findById(courseId);
    if (!course) return ApiResponseFactory.notFound(res, 'Course not found');

    // Unenroll all students
    for (const studentId of course.studentsEnrolled) {
      await userRepo.pullCourse(studentId, courseId);
    }

    // ── SINGLETON: delete assets from Cloudinary ─────────────────────
    await cloudinary.delete(course.thumbnail);

    // Cascade-delete sections → sub-sections
    for (const sectionId of course.courseContent) {
      const section = await Section.findById(sectionId);
      if (section) {
        for (const subId of section.subSection) {
          const sub = await SubSection.findById(subId);
          if (sub) await cloudinary.delete(sub.videoUrl);
          await SubSection.findByIdAndDelete(subId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    await courseRepo.deleteById(courseId);

    return ApiResponseFactory.success(res, { message: 'Course deleted successfully' });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while deleting course');
  }
};


// ================ CLONE COURSE (Prototype) ================
exports.cloneCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // ── PROTOTYPE: deep-clone the course ─────────────────────────────
    const clonedCourse = await CoursePrototype.clone(courseId, req.user.id);

    // Link the cloned course to the instructor
    await userRepo.pushCourse(req.user.id, clonedCourse._id);

    return ApiResponseFactory.success(res, {
      message: 'Course cloned successfully',
      data: clonedCourse,
      statusCode: 201,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while cloning course');
  }
};
