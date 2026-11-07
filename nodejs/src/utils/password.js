// Password hashing with Node's built-in `crypto` module (no extra package needed).
// Stored format: "<salt>:<hash>" both in hex.
const crypto = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt); // turn the callback API into a Promise API
const KEY_LENGTH = 64;

async function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await scrypt(plain, salt, KEY_LENGTH); // returns a Buffer
  return `${salt}:${hash.toString('hex')}`;
}

async function verifyPassword(plain, stored) {
  const [salt, hashHex] = stored.split(':');
  const storedHash = Buffer.from(hashHex, 'hex');
  const hash = await scrypt(plain, salt, KEY_LENGTH);
  // timingSafeEqual avoids leaking information through the comparison time
  return storedHash.length === hash.length && crypto.timingSafeEqual(storedHash, hash);
}

module.exports = { hashPassword, verifyPassword };
