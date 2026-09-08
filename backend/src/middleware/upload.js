const multer = require('multer');

/**
 * Multer storage configured to buffer the image in memory before
 * uploading to Cloudinary. No file is written to disk.
 */
const storage = multer.memoryStorage();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      const err = new Error('Only image files are allowed');
      err.statusCode = 400;
      cb(err, false);
    }
  },
});

module.exports = upload;