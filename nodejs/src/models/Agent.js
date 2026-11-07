// Agent (bakery staff) inherits User and adds nothing for now.
const mongoose = require('mongoose');
const User = require('./User');
const { ROLES } = require('./enums');

const agentSchema = new mongoose.Schema({});

module.exports = User.discriminator(ROLES.AGENT, agentSchema);
