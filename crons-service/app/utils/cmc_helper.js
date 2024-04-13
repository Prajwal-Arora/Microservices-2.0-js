const axios = require('axios');
const CoinsList = require('../models/cl.model');
const { CMC_API_KEY } = require('../../config/env');
const logger = require('log4js').getLogger('cmc-helper');

async function cmc_helper() {
  const coins = await CoinsList.find({});
  for (let i = 0; i < coins.length; i++) {
    const symbol = coins[i].base_asset;
    try {
      const response = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${CMC_API_KEY}&symbol=${symbol}`
      );
      if (!(Object.keys(response.data.data).length === 0)) {
        const marketCap = response.data.data[symbol].quote.USD.market_cap;
        await CoinsList.findByIdAndUpdate(coins[i]._id, {
          market_cap: marketCap,
        });
        logger.info(`Market cap updated for ${symbol}`);
      } else {
        await CoinsList.findByIdAndUpdate(coins[i]._id, { market_cap: null });
        logger.info(`Market cap set to null for ${symbol}`);
      }
    } catch (error) {
      logger.error(
        'CMC ERROR > ' + error.response.status + ' ' + error.response.statusText
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

module.exports = { cmc_helper };
