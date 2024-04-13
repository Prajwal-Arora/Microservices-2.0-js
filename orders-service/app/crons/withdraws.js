const schedule = require('node-schedule');
const Withdraws = require('../models/withdraws.model');
const User = require('../models/user.model');
const { signPreHash, sendRequest } = require('../utils/okx_helper');
const {
  OKX_MASTER_API_KEY,
  OKX_MASTER_PASSPHRASE,
} = require('../../config/env');
const logger = require('log4js').getLogger('withdraws-cron');

async function getWithdrawHistory(subAcct) {
  const query = { subAcct };
  let { sign, timeStamp } = signPreHash(
    'GET',
    '/api/v5/asset/broker/nd/subaccount-withdrawal-history',
    query,
    {}
  );
  const data = await sendRequest(
    'GET',
    '/api/v5/asset/broker/nd/subaccount-withdrawal-history',
    query,
    {},
    OKX_MASTER_API_KEY,
    sign,
    timeStamp,
    OKX_MASTER_PASSPHRASE
  );
  return data;
}

async function withdrawsCron() {
  const job = schedule.scheduleJob('* */6 * * *', async () => {
    try {
      const users = await User.find({}).populate('withdraws');
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const history = await getWithdrawHistory(user.okx_account_name);
        if (history.msg) {
          logger.error(history);
          continue;
        }
        const withdrawHistory = history.data;
        const recNotPresent = withdrawHistory.filter(
          (h) =>
            !user.withdraws.some(
              (d) =>
                d.ccy === h.ccy &&
                d.chain === h.chain &&
                d.txId === h.txId &&
                d.wdId === h.wdId
            )
        );
        await Withdraws.insertMany(recNotPresent);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  withdrawsCron,
};
