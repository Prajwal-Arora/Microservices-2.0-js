const { constants } = require("./utils/constants");
const { emit } = require("./utils/socket");

function emitCandles(data) {
  emit(`${constants.OKX_Candle_Event}@${data.arg.instId}@${data.arg.channel}`, JSON.stringify(data.data[0]));
}

module.exports = {
  emitCandles,
};
