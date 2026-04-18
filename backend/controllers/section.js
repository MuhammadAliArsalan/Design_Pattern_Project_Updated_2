/**
 * Section Controller
 * Patterns: ApiResponseFactory (Factory), CourseRepository (Repository)
 */

const Section            = require('../models/section');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const courseRepo         = require('../repositories/CourseRepository');

const _populatedCourse = (courseId) =>
  courseRepo.findById(courseId, {
    path: 'courseContent',
    populate: { path: 'subSection' },
  });


exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) return ApiResponseFactory.badRequest(res, 'All fields are required');

    const newSection = await Section.create({ sectionName });

    // ── REPOSITORY: link section to course ──────────────────────────
    await courseRepo.pushSection(courseId, newSection._id);

    const updatedCourse = await _populatedCourse(courseId);

    return ApiResponseFactory.success(res, {
      message: 'Section created successfully',
      data: updatedCourse,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while creating section');
  }
};


exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;
    if (!sectionId) return ApiResponseFactory.badRequest(res, 'Section ID is required');

    await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });

    const updatedCourse = await _populatedCourse(courseId);

    return ApiResponseFactory.success(res, {
      message: 'Section updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while updating section');
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    await Section.findByIdAndDelete(sectionId);

    const updatedCourse = await _populatedCourse(courseId);

    return ApiResponseFactory.success(res, {
      message: 'Section deleted successfully',
      data: updatedCourse,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while deleting section');
  }
};
