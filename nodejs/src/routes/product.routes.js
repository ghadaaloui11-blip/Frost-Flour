const { Router } = require('express');
const ctrl = require('../controllers/product.controller');
const protect = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { uploadProductImage } = require('../middlewares/upload');
const { requireFields, validateObjectId } = require('../middlewares/validate');
const { ROLES } = require('../models/enums');

const router = Router();
const agentOnly = [protect, authorize(ROLES.AGENT)];

// Public catalog
router.get('/', ctrl.listProducts);
router.get('/:id', validateObjectId('id'), ctrl.getProduct);

// Agent: multer (uploadProductImage) must run BEFORE requireFields, because it is multer
// that reads the multipart form and fills req.body.
router.post('/', agentOnly, uploadProductImage, requireFields('name', 'price', 'category'), ctrl.createProduct);
router.patch('/:id', agentOnly, validateObjectId('id'), uploadProductImage, ctrl.updateProduct);
router.patch('/:id/archive', agentOnly, validateObjectId('id'), ctrl.archiveProduct);

module.exports = router;
