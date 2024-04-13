const schedule = require('node-schedule');
const FourHourlyModel = require('../models/int4H.model');
const CoinsList = require('../models/cl.model');
const { fetch_candles_data } = require('../utils/okx_candles');
const logger = require('log4js').getLogger('okx-candles-4H-cron');

async function okxCandles4H() {
  try {
    const coins = await CoinsList.find({});
    const dmCheck = await FourHourlyModel.find({});
    if (dmCheck.length === 0) {
      for (let i = 0; i < coins.length; i++) {
        const array = await fetch_candles_data({
          instId: coins[i].base_asset + '-' + coins[i].quote_asset,
          bar: '4H',
          limit: 300,
        });
        if (array.length === 0) {
          logger.info(
            `1 - Data for ${coins[i].base_asset}-${coins[i].quote_asset} null from okx`
          );
          continue;
        }
        await FourHourlyModel.insertMany(array);
        logger.info(
          `4H historical data added for ${coins[i].base_asset}-${coins[i].quote_asset}`
        );
      }
    } else {
      for (let i = 0; i < coins.length; i++) {
        const latestTs = await FourHourlyModel.findOne({
          base_asset: coins[i].base_asset,
          quote_asset: coins[i].quote_asset,
        }).sort({ timestamp: -1 });
        if (Object.keys(latestTs).length === 0) {
          const array = await fetch_candles_data({
            instId: coins[i].base_asset + '-' + coins[i].quote_asset,
            bar: '4H',
            limit: 300,
          });
          if (array.length === 0) {
            logger.info(
              `2 - Data for ${coins[i].base_asset}-${coins[i].quote_asset} null from okx`
            );
            continue;
          }
          await FourHourlyModel.insertMany(array);
          continue;
        }
        const array = await fetch_candles_data({
          instId: coins[i].base_asset + '-' + coins[i].quote_asset,
          bar: '4H',
          before: latestTs.timestamp,
          limit: 300,
        });
        if (array.length !== 0) {
          await FourHourlyModel.insertMany(array);
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
        const latestTs = await FourHourlyModel.findOne({
          base_asset: coins[i].base_asset,
          quote_asset: coins[i].quote_asset,
        }).sort({ timestamp: -1 });
        if (Object.keys(latestTs).length === 0) {
          const array = await fetch_candles_data({
            instId: coins[i].base_asset + '-' + coins[i].quote_asset,
            bar: '4H',
            limit: 300,
          });
          if (array.length === 0) {
            logger.info(
              `2 - Data for ${coins[i].base_asset}-${coins[i].quote_asset} null from okx`
            );
            continue;
          }
          await FourHourlyModel.insertMany(array);
          continue;
        }
        const array = await fetch_candles_data({
          instId: coins[i].base_asset + '-' + coins[i].quote_asset,
          bar: '4H',
          before: latestTs.timestamp,
          limit: 300,
        });
        if (array.length !== 0) {
          await FourHourlyModel.insertMany(array);
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

module.exports = { okxCandles4H };
