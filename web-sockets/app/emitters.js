const { constants } = require('./utils/constants');
const { emit } = require('./utils/socket');

function emitTrades(data) {
  emit(`${constants.Trades_Event}@${data.instId}`, JSON.stringify(data));
}

function emitOrderBook(data, instId) {
  emit(`${constants.Order_Book_Event}@${instId}`, JSON.stringify(data));
}

function emitTickers(data, instId) {
  // below even emits all tokens data at once, not being used in the frontend ass it makes the website slow,
  // hence we have created an individual token event and are using that in the frontend.

  // emit(`${constants.Tickers_Event}`, JSON.stringify(data));

  emit(`${constants.Tickers_Event}@${instId}`, JSON.stringify(data));
}

module.exports = {
  emitTrades,
  emitOrderBook,
  emitTickers,
};
