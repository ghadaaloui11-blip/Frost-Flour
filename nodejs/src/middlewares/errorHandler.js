// Error-handling middleware (4 arguments!). Every error ends here and becomes a clean JSON answer:
// { "message": "...", "details": ... }
const mongoose = require('mongoose');
const multer = require('multer');
const ApiError = require('../utils/ApiError');
const { NODE_ENV } = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = 500;
  let message = 'Something went wrong';
  let details;

  if (err instanceof ApiError) {
    status = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Invalid data';
    details = Object.fromEntries(Object.entries(err.errors).map(([k, e]) => [k, e.message]));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = `Already exists: ${Object.keys(err.keyValue || {}).join(', ')}`;
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.message;
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body';
  }

  if (status === 500) console.error(err);

  res.status(status).json({
    message,
    ...(details && { details }),
    ...(NODE_ENV === 'development' && status === 500 && { stack: err.stack }),
  });
}

module.exports = errorHandler;
