/**
 * REPOSITORY PATTERN — UserRepository
 *
 * All database operations that involve the User model live here.
 * Controllers import this class — never the Mongoose model directly.
 */

const BaseRepository = require('./BaseRepository');
const User = require('../models/user');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // ── Finders ───────────────────────────────────────────────────────

  async findByEmail(email) {
    return this._model.findOne({ email }).exec();
  }

  async findByEmailWithProfile(email) {
    return this._model.findOne({ email }).populate('additionalDetails').exec();
  }

  async findByIdWithProfile(id) {
    return this._model.findById(id).populate('additionalDetails').exec();
  }

  async findByResetToken(token) {
    return this._model.findOne({ token }).exec();
  }

  // ── Mutations ─────────────────────────────────────────────────────

  async pushCourse(userId, courseId) {
    return this.updateById(userId, { $push: { courses: courseId } });
  }

  async pushCourseProgress(userId, courseProgressId) {
    return this.updateById(userId, { $push: { courseProgress: courseProgressId } });
  }

  async pullCourse(userId, courseId) {
    return this.updateById(userId, { $pull: { courses: courseId } });
  }

  async updatePassword(userId, hashedPassword) {
    return this.updateById(userId, { password: hashedPassword });
  }

  async updateProfileImage(userId, imageUrl) {
    return this.updateById(userId, { image: imageUrl });
  }

  async setResetToken(email, token, expiresAt) {
    return this.updateOne(
      { email },
      { token, resetPasswordTokenExpires: expiresAt }
    );
  }

  // ── Bulk enroll helpers ───────────────────────────────────────────

  async enrollInCourse(userId, courseId, courseProgressId) {
    return this.updateById(userId, {
      $push: { courses: courseId, courseProgress: courseProgressId },
    });
  }
}

module.exports = new UserRepository();
