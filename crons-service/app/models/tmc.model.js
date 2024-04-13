const mongoose = require('mongoose');

const tmc = new mongoose.Schema({
  tmc: {
    type: Number,
  },
  tmc_yesterday: {
    type: Number,
  },
  tmc_yesterday_percentage_change: {
    type: Number,
  },
  uniqueField: {
    type: String,
    unique: true,
    default: null,
  },
});

const TMC = mongoose.model('total_market_cap', tmc);

module.exports = TMC;
