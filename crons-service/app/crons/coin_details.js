const axios = require('axios');
const CoinDetails = require('../models/cd.model');
const CoinsList = require('../models/cl.model');
const { CMC_API_KEY } = require('../../config/env');
const logger = require('log4js').getLogger('cmc-coin-details-cron');

async function fetchCoinDetails() {
  const coins = await CoinsList.find({});
  for (let i = 0; i < coins.length; i++) {
    // storing details of tokens with USDT pairs only
    if (coins[i].quote_asset !== 'USDT') continue;
    const symbol = coins[i].base_asset;
    const findToken = await CoinDetails.findOne({ symbol });
    if (findToken) continue;
    try {
      const response = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}&CMC_PRO_API_KEY=${CMC_API_KEY}`
      );
      const tokenData = response.data.data[symbol];
      if (tokenData) {
        const data = new CoinDetails({
          symbol: symbol,
          name: tokenData.name,
          description: tokenData.description,
          logo: tokenData.logo,
          website: tokenData.urls.website,
          explorer: tokenData.urls.explorer,
          whitepaper: tokenData.urls.technical_doc,
          source_code: tokenData.urls.source_code,
          twitter: tokenData.urls.twitter,
          facebook: tokenData.urls.facebook,
          reddit: tokenData.urls.reddit,
          date_launched: tokenData.date_launched,
        });
        await data.save();
        logger.info(`Coin details added for ${symbol}`);
      }
    } catch (error) {
      const data = new CoinDetails({
        symbol: symbol,
        name: null,
        description: null,
        logo: null,
        website: null,
        explorer: null,
        whitepaper: null,
        source_code: null,
        twitter: null,
        facebook: null,
        reddit: null,
        date_launched: null,
      });
      await data.save();
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

module.exports = {
  fetchCoinDetails,
};
