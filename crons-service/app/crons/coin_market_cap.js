const schedule = require('node-schedule');
const { cmc_helper } = require('../utils/cmc_helper');
const logger = require('log4js').getLogger('coin-market-cap-cron');

async function cmcCron() {
  await cmc_helper();
  const job = schedule.scheduleJob('0 0 * * * UTC', async () => {
    await cmc_helper();
  });
}

module.exports = { cmcCron };
