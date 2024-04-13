const schedule = require('node-schedule');
const CoinsList = require('../models/cl.model');
const { supported_symbols_data } = require('../utils/okx_tickers');
const logger = require('log4js').getLogger('okx-tickers-cron');

async function okxTickersCron() {
  const job = schedule.scheduleJob('*/2 * * * *', async () => {
    try {
      const array = await supported_symbols_data();
      await updateCoinsList(array);
      logger.info('okx tickers data updated for all tokens');
    } catch (error) {
      logger.error(error);
    }
  });
}

const updateCoinsList = async (array) => {
  const bulkOperations = array.map((item) => {
    const query = {
      base_asset: item.base_asset,
      quote_asset: item.quote_asset,
    };
    const update = { $set: item }; // Use $set to update the entire document
    return {
      updateOne: {
        filter: query,
        update: update,
        upsert: true, // Insert if document doesn't exist
      },
    };
  });

  try {
    await CoinsList.bulkWrite(bulkOperations);
  } catch (error) {
    logger.error('Error during bulk update:', error);
  }
};

module.exports = { okxTickersCron };
