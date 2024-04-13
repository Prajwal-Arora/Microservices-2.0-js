const { sendRequest } = require('./okx_market_helper');

async function supported_symbols_data() {
  const { data } = await sendRequest('GET', '/tickers?instType=SPOT');
  const array = [];
  await Promise.all(
    data.map((d) => {
      array.push({
        base_asset: d.instId.split('-')[0],
        quote_asset: d.instId.split('-')[1],
        current_price: Number(d.last),
        vol24h: Number(d.volCcy24h),
        high24h: Number(d.high24h),
        low24h: Number(d.low24h),
        open24h: Number(d.open24h),
      });
    })
  );
  return array;
}

module.exports = {
  supported_symbols_data,
};
