const schedule = require('node-schedule');
const Order = require('../models/order.model');
const { publishEmailtoQ } = require('../rabbitmq/publisher');
const { signPreHash, sendRequest } = require('../utils/okx_helper');
const logger = require('log4js').getLogger('orders-cron');

async function getOrderDetails(instId, ordId, user) {
  const query = { instId, ordId };
  let { sign, timeStamp } = signPreHash(
    'GET',
    '/api/v5/trade/order',
    query,
    {},
    user.okx_secret_key
  );

  const data = await sendRequest(
    'GET',
    '/api/v5/trade/order',
    query,
    {},
    user.okx_api_key,
    sign,
    timeStamp,
    user.okx_passphrase
  );
  return data;
}

async function getAlgoOrderDetails(algoId, user) {
  const query = { algoId };
  let { sign, timeStamp } = signPreHash(
    'GET',
    '/api/v5/trade/order-algo',
    query,
    {},
    user.okx_secret_key
  );

  const data = await sendRequest(
    'GET',
    '/api/v5/trade/order-algo',
    query,
    {},
    user.okx_api_key,
    sign,
    timeStamp,
    user.okx_passphrase
  );
  return data;
}

async function ordersCron() {
  const job = schedule.scheduleJob('*/10 * * * *', async () => {
    try {
      const orders = await Order.find({
        state: { $in: ['new', 'cancel', 'partially_filled', 'live'] },
      }).populate('user');
      for (let i = 0; i < orders.length; i++) {
        const ord = orders[i];
        const data = await getOrderDetails(ord.instId, ord.ordId, ord.user);
        if (data.msg) {
          logger.error(data);
          continue;
        }
        const details = data.data[0];
        ord.set(details);
        if (details.state === 'filled' && ord.mailSent === false) {
          // sending confirm email
          publishEmailtoQ({
            to: ord.user.email,
            purpose: 'confirmedOrder',
            orderId: details.ordId,
            time: details.cTime,
            amount: details.sz,
            order_type: details.ordType,
            order_side: details.side,
          }).catch((err) => logger.error(err));

          ord.set({
            mailSent: true,
          });
        }
        await ord.save();
      }
    } catch (error) {
      logger.error(error);
    }
  });
}

async function algoOrdersCron() {
  const job = schedule.scheduleJob('*/10 * * * *', async () => {
    try {
      const orders = await Order.find({
        state: {
          $in: ['algo', 'cancelA', 'partially_effective', 'live', 'pause'],
        },
      }).populate('user');
      for (let i = 0; i < orders.length; i++) {
        const ord = orders[i];
        const data = await getAlgoOrderDetails(ord.algoId, ord.user);
        if (data.msg) {
          logger.error(data);
          continue;
        }
        const details = data.data[0];
        ord.set(details);
        if (details.state === 'effective' && ord.mailSent === false) {
          // sending confirm email
          publishEmailtoQ({
            to: ord.user.email,
            purpose: 'confirmedOrder',
            orderId: details.algoId,
            time: details.cTime,
            amount: details.sz,
            order_type: details.ordType,
            order_side: details.side,
          }).catch((err) => logger.error(err));

          ord.set({
            mailSent: true,
          });
        }
        await ord.save();
      }
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  ordersCron,
  algoOrdersCron,
};
