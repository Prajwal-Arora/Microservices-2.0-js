const mongoose = require('mongoose');

const daily_historical = new mongoose.Schema({
  base_asset: {
    type: String,
    required: true,
  },
  quote_asset: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const DailyModel = mongoose.model('int_1D', daily_historical);

module.exports = DailyModel;
