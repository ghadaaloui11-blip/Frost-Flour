// Products and catalog (US-12, US-13, US-14, US-15, US-16). TODO: implement.
// eslint-disable-next-line no-unused-vars
const { Product, Category } = require('../models');
const { notImplemented } = require('../utils/ApiError');

// GET /api/products?category=<id>&search=<text> — US-14, US-15 (public)
// Only products with isArchived: false. Use { $text: { $search: search } } for the search.
async function listProducts(req, res) {
  throw notImplemented('US-14');
}

// GET /api/products/:id — US-16 (public), populate('category')
async function getProduct(req, res) {
  throw notImplemented('US-16');
}

// POST /api/products — US-12 (Agent). multipart/form-data: name, description, price, category + file "image".
// The uploaded file is in req.file -> image: `/uploads/products/${req.file.filename}`
async function createProduct(req, res) {
  throw notImplemented('US-12');
}

// PATCH /api/products/:id — US-13 (Agent). The image is optional (replace it only if req.file exists).
async function updateProduct(req, res) {
  throw notImplemented('US-13');
}

// PATCH /api/products/:id/archive — US-13 (Agent). Body { isArchived: true | false }
async function archiveProduct(req, res) {
  throw notImplemented('US-13');
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, archiveProduct };
