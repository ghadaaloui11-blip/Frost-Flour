// Cart of the logged-in client (US-18 to US-22). TODO: implement.
// Tip: write a helper getOrCreateCart(clientId) = Cart.findOne({ client }) || Cart.create({ client }).
// The price always comes from the Product in the database, never from the browser.
// eslint-disable-next-line no-unused-vars
const { Cart, Product } = require('../models');
const { notImplemented } = require('../utils/ApiError');

// GET /api/cart — US-19, US-22: cart + total (virtual), with populate('items.product')
async function getCart(req, res) {
  throw notImplemented('US-19');
}

// POST /api/cart/items — US-18: body { productId, quantity }
async function addItem(req, res) {
  throw notImplemented('US-18');
}

// PATCH /api/cart/items/:productId — US-20: body { quantity }
async function updateItemQuantity(req, res) {
  throw notImplemented('US-20');
}

// DELETE /api/cart/items/:productId — US-21
async function removeItem(req, res) {
  throw notImplemented('US-21');
}

// DELETE /api/cart — US-21: empty the cart
async function clearCart(req, res) {
  throw notImplemented('US-21');
}

module.exports = { getCart, addItem, updateItemQuantity, removeItem, clearCart };
