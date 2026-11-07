// Category: Product 0..* -- 1..1 Category (each product belongs to one category).
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

// US-11: a category can only be deleted when it has no products.
categorySchema.methods.hasProducts = async function () {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ category: this._id });
  return count > 0;
};

module.exports = mongoose.model('Category', categorySchema);
