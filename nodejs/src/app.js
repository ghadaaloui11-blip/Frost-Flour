// Builds the Express application: global middlewares, routes, then error handling.
// The order of app.use() calls matters: a request goes through them from top to bottom.
const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const { CLIENT_URL } = require('./config/env');
const logger = require('./middlewares/logger');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// ---- 1. Global middlewares (run for every request)
app.use(logger);                                       // morgan: console + logs/access.log
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); // security headers (images usable by the React app)
app.use(cors({ origin: CLIENT_URL, credentials: true })); // allow the React app, with cookies
app.use(compression());                                // gzip responses (zlib, like in the TD)
app.use(cookieParser());                               // read cookies into req.cookies
app.use(express.json({ limit: '1mb' }));               // parse JSON bodies into req.body
app.use(express.urlencoded({ extended: true }));       // parse HTML form bodies

// Product images uploaded with multer are served as static files: /uploads/products/<file>
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ---- 2. Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use('/api', routes);

// ---- 3. Errors (must be last)
app.use(notFound);      // no route matched -> 404
app.use(errorHandler);  // any error thrown above ends here

module.exports = app;
