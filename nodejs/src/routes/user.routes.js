const { Router } = require('express');
const ctrl = require('../controllers/user.controller');
const protect = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { requireFields, validateObjectId } = require('../middlewares/validate');
const { ROLES } = require('../models/enums');

const router = Router();

router.use(protect); // every route below needs a logged-in user

// Logged-in user (client or agent)
router.patch('/me', ctrl.updateProfile);
router.patch('/me/password', requireFields('oldPassword', 'newPassword'), ctrl.changePassword);

// Agent only
router.get('/clients', authorize(ROLES.AGENT), ctrl.listClients);
router.get('/clients/:id', authorize(ROLES.AGENT), validateObjectId('id'), ctrl.getClient);
router.post(
  '/agents',
  authorize(ROLES.AGENT),
  requireFields('firstName', 'lastName', 'email', 'password', 'phone'),
  ctrl.createAgent
);

module.exports = router;
