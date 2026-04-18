/**
 * BUILDER PATTERN — CourseBuilder
 *
 * Constructs a Course document piece by piece.  The controller sets
 * individual attributes through fluent setters and calls build() to
 * persist.  This makes course creation readable, testable, and easy
 * to extend (e.g. adding a "language" field later changes only this class).
 *
 * Usage:
 *   const course = await new CourseBuilder()
 *     .setBasicInfo(name, description, whatYouWillLearn)
 *     .setInstructor(instructorId)
 *     .setPrice(price)
 *     .setCategory(categoryId)
 *     .setMedia(thumbnailUrl)
 *     .setMeta({ tag, instructions, status })
 *     .build();
 */

const Course = require('../../models/course');

class CourseBuilder {
  constructor() {
    this._data = {
      status: 'Draft',
      tag: [],
      instructions: [],
      createdAt: Date.now(),
    };
  }

  setBasicInfo(courseName, courseDescription, whatYouWillLearn) {
    this._data.courseName        = courseName;
    this._data.courseDescription = courseDescription;
    this._data.whatYouWillLearn  = whatYouWillLearn;
    return this;
  }

  setInstructor(instructorId) {
    this._data.instructor = instructorId;
    return this;
  }

  setPrice(price) {
    this._data.price = price;
    return this;
  }

  setCategory(categoryId) {
    this._data.category = categoryId;
    return this;
  }

  setMedia(thumbnailUrl) {
    this._data.thumbnail = thumbnailUrl;
    return this;
  }

  setMeta({ tag = [], instructions = [], status = 'Draft' } = {}) {
    this._data.tag          = tag;
    this._data.instructions = instructions;
    this._data.status       = status;
    return this;
  }

  /** Validates required fields before persisting */
  _validate() {
    const required = [
      'courseName', 'courseDescription', 'whatYouWillLearn',
      'instructor', 'price', 'category', 'thumbnail',
    ];
    const missing = required.filter((k) => !this._data[k]);
    if (missing.length) {
      throw new Error(`CourseBuilder: missing required fields — ${missing.join(', ')}`);
    }
  }

  /** Saves to the database and returns the created document */
  async build() {
    this._validate();
    const course = await Course.create(this._data);
    console.log(`🏗️  CourseBuilder: created course "${course.courseName}"`);
    return course;
  }

  /** Returns the raw plain object without persisting (useful for tests) */
  toPlainObject() {
    this._validate();
    return { ...this._data };
  }
}

module.exports = CourseBuilder;
