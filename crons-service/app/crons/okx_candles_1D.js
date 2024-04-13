const schedule = require('node-schedule');
const DailyModel = require('../models/int1D.model');
const CoinsList = require('../models/cl.model');
const { fetch_candles_data } = require('../utils/okx_candles');
const logger = require('log4js').getLogger('okx-candles-1D-cron');

async function okxCandles1D() {
  try {
    const coins = await CoinsList.find({});
    const dmCheck = await DailyModel.find({});
    if (dmCheck.length === 0) {
      for (let i = 0; i < coins.length; i++) {
        const array = await fetch_candles_data({
          instId: coins[i].base_asset + '-' + coins[i].quote_asset,
          bar: '1D',
          limit: 300,
        });
        if (array.length === 0) {
          logger.info(
            `1 - Data for ${coins[i].base_asset}-${coins[i].quote_asset} null from okx`
          );
          continue;
        }
        await DailyModel.insertMany(array);
        logger.info(
          `1D historical data added for ${coins[i].base_asset}-${coins[i].quote_asset}`
        );
      }
    } else {
      for (let i = 0; i < coins.length; i++) {
        const latestTs = await DailyModel.findOne({
          base_asset: coins[i].base_asset,
          quote_asset: coins[i].quote_asset,
        }).sort({ timestamp: -1 });
        if (Object.keys(latestTs).length === 0) {
          const array = await fetch_candles_data({
            instId: coins[i].base_asset + '-' + coins[i].quote_asset,
            bar: '1D',
            limit: 300,
          });
          if (array.length === 0) {
            logger.info(
              `2 - Data for ${coins[i].base_asset}-${coins[i].quote_asset} null from okx`
            );
            continue;
          }
          await DailyModel.insertMany(array);
          continue;
        }
        const array = await fetch_candles_data({
          instId: coins[i].base_asset + '-' + coins[i].quote_asset,
          bar: '1D',
          before: latestTs.timestamp,
          limit: 300,
        });
        if (array.length !== 0) {
          await DailyModel.insertMany(array);
          logger.info(
            `From ts > ${latestTs.timestamp} data added for ${coins[i].base_asset}-${coins[i].quote_asset}`
          );
        }
      }
    }
  } catch (error) {
    logger.error(error);
  }
  const job = schedule.scheduleJob('15 16 * * * UTC', async () => {
    try {
      const coins = await CoinsList.find({});
      for (let i = 0; i < coins.length; i++) {
        const latestTs = await DailyModel.findOne({
          base_asset: coins[i].base_asset,
          quote_asset: coins[i].quote_asset,
        }).sort({ timestamp: -1 });
        if (Object.keys(latestTs).length === 0) {
          const array = await fetch_candles_data({
            instId: coins[i].base_asset + '-' + coins[i].quote_asset,
            bar: '1D',
            limit: 300,
          });
          if (array.length === 0) {
            logger.info(
              `2 - Data for ${coins[i].base_asset}-${coins[i].quote_asset} null from okx`
            );
            continue;
          }
          await DailyModel.insertMany(array);
          continue;
        }
        const array = await fetch_candles_data({
          instId: coins[i].base_asset + '-' + coins[i].quote_asset,
          bar: '1D',
          before: latestTs.timestamp,
          limit: 300,
        });
        if (array.length !== 0) {
          await DailyModel.insertMany(array);
          logger.info(
            `From ts > ${latestTs.timestamp} data added for ${coins[i].base_asset}-${coins[i].quote_asset}`
          );
        }
      }
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = { okxCandles1D };
