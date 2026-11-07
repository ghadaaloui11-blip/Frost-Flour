// Small validation middlewares, so controllers receive clean data.
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');

// requireFields('email', 'password') -> 400 if one of them is missing or empty in req.body
function requireFields(...fields) {
  return (req, res, next) => {
    const missing = fields.filter((f) => req.body?.[f] === undefined || req.body[f] === '');
    if (missing.length) {
      throw new ApiError(400, `Missing field(s): ${missing.join(', ')}`);
    }
    next();
  };
}

// validateObjectId('id') -> 400 if req.params.id is not a valid MongoDB id
function validateObjectId(param = 'id') {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[param])) {
      throw new ApiError(400, `Invalid ${param}`);
    }
    next();
  };
}

module.exports = { requireFields, validateObjectId };
