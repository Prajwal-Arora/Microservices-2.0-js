const WebSocket = require('ws');
const { supported_symbols_data } = require('./utils/okx_helper');
const { constants } = require('./utils/constants');
const { emitTrades, emitOrderBook, emitTickers } = require('./emitters');
const logger = require('log4js').getLogger('okx-websocket-init');

let ws;
const socketInit = function () {
  ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');

  ws.on('open', async () => {
    logger.info('WebSocket connection to OKX opened...');
    const symbols = await supported_symbols_data();
    const subscribeTrades = {
      op: 'subscribe',
      args: [],
    };
    const subscribeOrderBook = {
      op: 'subscribe',
      args: [],
    };
    const subscribeTickers = {
      op: 'subscribe',
      args: [],
    };
    for (let i = 0; i < symbols.length; i++) {
      subscribeTrades.args.push({
        channel: constants.OKX_Trades_Event,
        instId: symbols[i],
      });
      subscribeOrderBook.args.push({
        channel: constants.OKX_OrderBook_Event,
        instId: symbols[i],
      });
      subscribeTickers.args.push({
        channel: constants.OKX_Tickers_Event,
        instId: symbols[i],
      });
    }
    ws.send(JSON.stringify(subscribeTrades));
    await new Promise((resolve) => setTimeout(resolve, 10000));
    ws.send(JSON.stringify(subscribeOrderBook));
    await new Promise((resolve) => setTimeout(resolve, 10000));
    ws.send(JSON.stringify(subscribeTickers));
  });

  ws.on('close', () => {
    logger.info('WebSocket connection to OKX closed...');
    setTimeout(() => {
      logger.info('WebSocket attempting to reconnect to OKX...');
      socketInit();
    }, 1000);
  });

  ws.on('error', (err) => {
    logger.error(`OKX WebSocket error: ${err}`);
  });

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg?.event) {
      logger.info(msg);
    } else if (msg?.arg?.channel === constants.OKX_Trades_Event) {
      emitTrades(msg.data[0]);
    } else if (
      msg?.arg?.channel === constants.OKX_OrderBook_Event &&
      msg?.action === 'update'
    ) {
      emitOrderBook(msg?.data[0], msg?.arg?.instId);
    } else if (msg?.arg?.channel === constants.OKX_Tickers_Event) {
      emitTickers(msg.data, msg.arg.instId);
    }
  });
};

module.exports = {
  socketInit,
};
