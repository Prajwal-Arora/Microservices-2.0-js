const axios = require('axios');
const CryptoJS = require('crypto-js');
const logger = require('log4js').getLogger('okx-helper');
const { OKX_MASTER_SECRET_KEY } = require('../../config/env');

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
    logger.error(err.response);
    return err.response.data;
  }
};

async function supported_symbols_data() {
  const { data } = await sendPublicRequest('GET', '/market/tickers', {
    instType: 'SPOT',
  });
  const array = [];
  await Promise.all(
    data.map((d) => {
      array.push(d.instId);
    })
  );
  return array;
}

function getLoginSign() {
  const timestamp = Date.now() / 1000;
  sign = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(
      timestamp + 'GET' + '/users/self/verify',
      OKX_MASTER_SECRET_KEY
    )
  );
  return { sign, timestamp };
}

module.exports = {
  supported_symbols_data,
  getLoginSign,
};
