const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  instId: {
    type: String,
  },
  tgtCcy: {
    type: String,
  },
  ccy: {
    type: String,
  },
  ordId: {
    type: String,
    required: true,
  },
  clOrdId: {
    type: String,
    maxlength: 32,
  },
  tag: {
    type: String,
    maxlength: 16,
  },
  px: {
    type: String,
  },
  sz: {
    type: String,
    required: true,
  },
  ordType: {
    type: String,
    required: true,
    enum: ['market', 'limit', 'post_only', 'fok', 'ioc', 'optimal_limit_ioc'],
  },
  side: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
  },
  posSide: {
    type: String,
    enum: ['long', 'short'],
  },
  tdMode: {
    type: String,
    required: true,
    enum: ['cross', 'isolated', 'cash'],
  },
  accFillSz: {
    type: String,
  },
  fillPx: {
    type: String,
  },
  tradeId: {
    type: String,
  },
  fillSz: {
    type: String,
  },
  fillTime: {
    type: String,
  },
  avgPx: {
    type: String,
  },
  state: {
    type: String,
  },
  tpTriggerPx: {
    type: String,
  },
  tpTriggerPxType: {
    type: String,
    enum: ['last', 'index', 'mark'],
    default: 'last',
  },
  tpOrdPx: {
    type: String,
  },
  slTriggerPx: {
    type: String,
  },
  slTriggerPxType: {
    type: String,
    enum: ['last', 'index', 'mark'],
    default: 'last',
  },
  slOrdPx: {
    type: String,
  },
  stpId: {
    type: String,
  },
  stpMode: {
    type: String,
  },
  feeCcy: {
    type: String,
  },
  fee: {
    type: String,
  },
  rebateCcy: {
    type: String,
  },
  source: {
    type: String,
  },
  rebate: {
    type: String,
  },
  pnl: {
    type: String,
  },
  category: {
    type: String,
  },
  reduceOnly: {
    type: Boolean,
    default: false,
  },
  cancelSource: {
    type: String,
  },
  cancelSourceReason: {
    type: String,
  },
  algoClOrdId: {
    type: String,
  },
  algoId: {
    type: String,
  },
  uTime: {
    type: String,
  },
  cTime: {
    type: Number,
    set: (v) => Number(v),
  },
  banAmend: {
    type: Boolean,
    default: false,
  },
  mailSent: {
    type: Boolean,
    default: false,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
