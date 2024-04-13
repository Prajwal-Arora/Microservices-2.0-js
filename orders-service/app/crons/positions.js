const schedule = require('node-schedule');
const Positions = require('../models/positions.model');
const { signPreHash, sendRequest } = require('../utils/okx_helper');
const logger = require('log4js').getLogger('orders-cron');

async function getPosDetails(instId, ordId, user) {
  const query = { instId, ordId };
  let { sign, timeStamp } = signPreHash(
    'GET',
    '/api/v5/account/positions-history',
    query,
    {},
    user.okx_secret_key
  );

  const data = await sendRequest(
    'GET',
    '/api/v5/account/positions-history',
    query,
    {},
    user.okx_api_key,
    sign,
    timeStamp,
    user.okx_passphrase
  );
  return data;
}

async function positionsCron() {
  const job = schedule.scheduleJob('0 * * * *', async () => {
    try {
      const orders = await Positions.find({
        state: { $in: ['new', 'cancel', 'partially_filled', 'live'] },
      }).populate('user');
      for (let i = 0; i < orders.length; i++) {
        const ord = orders[i];
        const data = await getPosDetails(ord.instId, ord.ordId, ord.user);
        if (data.msg) {
          logger.error(data);
          continue;
        }
        const details = data.data[0];
        ord.set(details);
        await ord.save();
      }
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  positionsCron,
};
