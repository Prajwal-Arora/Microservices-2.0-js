const Deposits = require('../models/deposits.model');
const Withdraws = require('../models/withdraws.model');
const { publishEmailtoQ } = require('../rabbitmq/publisher');
const logger = require('log4js').getLogger('ps-helper');

async function addDeposit(data) {
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    if (d.subAcct === '') continue;
    try {
      const doc = await Deposits.findOneAndUpdate(
        {
          subAcct: d.subAcct,
          ccy: d.ccy,
          chain: d.chain,
          depId: d.depId,
          txId: d.txId,
        },
        {
          amt: d.amt,
          to: d.to,
          ts: d.ts,
          state: d.state,
          actualDepBlkConfirm: d.actualDepBlkConfirm,
        }
      );
      if (!doc) {
        const rec = new Deposits({
          subAcct: d.subAcct,
          ccy: d.ccy,
          chain: d.chain,
          amt: d.amt,
          to: d.to,
          txId: d.txId,
          ts: d.ts,
          state: d.state,
          depId: d.depId,
          actualDepBlkConfirm: d.actualDepBlkConfirm,
        });
        await rec.save();
      }
      const depRec = await Deposits.findOne({
        subAcct: d.subAcct,
        ccy: d.ccy,
        chain: d.chain,
        depId: d.depId,
        txId: d.txId,
      }).populate('subAcct');
      if (depRec.state === '1' && depRec.mailSent === false) {
        // Send Deposit Success Email
        publishEmailtoQ({
          to: depRec.subAcct.email,
          purpose: 'despositConfimed',
          time: depRec.ts,
          amount: depRec.amt,
          dest_add: depRec.to,
          txid: depRec.txId,
        }).catch((err) => logger.error(err));
        depRec.set({
          mailSent: true,
        });
        depRec.save();
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

async function addWithdraw(data) {
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    if (d.subAcct === '') continue;
    try {
      const doc = await Withdraws.findOneAndUpdate(
        {
          subAcct: d.subAcct,
          ccy: d.ccy,
          chain: d.chain,
          wdId: d.wdId,
          txId: d.txId,
        },
        {
          amt: d.amt,
          ts: d.ts,
          to: d.to,
          tag: d?.tag,
          pmtId: d?.pmtId,
          memo: d?.memo,
          fee: d.fee,
          feeCcy: d.feeCcy,
          state: d.state,
          clientId: d.clientId,
        }
      );
      if (!doc) {
        const rec = new Withdraws({
          subAcct: d.subAcct,
          ccy: d.ccy,
          chain: d.chain,
          amt: d.amt,
          ts: d.ts,
          to: d.to,
          tag: d?.tag,
          pmtId: d?.pmtId,
          memo: d?.memo,
          txId: d.txId,
          fee: d.fee,
          feeCcy: d.feeCcy,
          state: d.state,
          wdId: d.wdId,
          clientId: d.clientId,
        });
        await rec.save();
      }
      const withdrawRec = await Withdraws.findOne({
        subAcct: d.subAcct,
        ccy: d.ccy,
        chain: d.chain,
        wdId: d.wdId,
        txId: d.txId,
      }).populate('subAcct');
      if (withdrawRec.state === '2' && withdrawRec.mailSent === false) {
        // Send Withdraw Success Email
        publishEmailtoQ({
          to: withdrawRec.subAcct.email,
          purpose: 'withdrawConfirmed',
          time: withdrawRec.ts,
          amount: withdrawRec.amt,
          dest_add: withdrawRec.to,
          txid: withdrawRec.txId,
        }).catch((err) => logger.error(err));
        withdrawRec.set({
          mailSent: true,
        });
        withdrawRec.save();
      } else if (withdrawRec.state === '-1' && withdrawRec.mailSent === false) {
        // Send Withdraw Failed Email
        publishEmailtoQ({
          to: withdrawRec.subAcct.email,
          purpose: 'withdrawFailed',
          time: withdrawRec.ts,
          amount: withdrawRec.amt,
          dest_add: withdrawRec.to,
          txid: withdrawRec.txId,
        }).catch((err) => logger.error(err));
        withdrawRec.set({
          mailSent: true,
        });
        withdrawRec.save();
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

module.exports = {
  addDeposit,
  addWithdraw,
};
