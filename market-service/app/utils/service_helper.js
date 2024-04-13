const moment = require('moment');
const DailyModel = require('../models/int1D.model');
const CoinsList = require('../models/cl.model');

async function priceChangeAggregator(symbol) {
  const sevenDaysAgo = moment().subtract(7, 'days').valueOf();
  const thirtyDaysAgo = moment().subtract(30, 'days').valueOf();
  const nintyDaysAgo = moment().subtract(90, 'days').valueOf();
  const oneEightyDaysAgo = moment().subtract(180, 'days').valueOf();
  const threeSixtyFiveDaysAgo = moment().subtract(365, 'days').valueOf();

  const data = await DailyModel.aggregate([
    {
      $facet: {
        record7DaysEarlier: [
          {
            $match: {
              base_asset: symbol,
              quote_asset: 'USDT',
              timestamp: { $lte: sevenDaysAgo },
            },
          },
          { $sort: { timestamp: -1 } },
          { $limit: 1 },
        ],
        record30DaysEarlier: [
          {
            $match: {
              base_asset: symbol,
              quote_asset: 'USDT',
              timestamp: { $lte: thirtyDaysAgo },
            },
          },
          { $sort: { timestamp: -1 } },
          { $limit: 1 },
        ],
        record90DaysEarlier: [
          {
            $match: {
              base_asset: symbol,
              quote_asset: 'USDT',
              timestamp: { $lte: nintyDaysAgo },
            },
          },
          { $sort: { timestamp: -1 } },
          { $limit: 1 },
        ],
        record180DaysEarlier: [
          {
            $match: {
              base_asset: symbol,
              quote_asset: 'USDT',
              timestamp: { $lte: oneEightyDaysAgo },
            },
          },
          { $sort: { timestamp: -1 } },
          { $limit: 1 },
        ],
        record365DaysEarlier: [
          {
            $match: {
              base_asset: symbol,
              quote_asset: 'USDT',
              timestamp: { $lte: threeSixtyFiveDaysAgo },
            },
          },
          { $sort: { timestamp: -1 } },
          { $limit: 1 },
        ],
        oldestRecord: [
          { $match: { base_asset: symbol, quote_asset: 'USDT' } },
          { $sort: { timestamp: 1 } },
          { $limit: 1 },
        ],
      },
    },
  ]);

  return data;
}

async function mo_fiveCards() {
  const marketCapP = CoinsList.find({ quote_asset: 'USDT' })
    .sort({ market_cap: -1 })
    .limit(8);

  const valueLeadersP = CoinsList.find({ quote_asset: 'USDT' })
    .sort({ vol24h: -1 })
    .limit(8);

  const topSearchesP = CoinsList.find({ quote_asset: 'USDT' })
    .sort({ searches: -1 })
    .limit(8);
  const documentsP = CoinsList.find({ quote_asset: 'USDT' });

  const [marketCap, valueLeaders, topSearches, documents] = await Promise.all([
    marketCapP,
    valueLeadersP,
    topSearchesP,
    documentsP,
  ]);

  documents.forEach((doc) => {
    const percentChange24hrs =
      ((doc.current_price - doc.open24h) / doc.open24h) * 100;
    doc.percentChange24hrs = percentChange24hrs;
  });
  // Sort the documents based on the percentage price change in descending order
  documents.sort((a, b) => b.percentChange24hrs - a.percentChange24hrs);
  const topGainers = documents.slice(0, 8).map((doc) => ({
    token: doc.base_asset,
    currentPrice: doc.current_price,
    percentChange24hrs: doc.percentChange24hrs,
  }));
  const topLosers = documents
    .slice(-8)
    .reverse()
    .map((doc) => ({
      token: doc.base_asset,
      currentPrice: doc.current_price,
      percentChange24hrs: doc.percentChange24hrs,
    }));
  marketCap.forEach((doc) => {
    const percentChange24hrs =
      ((doc.current_price - doc.open24h) / doc.open24h) * 100;
    doc.percentChange24hrs = percentChange24hrs;
  });
  const mc = marketCap.map((doc) => ({
    token: doc.base_asset,
    currentPrice: doc.current_price,
    percentChange24hrs: doc.percentChange24hrs,
  }));
  valueLeaders.forEach((doc) => {
    const percentChange24hrs =
      ((doc.current_price - doc.open24h) / doc.open24h) * 100;
    doc.percentChange24hrs = percentChange24hrs;
  });
  const vl = valueLeaders.map((doc) => ({
    token: doc.base_asset,
    currentPrice: doc.current_price,
    percentChange24hrs: doc.percentChange24hrs,
  }));
  topSearches.forEach((doc) => {
    const percentChange24hrs =
      ((doc.current_price - doc.open24h) / doc.open24h) * 100;
    doc.percentChange24hrs = percentChange24hrs;
  });
  const ts = topSearches.map((doc) => ({
    token: doc.base_asset,
    currentPrice: doc.current_price,
    percentChange24hrs: doc.percentChange24hrs,
  }));

  return { topGainers, topLosers, mc, vl, ts };
}

module.exports = {
  priceChangeAggregator,
  mo_fiveCards,
};
