// Middleware: very small in-memory rate limiter (protects login/register from brute force).
// rateLimiter({ windowMs: 15 * 60 * 1000, max: 20 }) -> max 20 requests per IP every 15 minutes.
const ApiError = require('../utils/ApiError');

function rateLimiter({ windowMs = 15 * 60 * 1000, max = 20 } = {}) {
  const hits = new Map(); // ip -> { count, resetAt }

  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip);

    if (!entry || entry.resetAt < now) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
      throw new ApiError(429, 'Too many requests, try again later');
    }
    next();
  };
}

module.exports = rateLimiter;
