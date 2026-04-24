/**
 * OBSERVER PATTERN — CourseProgressObserver
 *
 * Reacts to the "student:enrolled" event and creates the initial
 * CourseProgress document (0 completed videos) for the student.
 *
 * By listening to the same event, this concern lives completely
 * separately from the payment and email logic.
 */

const CourseProgress = require('../../../models/courseProgress');

/**
 * @param {{ student: object, course: object, userId: string }} data
 */
const CourseProgressObserver = async ({ userId, course }) => {
  await CourseProgress.create({
    courseID: course._id,
    userId,
    completedVideos: [],
  });
  console.log(`📊 CourseProgress initialised for user ${userId}, course ${course._id}`);
};

module.exports = CourseProgressObserver;
