const crypto = require('crypto');
const { INITIAL_VECTOR_HEX, SECURITY_KEY_HEX } = require('../../config/env');

const algorithm = 'aes-256-cbc';

// generate 16 bytes of random data
const initVector = Buffer.from(INITIAL_VECTOR_HEX, 'hex');

// secret key generate 32 bytes of random data
const Securitykey = Buffer.from(SECURITY_KEY_HEX, 'hex');

const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  return (
    decipher.update(encryptedData, 'hex', 'utf-8') + decipher.final('utf8')
  );
};

module.exports = { decryptData };
