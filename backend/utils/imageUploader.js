/**
 * imageUploader — thin wrapper kept for backward-compat with any existing
 * routes that import from utils/imageUploader.
 *
 * All real logic now lives in the CloudinaryService Singleton.
 */

const cloudinary = require('../config/CloudinaryService');

exports.uploadImageToCloudinary   = (file, folder, height, quality) =>
  cloudinary.upload(file, folder, height, quality);

exports.deleteResourceFromCloudinary = (publicId) =>
  cloudinary.delete(publicId);
