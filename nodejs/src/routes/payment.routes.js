const { Router } = require('express');
const ctrl = require('../controllers/payment.controller');
const protect = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { validateObjectId } = require('../middlewares/validate');
const { ROLES } = require('../models/enums');

const router = Router();

// Called by the payment provider, not by a logged-in user (US-33).
router.post('/webhook', ctrl.paymentWebhook);

router.post('/:orderId/pay', protect, authorize(ROLES.CLIENT), validateObjectId('orderId'), ctrl.payOrder);
router.get('/:orderId', protect, validateObjectId('orderId'), ctrl.getPaymentStatus);

module.exports = router;
