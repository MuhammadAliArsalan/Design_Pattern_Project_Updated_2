/**
 * CourseProgress Controller
 * Patterns: Factory (ApiResponseFactory)
 */

const SubSection         = require('../models/subSection');
const CourseProgress     = require('../models/courseProgress');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');


exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.body;
    const userId = req.user.id;

    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) return ApiResponseFactory.notFound(res, 'Invalid subsection');

    const courseProgress = await CourseProgress.findOne({ courseID: courseId, userId });

    if (!courseProgress) {
      return ApiResponseFactory.notFound(res, 'Course progress record not found');
    }

    if (courseProgress.completedVideos.includes(subsectionId)) {
      return ApiResponseFactory.badRequest(res, 'Subsection already marked as completed');
    }

    courseProgress.completedVideos.push(subsectionId);
    await courseProgress.save();

    return ApiResponseFactory.success(res, { message: 'Course progress updated' });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while updating course progress');
  }
};
