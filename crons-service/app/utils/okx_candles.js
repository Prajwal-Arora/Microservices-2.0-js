const { sendRequest } = require('./okx_market_helper');

async function fetch_candles_data(params) {
  const { data } = await sendRequest('GET', '/candles', params);
  const array = [];
  await Promise.all(
    data.map((r) => {
      if (r[8] !== 0) {
        array.push({
          base_asset: params.instId.split('-')[0],
          quote_asset: params.instId.split('-')[1],
          timestamp: r[0],
          value: r[4],
        });
      }
    })
  );
  return array;
}

module.exports = {
  fetch_candles_data,
};

// ---params---
// instId
// bar
// after
// before
// limit = 300
