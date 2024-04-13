const axios = require('axios');
const schedule = require('node-schedule');
const TMC = require('../models/tmc.model');
const { CMC_API_KEY } = require('../../config/env');
const logger = require('log4js').getLogger('total-market-cap-cron');

async function tmcCron() {
  try {
    const tmcCheck = await TMC.find({});
    if (tmcCheck.length === 0) {
      const { data } = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=${CMC_API_KEY}`
      );
      const tmc = new TMC({
        tmc: data.data.quote.USD.total_market_cap,
        tmc_yesterday: data.data.quote.USD.total_market_cap_yesterday,
        tmc_yesterday_percentage_change:
          data.data.quote.USD.total_market_cap_yesterday_percentage_change,
      });
      await tmc.save();
      logger.info('Total market cap data saved');
    }
  } catch (error) {
    logger.error(
      'CMC ERROR > ' + error.response.status + ' ' + error.response.statusText
    );
  }
  const job = schedule.scheduleJob('0 2 * * * UTC', async () => {
    try {
      const doc = await TMC.findOne();
      const { data } = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?CMC_PRO_API_KEY=${CMC_API_KEY}`
      );
      await TMC.findByIdAndUpdate(doc._id, {
        tmc: data.data.quote.USD.total_market_cap,
        tmc_yesterday: data.data.quote.USD.total_market_cap_yesterday,
        tmc_yesterday_percentage_change:
          data.data.quote.USD.total_market_cap_yesterday_percentage_change,
      });
      logger.info('Total market cap updated');
    } catch (error) {
      logger.error(
        'CMC ERROR > ' + error.response.status + ' ' + error.response.statusText
      );
    }
  });
}

module.exports = { tmcCron };
