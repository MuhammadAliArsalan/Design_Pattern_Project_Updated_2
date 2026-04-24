/**
 * SINGLETON PATTERN — CloudinaryService
 *
 * Configures the cloudinary SDK exactly once and exposes
 * upload / delete helpers.  Any module importing this file
 * receives the same configured instance.
 */

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

class CloudinaryService {
  constructor() {
    if (CloudinaryService._instance) {
      return CloudinaryService._instance;
    }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    this._client = cloudinary;
    CloudinaryService._instance = this;
    console.log('✅ Cloudinary configured (Singleton)');
  }

  static getInstance() {
    if (!CloudinaryService._instance) {
      new CloudinaryService();
    }
    return CloudinaryService._instance;
  }

  // ── Upload a file (image or video) ──────────────────────────────────
  async upload(file, folder, height = null, quality = null) {
    if (!file) throw new Error('No file provided to CloudinaryService.upload');

    const filePath = file.tempFilePath;
    if (!filePath) throw new Error('tempFilePath missing — check file-upload middleware');

    const options = { folder, resource_type: 'auto' };
    if (height) options.height = height;
    if (quality) options.quality = quality;

    const result = await this._client.uploader.upload(filePath, options);
    return result;
  }

  // ── Delete a resource by public URL / public_id ──────────────────────
  async delete(publicId) {
    if (!publicId) return null;
    const result = await this._client.uploader.destroy(publicId);
    console.log('🗑️  Cloudinary delete:', result);
    return result;
  }
}

CloudinaryService._instance = null;

module.exports = CloudinaryService.getInstance();
