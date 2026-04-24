/**
 * RatingAndReview Controller
 * Patterns: Repository (CourseRepository), Factory (ApiResponseFactory)
 */

const mongoose           = require('mongoose');
const RatingAndReview    = require('../models/ratingAndReview');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const courseRepo         = require('../repositories/CourseRepository');


exports.createRating = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;
    const userId = req.user.id;

    if (!rating || !review || !courseId) {
      return ApiResponseFactory.badRequest(res, 'All fields are required');
    }

    // Check enrollment via repository
    const isEnrolled = await courseRepo.isStudentEnrolled(courseId, userId);
    if (!isEnrolled) {
      return ApiResponseFactory.forbidden(res, 'Student is not enrolled in this course');
    }

    const alreadyReviewed = await RatingAndReview.findOne({ course: courseId, user: userId });
    if (alreadyReviewed) {
      return ApiResponseFactory.forbidden(res, 'You have already reviewed this course');
    }

    const ratingReview = await RatingAndReview.create({ user: userId, course: courseId, rating, review });

    // ── REPOSITORY: link rating to course ──────────────────────────
    await courseRepo.pushRating(courseId, ratingReview._id);

    return ApiResponseFactory.success(res, {
      message: 'Rating and review created successfully',
      data: ratingReview,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while creating rating');
  }
};


exports.getAverageRating = async (req, res) => {
  try {
    const { courseId } = req.body;

    const result = await RatingAndReview.aggregate([
      { $match: { course: new mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);

    const averageRating = result.length > 0 ? result[0].averageRating : 0;

    return ApiResponseFactory.success(res, {
      message: averageRating === 0 ? 'No ratings yet' : 'Average rating fetched',
      data: { averageRating },
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching average rating');
  }
};


exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: 'desc' })
      .populate({ path: 'user',   select: 'firstName lastName email image' })
      .populate({ path: 'course', select: 'courseName' })
      .exec();

    return ApiResponseFactory.success(res, {
      message: 'All reviews fetched successfully',
      data: allReviews,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while fetching all ratings');
  }
};
