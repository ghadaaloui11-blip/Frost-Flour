// User (base class). Client and Agent inherit from it using Mongoose "discriminators":
// all users live in one "users" collection, and the `role` field says which class it is.
const mongoose = require('mongoose');
const { hashPassword, verifyPassword } = require('../utils/password');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    // select: false -> the password is never returned by queries unless asked with .select('+password')
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,           // createdAt / updatedAt
    discriminatorKey: 'role',   // 'Client' or 'Agent'
  }
);

// Hash the password before saving, only when it was created or changed.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashPassword(this.password);
});

// user.comparePassword('plain text') -> true / false   (used by login, US-02, and changePassword, US-06)
userSchema.methods.comparePassword = function (plainPassword) {
  return verifyPassword(plainPassword, this.password);
};

// Never send the password hash to the front end.
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
