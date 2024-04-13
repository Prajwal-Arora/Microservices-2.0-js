const WebSocket = require('ws');
const { supported_symbols_data } = require('./utils/okx_helper');
const { emitCandles } = require('./emitters');
const logger = require('log4js').getLogger('okx-candle-websocket-init');

let ws;
let CANDLES = [
  'candle1m',
  'candle3m',
  'candle5m',
  'candle15m',
  'candle30m',
  'candle1H',
  'candle4H',
  'candle1D',
  'candle2D',
];

const OBJ = {
  0: {
    op: 'subscribe',
    args: [],
  },
  1: {
    op: 'subscribe',
    args: [],
  },
  2: {
    op: 'subscribe',
    args: [],
  },
  3: {
    op: 'subscribe',
    args: [],
  },
  4: {
    op: 'subscribe',
    args: [],
  },
};
const socketInit = async function () {
  const symbols = await supported_symbols_data('SPOT');
  const swapSymbols = await supported_symbols_data('SWAP');
  const totalSymbols = [...symbols, ...swapSymbols];
  ws = new WebSocket('wss://wsaws.okx.com:8443/ws/v5/business');

  ws.on('open', async () => {
    logger.info('WebSocket connection to OKX opened...');

    let counter = 0;
    for (let k = 0; k < 5; k++) {
      for (let i = counter; i < counter + 150 && i < totalSymbols.length; i++) {
        for (let j = 0; j < CANDLES.length; j++) {
          OBJ[k].args.push({
            channel: CANDLES[j],
            instId: totalSymbols[i],
          });
        }
      }
      counter += 150;
    }

    for (let key in OBJ) {
      ws.send(JSON.stringify(OBJ[key]));
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
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
    // logger.info("from message", msg);
    if (msg?.event) {
      logger.info(msg);
    } else if (CANDLES.includes(msg?.arg?.channel)) {
      emitCandles(msg);
    }
  });
};

module.exports = {
  socketInit,
};
