// Products and catalog (US-12, US-13, US-14, US-15, US-16).
// Pattern follows category.controller.js: read request -> use model -> send JSON.
// Throw ApiError for expected problems; Express 5 sends it to errorHandler.
const fs = require('node:fs');
const path = require('node:path');
const { Product, Category } = require('../models');
const ApiError = require('../utils/ApiError');

// GET /api/products?category=<id>&search=<text>&includeArchived=true — US-14, US-15 (public)
// Archived products are hidden by default. Agents pass includeArchived=true.
async function listProducts(req, res) {
  const { category, search, includeArchived } = req.query;
  const filter = {};
  if (includeArchived !== 'true') filter.isArchived = false;
  if (category) filter.category = category;
  // Use regex for partial/live search (better UX than $text which requires full words).
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 });
  res.json(products);
}

// GET /api/products/:id — US-16 (public)
async function getProduct(req, res) {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) throw new ApiError(404, 'Product not found');
  res.json(product);
}

// POST /api/products — US-12 (Agent). multipart/form-data: name, description, price, category + file "image".
// requireFields('name','price','category') already ran in the route. multer put the file in req.file.
async function createProduct(req, res) {
  const { name, description, price, category } = req.body;

  // Verify the category exists before saving the reference.
  const cat = await Category.findById(category);
  if (!cat) throw new ApiError(400, 'Selected category does not exist');

  const productData = {
    name: name.trim(),
    description: description ? description.trim() : '',
    price: Number(price),
    category,
  };
  if (req.file) productData.image = `/uploads/products/${req.file.filename}`;

  const product = await Product.create(productData);
  const populated = await Product.findById(product._id).populate('category', 'name');
  res.status(201).json(populated);
}

// PATCH /api/products/:id — US-13 (Agent). Image replaced only if req.file exists.
async function updateProduct(req, res) {
  const { name, description, price, category } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  // Validate category if a new one is provided.
  if (category) {
    const cat = await Category.findById(category);
    if (!cat) throw new ApiError(400, 'Selected category does not exist');
  }

  // Apply only the fields that were sent.
  if (name !== undefined) product.name = name.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined) product.price = Number(price);
  if (category) product.category = category;

  // Replace image only when a new file was uploaded; preserve the old one otherwise.
  if (req.file) {
    if (product.image) {
      const oldPath = path.join(__dirname, '..', '..', product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    product.image = `/uploads/products/${req.file.filename}`;
  }

  await product.save();
  const updated = await Product.findById(product._id).populate('category', 'name');
  res.json(updated);
}

// PATCH /api/products/:id/archive — US-13 (Agent). Body { isArchived: true | false }
async function archiveProduct(req, res) {
  const { isArchived = true } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  product.isArchived = isArchived;
  await product.save();
  const updated = await Product.findById(product._id).populate('category', 'name');
  res.json(updated);
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, archiveProduct };
