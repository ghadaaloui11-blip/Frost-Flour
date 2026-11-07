// Payment: Order 1..1 -- 0..1 Payment (an order has at most one payment).
const mongoose = require('mongoose');
const { PAYMENT_STATUS } = require('./enums');

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentDate: { type: Date },        // set when the payment becomes PAID
    transactionId: { type: String },    // id given by the payment provider (US-32, US-33)
    provider: { type: String, default: 'simulated' },
  },
  { timestamps: true }
);

// US-33: called by the webhook when the provider confirms the payment.
paymentSchema.methods.confirm = function (transactionId) {
  this.transactionId = transactionId;
  this.paymentStatus = PAYMENT_STATUS.PAID;
  this.paymentDate = new Date();
};

paymentSchema.methods.updateStatus = function (status) {
  this.paymentStatus = status;
  if (status === PAYMENT_STATUS.PAID && !this.paymentDate) this.paymentDate = new Date();
};

module.exports = mongoose.model('Payment', paymentSchema);
