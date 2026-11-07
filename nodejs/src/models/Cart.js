// Cart (1 per client) with its CartItems (aggregation Cart 1..1 <>-- 0..* CartItem).
// CartItems are stored inside the cart document (sub-documents), so there is no separate collection.
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  itemPrice: { type: Number, required: true, min: 0 }, // unit price when the item was added
});

const cartSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// cart.total is computed, never stored (US-19).
cartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);
});

// US-18: add a product, or increase its quantity if it is already in the cart.
cartSchema.methods.addItem = function (productId, quantity, unitPrice) {
  const existing = this.items.find((i) => i.product.equals(productId));
  if (existing) existing.quantity += quantity;
  else this.items.push({ product: productId, quantity, itemPrice: unitPrice });
};

// US-20: set the quantity of one product.
cartSchema.methods.updateQuantity = function (productId, quantity) {
  const item = this.items.find((i) => i.product.equals(productId));
  if (!item) return false;
  item.quantity = quantity;
  return true;
};

// US-21: remove one product, or empty the whole cart.
cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter((i) => !i.product.equals(productId));
};
cartSchema.methods.clear = function () {
  this.items = [];
};

module.exports = mongoose.model('Cart', cartSchema);
