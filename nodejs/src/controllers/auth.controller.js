// Authentication (US-01, US-02, US-03). TODO: implement register and login, following category.controller.js.
// eslint-disable-next-line no-unused-vars
const { User, Client, Cart } = require('../models');
// eslint-disable-next-line no-unused-vars
const { signToken, setAuthCookie, clearAuthCookie } = require('../utils/token');
const ApiError = require('../utils/ApiError');
const { notImplemented } = ApiError;

// POST /api/auth/register — US-01
// Steps: const user = await Client.create(req.body)   (the model hashes the password)
//        await Cart.create({ client: user._id })      (each client has one cart)
//        const token = signToken(user); setAuthCookie(res, token);
//        res.status(201).json({ user, token })
async function register(req, res) {
  throw notImplemented('US-01');
}

// POST /api/auth/login — US-02
// Steps: const user = await User.findOne({ email }).select('+password')
//        if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Wrong email or password')
//        const token = signToken(user); setAuthCookie(res, token); res.json({ user, token })
async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Wrong email or password');
  }
  const token = signToken(user);
  setAuthCookie(res, token);
  res.json({ user, token });
}

// POST /api/auth/logout — US-03: delete the cookie (an API client just forgets its token)
async function logout(req, res) {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
}

// GET /api/auth/me — the logged-in user (req.user is set by the protect middleware)
async function me(req, res) {
  res.json(req.user);
}

module.exports = { register, login, logout, me };
