/**
 * PROTOTYPE PATTERN — CoursePrototype
 *
 * Allows a course (with all its sections and sub-sections) to be
 * deep-cloned into a brand-new draft course.  Instructors can
 * "duplicate" an existing course rather than rebuilding it from scratch.
 *
 * The pattern lives here: instead of the controller knowing every model
 * and relationship, it simply calls CoursePrototype.clone(courseId, instructorId).
 */

const Course      = require('../../models/course');
const Section     = require('../../models/section');
const SubSection  = require('../../models/subSection');

class CoursePrototype {
  /**
   * Deep-clones a course: copies the course document, then clones each
   * section and sub-section so the new course is fully independent.
   *
   * @param {string} sourceCourseId   – ID of the course to clone
   * @param {string} newInstructorId  – owner of the cloned course
   * @returns {object} the newly created Course document
   */
  static async clone(sourceCourseId, newInstructorId) {
    // ── 1. Load the source course with all relations ─────────────────
    const source = await Course.findById(sourceCourseId)
      .populate({ path: 'courseContent', populate: { path: 'subSection' } })
      .exec();

    if (!source) throw new Error(`CoursePrototype: source course ${sourceCourseId} not found`);

    // ── 2. Clone each sub-section ────────────────────────────────────
    const clonedSectionIds = [];

    for (const section of source.courseContent) {
      const clonedSubSectionIds = [];

      for (const sub of section.subSection) {
        const clonedSub = await SubSection.create({
          title:        `${sub.title} (Copy)`,
          timeDuration: sub.timeDuration,
          description:  sub.description,
          videoUrl:     sub.videoUrl,   // reuses the same Cloudinary asset
        });
        clonedSubSectionIds.push(clonedSub._id);
      }

      // ── 3. Clone each section ──────────────────────────────────────
      const clonedSection = await Section.create({
        sectionName: section.sectionName,
        subSection:  clonedSubSectionIds,
      });
      clonedSectionIds.push(clonedSection._id);
    }

    // ── 4. Clone the course itself ───────────────────────────────────
    const clonedCourse = await Course.create({
      courseName:        `${source.courseName} (Copy)`,
      courseDescription: source.courseDescription,
      instructor:        newInstructorId,
      whatYouWillLearn:  source.whatYouWillLearn,
      price:             source.price,
      category:          source.category,
      tag:               [...source.tag],
      instructions:      [...source.instructions],
      thumbnail:         source.thumbnail,
      status:            'Draft',             // clones always start as Draft
      courseContent:     clonedSectionIds,
      createdAt:         Date.now(),
    });

    console.log(`🧬 CoursePrototype: cloned "${source.courseName}" → "${clonedCourse.courseName}"`);
    return clonedCourse;
  }
}

module.exports = CoursePrototype;
