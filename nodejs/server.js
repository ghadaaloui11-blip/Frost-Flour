// Entry point of the API.
// 1. load the .env file  2. connect to MongoDB  3. start an HTTP server with the Express app.
require('dotenv').config();

const http = require('node:http');
const mongoose = require('mongoose');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/env');
require('./src/events/orderEvents'); // registers the order event listeners

async function start() {
  await connectDB();

  // Express is "just" a request handler: we give it to Node's own http module.
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Frost & Flour API running on http://localhost:${PORT}`);
  });

  // Close the server and the database cleanly when you press Ctrl+C.
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  });
}

start().catch((err) => {
  console.error('Failed to start the server:', err.message);
  process.exit(1);
});
