const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary from environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image buffer to Cloudinary and return the secure URL.
 * @param {Buffer} buffer - image data
 * @returns {Promise<string>} secure image URL
 */
const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return reject(new Error('Cloudinary credentials not configured'));
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'social-media/posts', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { uploadImage, cloudinary };