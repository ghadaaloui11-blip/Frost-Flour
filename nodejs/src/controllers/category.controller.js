// Categories (US-10, US-11). FULLY WRITTEN: use it as the example for the other controllers.
// Pattern: read the request -> use the model -> send JSON. Throw ApiError for expected problems;
// Express 5 sends any thrown error to the errorHandler middleware automatically.
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

// GET /api/categories   (public)
async function listCategories(req, res) {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
}

// POST /api/categories   (Agent) — US-10
async function createCategory(req, res) {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
}

// PATCH /api/categories/:id   (Agent) — US-10
async function updateCategory(req, res) {
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!category) throw new ApiError(404, 'Category not found');
  res.json(category);
}

// DELETE /api/categories/:id   (Agent) — US-11: refused while the category has products
async function deleteCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');

  if (await category.hasProducts()) {
    throw new ApiError(409, 'This category still has products');
  }

  await category.deleteOne();
  res.status(204).end();
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
