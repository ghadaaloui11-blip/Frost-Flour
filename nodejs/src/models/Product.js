// Product: belongs to one Category. The image is uploaded at creation (US-12).
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    image: { type: String, default: '' },          // e.g. "/uploads/products/1730990000-cake.jpg"
    isArchived: { type: Boolean, default: false }, // US-13: archived products leave the catalog
  },
  { timestamps: true }
);

// Text index used by the catalog search (US-15).
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
