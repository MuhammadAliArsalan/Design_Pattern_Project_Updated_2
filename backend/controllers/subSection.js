/**
 * SubSection Controller
 * Patterns: Singleton (CloudinaryService), Factory (ApiResponseFactory)
 */

const Section            = require('../models/section');
const SubSection         = require('../models/subSection');
const ApiResponseFactory = require('../patterns/factory/ApiResponseFactory');
const cloudinary         = require('../config/CloudinaryService');
require('dotenv').config();


exports.createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId } = req.body;
    const videoFile = req.files?.video;

    if (!title || !description || !videoFile || !sectionId) {
      return ApiResponseFactory.badRequest(res, 'All fields are required');
    }

    // ── SINGLETON: upload video via CloudinaryService ───────────────
    const videoDetails = await cloudinary.upload(videoFile, process.env.FOLDER_NAME);

    const subSection = await SubSection.create({
      title,
      timeDuration: videoDetails.duration,
      description,
      videoUrl:     videoDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: subSection._id } },
      { new: true }
    ).populate('subSection');

    return ApiResponseFactory.success(res, {
      message: 'SubSection created successfully',
      data: updatedSection,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while creating sub-section');
  }
};


exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    if (!subSectionId) return ApiResponseFactory.badRequest(res, 'SubSection ID is required');

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) return ApiResponseFactory.notFound(res, 'SubSection not found');

    if (title)       subSection.title       = title;
    if (description) subSection.description = description;

    if (req.files?.videoFile) {
      // ── SINGLETON ─────────────────────────────────────────────────
      const uploaded        = await cloudinary.upload(req.files.videoFile, process.env.FOLDER_NAME);
      subSection.videoUrl   = uploaded.secure_url;
      subSection.timeDuration = uploaded.duration;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate('subSection');

    return ApiResponseFactory.success(res, {
      message: 'SubSection updated successfully',
      data: updatedSection,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while updating sub-section');
  }
};


exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(sectionId, { $pull: { subSection: subSectionId } });

    const subSection = await SubSection.findByIdAndDelete(subSectionId);
    if (!subSection) return ApiResponseFactory.notFound(res, 'SubSection not found');

    const updatedSection = await Section.findById(sectionId).populate('subSection');

    return ApiResponseFactory.success(res, {
      message: 'SubSection deleted successfully',
      data: updatedSection,
    });
  } catch (error) {
    return ApiResponseFactory.serverError(res, error, 'Error while deleting sub-section');
  }
};
