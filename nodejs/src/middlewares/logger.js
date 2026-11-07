// Logger middleware (morgan): logs every request in the console AND appends it to logs/access.log
// through a write stream (same idea as fs.createWriteStream in the TPs).
const fs = require('node:fs');
const path = require('node:path');
const morgan = require('morgan');

const logDir = path.join(__dirname, '..', '..', 'logs');
fs.mkdirSync(logDir, { recursive: true });
const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' }); // 'a' = append

const consoleLogger = morgan('dev');                                // short coloured lines in the terminal
const fileLogger = morgan('combined', { stream: accessLogStream }); // full lines in the file

module.exports = [consoleLogger, fileLogger];
