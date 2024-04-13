const axios = require('axios');
const { CMC_API_KEY } = require('../../config/env');
const logger = require('log4js').getLogger('hmc_helper');

const instance = axios.create({
  baseURL:
    'https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical',
});

async function hmc_helper(method = 'GET', params) {
  try {
    params.CMC_PRO_API_KEY = CMC_API_KEY;
    params.interval = '24h';
    params.count = '365';
    const { data } = await instance.request({
      method,
      params,
    });
    logger.info(data);
  } catch (error) {
    logger.error(
      'CMC ERROR > ' + error.response.status + ' ' + error.response.statusText
    );
  }
}

module.exports = { hmc_helper };
