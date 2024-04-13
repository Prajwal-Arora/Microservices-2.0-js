const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  cTime: {
    type: String,
  },
  ccy: {
    type: String,
  },
  closeAvgPx: {
    type: String,
  },
  closeTotalPos: {
    type: String,
  },
  instId: {
    type: String,
  },
  instType: {
    type: String,
  },
  lever: {
    type: String,
  },
  mgnMode: {
    type: String,
  },
  openAvgPx: {
    type: String,
  },
  openMaxPos: {
    type: String,
  },
  pnl: {
    type: String,
  },
  pnlRatio: {
    type: String,
  },
  posId: {
    type: String,
  },
  direction: {
    type: String,
  },
  triggerPx: {
    type: String,
  },
  type: {
    type: String,
  },
  uTime: {
    type: String,
  },
  uly: {
    type: String,
  },
});

const Positions = mongoose.model('Positions', positionSchema);

module.exports = Positions;
