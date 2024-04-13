const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema(
  {
    subAcct: {
      type: String,
      required: true,
      ref: 'User',
    },
    ccy: {
      type: String,
      required: true,
    },
    chain: {
      type: String,
      required: true,
    },
    amt: {
      type: String,
      required: true,
    },
    ts: {
      type: Number,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
    },
    pmtId: {
      type: String,
    },
    memo: {
      type: String,
    },
    txId: {
      type: String,
      required: true,
    },
    fee: {
      type: String,
      required: true,
    },
    feeCcy: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    wdId: {
      type: String,
      required: true,
    },
    clientId: {
      type: String,
      required: true,
    },
    mailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Withdraws = mongoose.model('Withdraws', withdrawSchema);

module.exports = Withdraws;
