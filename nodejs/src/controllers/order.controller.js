// Orders (US-24 to US-30, US-42, US-44). TODO: implement.
// Status rules live in the Order model (canBeCancelled, canBeModified, updateStatus)
// and in utils/orderStatus.js (state diagram). Emit events with orderEvents.
// eslint-disable-next-line no-unused-vars
const { Order, Cart, Payment, ORDER_STATUS } = require('../models');
// eslint-disable-next-line no-unused-vars
const orderEvents = require('../events/orderEvents');
const { notImplemented } = require('../utils/ApiError');

// ---------- Client

// POST /api/orders — US-24: create the Order from the cart (copy name + price into OrderItems),
// computeTotal(), create a Payment { amount: total, paymentStatus: PENDING }, empty the cart,
// orderEvents.emit('order:created', order)
async function createOrder(req, res) {
  throw notImplemented('US-24');
}

// GET /api/orders/mine — US-25: Order.findByClient(req.user._id)
async function listMyOrders(req, res) {
  throw notImplemented('US-25');
}

// PATCH /api/orders/:id — US-44: modify items while order.canBeModified() (PENDING or CONFIRMED)
async function modifyMyOrder(req, res) {
  throw notImplemented('US-44');
}

// PATCH /api/orders/:id/cancel — US-27: only if order.canBeCancelled() -> status CANCELLED
async function cancelMyOrder(req, res) {
  throw notImplemented('US-27');
}

// ---------- Client (own order) or Agent

// GET /api/orders/:id — US-26 (client, only his own order) / US-42 (agent: populate client for the phone)
// Also return the payment: Payment.findOne({ order: order._id })
async function getOrder(req, res) {
  throw notImplemented('US-26 / US-42');
}

// ---------- Agent

// GET /api/orders?status=PENDING — US-28: all orders with their payment status
async function listAllOrders(req, res) {
  throw notImplemented('US-28');
}

// PATCH /api/orders/:id/status — US-29: body { status }; refuse with 400 if !order.updateStatus(status)
async function updateOrderStatus(req, res) {
  throw notImplemented('US-29');
}

// PATCH /api/orders/:id/reject — US-30: PENDING -> REJECTED
async function rejectOrder(req, res) {
  throw notImplemented('US-30');
}

module.exports = {
  createOrder,
  listMyOrders,
  modifyMyOrder,
  cancelMyOrder,
  getOrder,
  listAllOrders,
  updateOrderStatus,
  rejectOrder,
};
