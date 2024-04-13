const axios = require('axios');
const qs = require('querystring');
const {
  OKX_MASTER_API_KEY,
  OKX_MASTER_SECRET_KEY,
  OKX_MASTER_PASSPHRASE,
  OKX_ALLOWED_IPS,
} = require('../../config/env');
const CryptoJS = require('crypto-js');
const logger = require('log4js').getLogger('okx-helper');

function getPrehash(method, uri, params = {}, body = {}) {
  let timeStamp = new Date().toISOString();
  let prehashString = timeStamp + method + uri;
  if (Object.keys(params).length > 0) {
    prehashString += `?${qs.encode(params)}`;
  }
  if (Object.keys(body).length >= 0) {
    prehashString += JSON.stringify(body);
  }
  return { prehashString, timeStamp };
}

const signPreHash = (
  method,
  uri,
  params = {},
  body = {},
  secretKey = OKX_MASTER_SECRET_KEY
) => {
  const { prehashString, timeStamp } = getPrehash(method, uri, params, body);
  const sign = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(prehashString, secretKey)
  );
  return { sign, timeStamp };
};

const instance = axios.create({
  baseURL: 'https://www.okx.com/api/v5',
});

const sendPublicRequest = async (method, url, params = {}) => {
  try {
    const { data } = await instance.request({
      method,
      url,
      params,
    });
    return data;
  } catch (err) {
    logger.error(err.response.data);
    return err.response.data;
  }
};

const sendRequest = async (
  method,
  url,
  params = {},
  body = {},
  apiKey,
  signature,
  timeStamp,
  passPhrase
) => {
  const instance = axios.create({
    baseURL: 'https://www.okx.com',
    headers: {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timeStamp,
      'OK-ACCESS-PASSPHRASE': passPhrase,
    },
  });

  try {
    const { data } = await instance.request({
      method,
      url,
      params,
      data: body,
    });
    return data;
  } catch (err) {
    logger.error(err.response.data);
    return err.response.data;
  }
};

async function createSubAccount(subAccount) {
  const body = {
    subAcct: subAccount,
    label: '5566',
  };

  let { sign, timeStamp } = signPreHash(
    'POST',
    '/api/v5/broker/nd/create-subaccount',
    {},
    body
  );

  const { data, msg } = await sendRequest(
    'POST',
    '/api/v5/broker/nd/create-subaccount',
    {},
    body,
    OKX_MASTER_API_KEY,
    sign,
    timeStamp,
    OKX_MASTER_PASSPHRASE
  );
  return {
    data,
    msg,
  };
}

async function createSubAccountApiKey(subAccount, label, passPhrase) {
  const body = {
    subAcct: subAccount,
    label: label,
    passphrase: passPhrase,
    perm: 'withdraw,trade',
    ip: OKX_ALLOWED_IPS,
  };

  let { sign, timeStamp } = signPreHash(
    'POST',
    '/api/v5/broker/nd/subaccount/apikey',
    {},
    body
  );

  const { data, msg } = await sendRequest(
    'POST',
    '/api/v5/broker/nd/subaccount/apikey',
    {},
    body,
    OKX_MASTER_API_KEY,
    sign,
    timeStamp,
    OKX_MASTER_PASSPHRASE
  );
  return {
    data1: data,
    msg1: msg,
  };
}

function generatePassphrase() {
  const length = Math.floor(Math.random() * (32 - 8 + 1)) + 8; // Random length between 8 and 32
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let passphrase = '';

  // Generate at least one character of each type
  passphrase +=
    uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
  passphrase +=
    lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
  passphrase += numbers[Math.floor(Math.random() * numbers.length)];
  passphrase += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Generate remaining characters randomly
  for (let i = 4; i < length; i++) {
    const charType = Math.floor(Math.random() * 4); // 0 for uppercase, 1 for lowercase, 2 for number, 3 for special
    switch (charType) {
      case 0:
        passphrase +=
          uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        break;
      case 1:
        passphrase +=
          lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
        break;
      case 2:
        passphrase += numbers[Math.floor(Math.random() * numbers.length)];
        break;
      case 3:
        passphrase +=
          specialChars[Math.floor(Math.random() * specialChars.length)];
        break;
    }
  }

  return passphrase;
}

module.exports = {
  signPreHash,
  sendRequest,
  createSubAccount,
  createSubAccountApiKey,
  sendPublicRequest,
  generatePassphrase,
};
