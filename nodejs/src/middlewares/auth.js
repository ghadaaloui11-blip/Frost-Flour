// Middleware: only lets the request through if it carries a valid token,
// either in the "token" cookie (web app) or in "Authorization: Bearer <token>" (Postman/API).
// After it runs, the logged-in user is available as req.user in the next handlers.
const ApiError = require('../utils/ApiError');
const { verifyToken, COOKIE_NAME } = require('../utils/token');
const { User } = require('../models');

function readToken(req) {
  if (req.cookies?.[COOKIE_NAME]) return req.cookies[COOKIE_NAME];

  const [type, token] = (req.headers.authorization || '').split(' ');
  return type === 'Bearer' ? token : null;
}

async function protect(req, res, next) {
  const token = readToken(req);
  if (!token) throw new ApiError(401, 'You must be logged in');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'User no longer exists');

  req.user = user;
  next();
}

module.exports = protect;
