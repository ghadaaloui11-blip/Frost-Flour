// Payment (US-32, US-33, US-34). TODO: implement once the provider is chosen
// (Stripe may not work for Tunisian accounts: test in week 1, otherwise use a simulated payment page).
// eslint-disable-next-line no-unused-vars
const { Payment, Order, PAYMENT_STATUS } = require('../models');
// eslint-disable-next-line no-unused-vars
const orderEvents = require('../events/orderEvents');
const { notImplemented } = require('../utils/ApiError');

// POST /api/payments/:orderId/pay — US-32: start the payment with the provider for the client's own order,
// store payment.transactionId, return what the front end needs (redirect URL or simulated page).
// If the last attempt FAILED, the client can call this again (retry).
async function payOrder(req, res) {
  throw notImplemented('US-32');
}

// POST /api/payments/webhook — US-33: called by the provider (not by the browser).
// Find the Payment by transactionId, payment.confirm(transactionId) or updateStatus(FAILED),
// then orderEvents.emit('payment:updated', payment). Check the provider signature first!
async function paymentWebhook(req, res) {
  throw notImplemented('US-33');
}

// GET /api/payments/:orderId — US-34: payment status of an order (owner client or agent)
async function getPaymentStatus(req, res) {
  throw notImplemented('US-34');
}

module.exports = { payOrder, paymentWebhook, getPaymentStatus };
