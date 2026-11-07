// An error that carries an HTTP status code.
// Usage in a controller:  throw new ApiError(404, 'Product not found');
// Express 5 catches errors thrown in async handlers and sends them to errorHandler.
class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Used by controllers that are not written yet.
function notImplemented(story) {
  return new ApiError(501, `Not implemented yet (${story})`);
}

module.exports = ApiError;
module.exports.notImplemented = notImplemented;
