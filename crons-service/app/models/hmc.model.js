const mongoose = require('mongoose');

const hmc = new mongoose.Schema({
  Symbol: {
    type: String,
  },
  market_cap: {
    type: Number,
  },
  ts: {
    type: Number,
  },
});

const HMC = mongoose.model('Historical_Market_Caps', hmc);

module.exports = HMC;
