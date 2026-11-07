const { Router } = require('express');
const ctrl = require('../controllers/cart.controller');
const protect = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { requireFields, validateObjectId } = require('../middlewares/validate');
const { ROLES } = require('../models/enums');

const router = Router();

router.use(protect, authorize(ROLES.CLIENT)); // only clients have a cart

router.get('/', ctrl.getCart);
router.delete('/', ctrl.clearCart);
router.post('/items', requireFields('productId', 'quantity'), ctrl.addItem);
router.patch('/items/:productId', validateObjectId('productId'), requireFields('quantity'), ctrl.updateItemQuantity);
router.delete('/items/:productId', validateObjectId('productId'), ctrl.removeItem);

module.exports = router;
