// Middleware for product image uploads (US-12, US-13), using multer.
// Usage:  router.post('/', uploadProductImage, createProduct)  -> the file is in req.file
const path = require('node:path');
const crypto = require('node:crypto');
const multer = require('multer');
const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads', 'products'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new ApiError(400, 'Only JPG, PNG or WEBP images are allowed'));
  },
});

// The form field must be named "image".
module.exports = { uploadProductImage: upload.single('image') };
