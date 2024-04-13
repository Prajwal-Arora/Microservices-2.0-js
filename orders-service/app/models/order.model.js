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
    enum: [
      'market',
      'limit',
      'conditional',
      'oco',
      'trigger',
      'move_order_stop',
      'post_only',
      'fok',
      'ioc',
    ],
  },
  side: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
  },
  posSide: {
    type: String,
    enum: ['long', 'short', 'net'],
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
    enum: ['last', 'index', 'mark', ''],
  },
  tpOrdPx: {
    type: String,
  },
  slTriggerPx: {
    type: String,
  },
  slTriggerPxType: {
    type: String,
    enum: ['last', 'index', 'mark', ''],
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
    type: Number,
    set: (v) => Number(v),
  },
  cTime: {
    type: Number,
    set: (v) => Number(v),
  },
  banAmend: {
    type: Boolean,
  },
  mailSent: {
    type: Boolean,
    default: false,
  },
  ordIdList: [
    {
      type: String,
    },
  ],
  closeFraction: {
    type: String,
  },
  lever: {
    type: String,
  },
  ordPx: {
    type: String,
  },
  actualSz: {
    type: String,
  },
  actualPx: {
    type: String,
  },
  actualSide: {
    type: String,
  },
  pxVar: {
    type: String,
  },
  pxSpread: {
    type: String,
  },
  pxLimit: {
    type: String,
  },
  szLimit: {
    type: String,
  },
  timeInterval: {
    type: String,
  },
  callbackRatio: {
    type: String,
  },
  callbackSpread: {
    type: String,
  },
  activePx: {
    type: String,
  },
  moveTriggerPx: {
    type: String,
  },
  triggerTime: {
    type: Number,
    set: (v) => Number(v),
  },
  last: {
    type: String,
  },
  failCode: {
    type: String,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
