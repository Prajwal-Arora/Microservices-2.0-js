const mongoose = require('mongoose');

const f_hourly_historical = new mongoose.Schema({
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

const FourHourlyModel = mongoose.model('int_4H', f_hourly_historical);

module.exports = FourHourlyModel;
