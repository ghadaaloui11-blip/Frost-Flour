// Middleware factory for role-based access control (US-04).
// Usage:  router.post('/', protect, authorize(ROLES.AGENT), createCategory)
const ApiError = require('../utils/ApiError');

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'You are not allowed to do this');
    }
    next();
  };
}

module.exports = authorize;
