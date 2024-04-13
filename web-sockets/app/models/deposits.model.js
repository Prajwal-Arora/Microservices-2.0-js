const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema(
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
    to: {
      type: String,
      required: true,
    },
    txId: {
      type: String,
      required: true,
    },
    ts: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    depId: {
      type: String,
      required: true,
    },
    actualDepBlkConfirm: {
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

const Deposits = mongoose.model('Deposits', depositSchema);

module.exports = Deposits;
