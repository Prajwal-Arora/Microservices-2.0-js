const mongoose = require('mongoose');

const cd = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  logo: {
    type: String,
  },
  website: [
    {
      type: String,
    },
  ],
  explorer: [
    {
      type: String,
    },
  ],
  whitepaper: [
    {
      type: String,
    },
  ],
  source_code: [
    {
      type: String,
    },
  ],
  twitter: [
    {
      type: String,
    },
  ],
  facebook: [
    {
      type: String,
    },
  ],
  reddit: [
    {
      type: String,
    },
  ],
  date_launched: {
    type: String,
  },
});

const CoinDetails = mongoose.model('Coin_Details', cd);

module.exports = CoinDetails;
