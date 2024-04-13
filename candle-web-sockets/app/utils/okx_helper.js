const axios = require('axios');
const logger = require('log4js').getLogger('okx-helper');

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

async function supported_symbols_data(instType) {
  const { data } = await sendPublicRequest('GET', '/market/tickers', {
    instType: instType,
  });
  const array = [];
  await Promise.all(
    data.map((d) => {
      array.push(d.instId);
    })
  );
  return array;
}

module.exports = {
  supported_symbols_data,
};
