// Profile and accounts (US-05, US-06, US-07, US-09). TODO: implement.
// Note: agents can only VIEW client accounts; they cannot edit or delete them.
// eslint-disable-next-line no-unused-vars
const { User, Client, Agent } = require('../models');
const { notImplemented } = require('../utils/ApiError');

// PATCH /api/users/me — US-05: update firstName, lastName, phone (and address for a client). Never email/role/password here.
async function updateProfile(req, res) {
  throw notImplemented('US-05');
}

// PATCH /api/users/me/password — US-06: body { oldPassword, newPassword }; check the old one with comparePassword, then save.
async function changePassword(req, res) {
  throw notImplemented('US-06');
}

// GET /api/users/clients — US-07 (Agent, read-only list)
async function listClients(req, res) {
  throw notImplemented('US-07');
}

// GET /api/users/clients/:id — US-07 (Agent, read-only)
async function getClient(req, res) {
  throw notImplemented('US-07');
}

// POST /api/users/agents — US-09 (Agent creates another Agent)
async function createAgent(req, res) {
  throw notImplemented('US-09');
}

module.exports = { updateProfile, changePassword, listClients, getClient, createAgent };
