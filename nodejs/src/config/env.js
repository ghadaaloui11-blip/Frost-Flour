// All settings read from the .env file, with safe defaults for local development.
// Copy .env.example to .env and change the values there.

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/frost_flour',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  // Payment provider is still an open decision (see the backlog Summary sheet).
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || 'simulated',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || 'dev-webhook-secret',
};
