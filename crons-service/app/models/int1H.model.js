const mongoose = require('mongoose');

const hourly_historical = new mongoose.Schema({
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

const HourlyModel = mongoose.model('int_1H', hourly_historical);

module.exports = HourlyModel;
