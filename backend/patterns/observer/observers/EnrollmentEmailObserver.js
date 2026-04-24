/**
 * OBSERVER PATTERN — EnrollmentEmailObserver
 *
 * Reacts to the "student:enrolled" event and sends the
 * confirmation email to the newly-enrolled student.
 *
 * The payment controller does not import nodemailer or any mail
 * template directly — it only fires the event.
 */

const mailer = require('../../../config/MailTransporter');
const { courseEnrollmentEmail } = require('../../../mail/templates/courseEnrollmentEmail')

/**
 * @param {{ student: object, course: object }} data
 */
const EnrollmentEmailObserver = async ({ student, course }) => {
  await mailer.send(
    student.email,
    `Successfully Enrolled into ${course.courseName}`,
    courseEnrollmentEmail(course.courseName, student.firstName)
  );
  console.log(`📧 Enrollment email sent to ${student.email}`);
};

module.exports = EnrollmentEmailObserver;
