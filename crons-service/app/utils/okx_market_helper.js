const axios = require('axios');
const logger = require('log4js').getLogger('okx-market-helper');

const instance = axios.create({
  baseURL: 'https://www.okx.com/api/v5/market',
});

const sendRequest = async (method, url, params = {}) => {
  try {
    const { data } = await instance.request({
      method,
      url,
      params,
    });
    return data;
  } catch (error) {
    logger.error(error.response.status + ' ' + error.response.statusText);
  }
};

module.exports = {
  sendRequest,
};
