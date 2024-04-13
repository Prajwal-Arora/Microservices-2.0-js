const mongoose = require('mongoose');

const cl = new mongoose.Schema({
  base_asset: {
    type: String,
    required: true,
  },
  quote_asset: {
    type: String,
    required: true,
  },
  vol24h: {
    type: Number,
  },
  current_price: {
    type: Number,
  },
  open24h: {
    type: Number,
  },
  high24h: {
    type: Number,
  },
  low24h: {
    type: Number,
  },
  market_cap: {
    type: Number,
  },
  searches: {
    type: Number,
    default: 0,
  },
});

const CoinsList = mongoose.model('Coins_List_Values', cl);

module.exports = CoinsList;
