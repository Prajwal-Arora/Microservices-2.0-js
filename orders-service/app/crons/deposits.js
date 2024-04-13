const schedule = require('node-schedule');
const Deposits = require('../models/deposits.model');
const User = require('../models/user.model');
const { signPreHash, sendRequest } = require('../utils/okx_helper');
const {
  OKX_MASTER_API_KEY,
  OKX_MASTER_PASSPHRASE,
} = require('../../config/env');
const logger = require('log4js').getLogger('deposits-cron');

async function getDepositHistory(subAcct) {
  const query = { subAcct };
  let { sign, timeStamp } = signPreHash(
    'GET',
    '/api/v5/asset/broker/nd/subaccount-deposit-history',
    query,
    {}
  );
  const data = await sendRequest(
    'GET',
    '/api/v5/asset/broker/nd/subaccount-deposit-history',
    query,
    {},
    OKX_MASTER_API_KEY,
    sign,
    timeStamp,
    OKX_MASTER_PASSPHRASE
  );
  return data;
}

async function depositsCron() {
  const job = schedule.scheduleJob('* */6 * * *', async () => {
    try {
      const users = await User.find({}).populate('deposits');
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const history = await getDepositHistory(user.okx_account_name);
        if (history.msg) {
          logger.error(history);
          continue;
        }
        const depHistory = history.data;
        const recNotPresent = depHistory.filter(
          (h) =>
            !user.deposits.some(
              (d) =>
                d.ccy === h.ccy &&
                d.chain === h.chain &&
                d.txId === h.txId &&
                d.depId === h.depId
            )
        );
        await Deposits.insertMany(recNotPresent);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      logger.error(error);
    }
  });
}

module.exports = {
  depositsCron,
};
