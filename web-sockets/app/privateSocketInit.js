const WebSocket = require('ws');
const { getLoginSign } = require('./utils/okx_helper');
const { constants } = require('./utils/constants');
const { OKX_MASTER_API_KEY, OKX_MASTER_PASSPHRASE } = require('../config/env');
const { addDeposit, addWithdraw } = require('./utils/ps_helper');
const logger = require('log4js').getLogger('private-websocket-init');

const subscribe = {
  op: 'subscribe',
  args: [
    {
      channel: constants.OKX_Deposit_Event,
    },
    {
      channel: constants.OKX_Withdraw_Event,
    },
  ],
};

function socketLogin(ws) {
  const { sign, timestamp } = getLoginSign();
  ws.send(
    JSON.stringify({
      op: 'login',
      args: [
        {
          apiKey: OKX_MASTER_API_KEY,
          passphrase: OKX_MASTER_PASSPHRASE,
          timestamp,
          sign,
        },
      ],
    })
  );
}

let ws;
let timeoutId;
const privateSocketInit = function () {
  ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/business');

  ws.on('open', async () => {
    logger.info('Private WebSocket connection to OKX opened...');
    socketLogin(ws);
  });

  ws.on('error', (err) => {
    logger.info(`Private OKX WebSocket error: ${err}`);
  });

  ws.on('close', () => {
    logger.info('Private WebSocket connection to OKX closed...');
    setTimeout(() => {
      logger.info('Private WebSocket attempting to reconnect to OKX...');
      privateSocketInit();
    }, 1000);
  });

  ws.on('message', (data) => {
    let msg;
    if (data.toString() === 'pong') {
      msg = data.toString();
    } else {
      msg = JSON.parse(data);
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      ws.send('ping');
    }, 25000);
    if (msg?.event === 'error' && msg?.code === '60009') {
      socketLogin(ws);
    }
    if (msg?.event === 'login') {
      ws.send(JSON.stringify(subscribe));
    } else if (
      msg?.arg?.channel === constants.OKX_Deposit_Event &&
      msg?.event === undefined
    ) {
      addDeposit(msg.data);
    } else if (
      msg?.arg?.channel === constants.OKX_Withdraw_Event &&
      msg?.event === undefined
    ) {
      addWithdraw(msg.data);
    }
  });
};

module.exports = {
  privateSocketInit,
};
