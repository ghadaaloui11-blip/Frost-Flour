const { Router } = require('express');
const ctrl = require('../controllers/order.controller');
const protect = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { requireFields, validateObjectId } = require('../middlewares/validate');
const { ROLES } = require('../models/enums');

const router = Router();
const clientOnly = authorize(ROLES.CLIENT);
const agentOnly = authorize(ROLES.AGENT);

router.use(protect);

// Client
router.post('/', clientOnly, ctrl.createOrder);
router.get('/mine', clientOnly, ctrl.listMyOrders); // must be declared before '/:id'
router.patch('/:id', clientOnly, validateObjectId('id'), ctrl.modifyMyOrder);
router.patch('/:id/cancel', clientOnly, validateObjectId('id'), ctrl.cancelMyOrder);

// Agent
router.get('/', agentOnly, ctrl.listAllOrders);
router.patch('/:id/status', agentOnly, validateObjectId('id'), requireFields('status'), ctrl.updateOrderStatus);
router.patch('/:id/reject', agentOnly, validateObjectId('id'), ctrl.rejectOrder);

// Both (the controller checks that a client only sees his own order)
router.get('/:id', validateObjectId('id'), ctrl.getOrder);

module.exports = router;
