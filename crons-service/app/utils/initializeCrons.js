const { fetchCoinDetails } = require('../crons/coin_details');
const { tmcCron } = require('../crons/total_market_cap');
const { cmcCron } = require('../crons/coin_market_cap');
const { okxTickersCron } = require('../crons/okx_tickers');
const { okxCandles1D } = require('../crons/okx_candles_1D');
const { okxCandles1H } = require('../crons/okx_candles_1H');
const { okxCandles4H } = require('../crons/okx_candles_4H');
const logger = require('log4js').getLogger('initialize-crons');

async function initializeCrons() {
  tmcCron();
  okxTickersCron()
    .then(() => {
      setTimeout(() => {
        cmcCron();
        fetchCoinDetails();
        okxCandles1D();
        okxCandles1H();
        okxCandles4H();
      }, 120000);
    })
    .catch((error) => {
      logger.error(error);
    });
}

module.exports = {
  initializeCrons,
};
