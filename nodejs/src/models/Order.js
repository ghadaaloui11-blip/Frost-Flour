// Order with its OrderItems (aggregation Order 1..1 <>-- 0..* OrderItem).
// OrderItems keep a copy of the product name and price, so old orders stay correct
// even if the product is edited or archived later (US-13).
const mongoose = require('mongoose');
const { ORDER_STATUS } = require('./enums');
const { canTransition } = require('../utils/orderStatus');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },              // copy of the product name
  quantity: { type: Number, required: true, min: 1 },
  itemPrice: { type: Number, required: true, min: 0 }, // copy of the unit price
});

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: {
      type: [orderItemSchema],
      validate: [(items) => items.length > 0, 'An order needs at least one item'],
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

// Recompute the total from the items (the server always computes prices, never the browser).
orderSchema.methods.computeTotal = function () {
  this.total = this.items.reduce((sum, i) => sum + i.itemPrice * i.quantity, 0);
  return this.total;
};

// US-27: the client can cancel only while the order is PENDING.
orderSchema.methods.canBeCancelled = function () {
  return this.status === ORDER_STATUS.PENDING;
};

// US-44: the client can modify the order while it is not in preparation yet.
orderSchema.methods.canBeModified = function () {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(this.status);
};

// US-29 / US-30: change the status only if the state diagram allows it.
orderSchema.methods.updateStatus = function (nextStatus) {
  if (!canTransition(this.status, nextStatus)) {
    return false;
  }
  this.status = nextStatus;
  return true;
};

// US-25: the orders of one client, newest first.
orderSchema.statics.findByClient = function (clientId) {
  return this.find({ client: clientId }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);
