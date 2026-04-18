/**
 * REPOSITORY PATTERN — CourseRepository
 *
 * All database operations involving the Course model live here.
 */

const BaseRepository = require('./BaseRepository');
const Course = require('../models/course');

class CourseRepository extends BaseRepository {
  constructor() {
    super(Course);
  }

  // ── Rich finders ──────────────────────────────────────────────────

  async findWithFullDetails(courseId) {
    return this._model
      .findById(courseId)
      .populate({ path: 'instructor', populate: { path: 'additionalDetails' } })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({ path: 'courseContent', populate: { path: 'subSection' } })
      .exec();
  }

  async findPublicDetails(courseId) {
    return this._model
      .findById(courseId)
      .populate({ path: 'instructor', populate: { path: 'additionalDetails' } })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({ path: 'courseContent', populate: { path: 'subSection', select: '-videoUrl' } })
      .exec();
  }

  async findAllPublished() {
    return this._model
      .find({}, {
        courseName: true, courseDescription: true, price: true,
        thumbnail: true, instructor: true, ratingAndReviews: true, studentsEnrolled: true,
      })
      .populate({ path: 'instructor', select: 'firstName lastName email image' })
      .exec();
  }

  async findByInstructor(instructorId) {
    return this._model.find({ instructor: instructorId }).sort({ createdAt: -1 }).exec();
  }

  // ── Mutations ─────────────────────────────────────────────────────

  async pushSection(courseId, sectionId) {
    return this.updateById(courseId, { $push: { courseContent: sectionId } });
  }

  async pushRating(courseId, ratingId) {
    return this.updateById(courseId, { $push: { ratingAndReviews: ratingId } });
  }

  async enrollStudent(courseId, userId) {
    return this.updateById(courseId, { $push: { studentsEnrolled: userId } });
  }

  async unenrollStudent(courseId, userId) {
    return this.updateById(courseId, { $pull: { studentsEnrolled: userId } });
  }

  async isStudentEnrolled(courseId, userId) {
    const mongoose = require('mongoose');
    const uid = new mongoose.Types.ObjectId(userId);
    const doc = await this._model.findOne({ _id: courseId, studentsEnrolled: uid }).select('_id').lean();
    return !!doc;
  }

  async findPublishedByCategory(categoryId) {
    return this._model
      .findById(categoryId)
      .populate({ path: 'courses', match: { status: 'Published' }, populate: 'ratingAndReviews' })
      .exec();
  }
}

module.exports = new CourseRepository();
