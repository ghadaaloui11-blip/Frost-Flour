const { Router } = require('express');
const ctrl = require('../controllers/auth.controller');
const protect = require('../middlewares/auth');
const rateLimiter = require('../middlewares/rateLimiter');
const { requireFields } = require('../middlewares/validate');

const router = Router();
const authLimiter = rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 });

router.post(
  '/register',
  authLimiter,
  requireFields('firstName', 'lastName', 'email', 'password', 'phone', 'address'),
  ctrl.register
);
router.post('/login', authLimiter, requireFields('email', 'password'), ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.get('/me', protect, ctrl.me);

module.exports = router;
