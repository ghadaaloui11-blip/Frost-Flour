// Connects Mongoose to MongoDB (local server, Docker container or Atlas: only MONGODB_URI changes).
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./env');

async function connectDB() {
  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));
  mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

  await mongoose.connect(MONGODB_URI);
}

module.exports = connectDB;
