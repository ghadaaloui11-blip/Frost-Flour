// JSON Web Tokens. After login the server:
//  - puts the token in an httpOnly cookie (for the web app: the browser sends it automatically)
//  - also returns it in the JSON body (for Postman / API clients: "Authorization: Bearer <token>")
// A token signed by another server (other secret) or expired is refused by verifyToken.
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } = require('../config/env');

const COOKIE_NAME = 'token';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET); // throws if invalid or expired
}

const cookieOptions = {
  httpOnly: true,                    // JavaScript in the page cannot read it
  sameSite: 'lax',
  secure: NODE_ENV === 'production', // HTTPS only in production
  maxAge: 24 * 60 * 60 * 1000,       // 1 day, same as JWT_EXPIRES_IN by default
};

// res = Express response
function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
}

module.exports = { COOKIE_NAME, signToken, verifyToken, setAuthCookie, clearAuthCookie };
