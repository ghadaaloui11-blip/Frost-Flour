const { Router } = require('express');
const ctrl = require('../controllers/category.controller');
const protect = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { requireFields, validateObjectId } = require('../middlewares/validate');
const { ROLES } = require('../models/enums');

const router = Router();
const agentOnly = [protect, authorize(ROLES.AGENT)];

router.get('/', ctrl.listCategories); // public
router.post('/', agentOnly, requireFields('name'), ctrl.createCategory);
router.patch('/:id', agentOnly, validateObjectId('id'), ctrl.updateCategory);
router.delete('/:id', agentOnly, validateObjectId('id'), ctrl.deleteCategory);

module.exports = router;
