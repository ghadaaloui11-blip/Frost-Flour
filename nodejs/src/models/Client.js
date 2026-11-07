// Client inherits User and adds an address.
// Relations: Client 1..1 -- 1..1 Cart, Client 1..1 -- 0..* Order (the Cart and Order point to the client).
const mongoose = require('mongoose');
const User = require('./User');
const { ROLES } = require('./enums');

const clientSchema = new mongoose.Schema({
  address: { type: String, required: true, trim: true },
});

module.exports = User.discriminator(ROLES.CLIENT, clientSchema);
