const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    ums_id: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    acc_freeze: {
      type: Boolean,
      required: true,
    },
    okx_account_name: {
      type: String,
    },
    okx_secret_key: {
      type: String,
    },
    okx_api_key: {
      type: String,
    },
    okx_passphrase: {
      type: String,
    },
    okx_account_label: {
      type: String,
    },
    okx_creation_time: {
      type: String,
    },
    okx_uid: {
      type: String,
    },
    okx_perm: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('positions', {
  ref: 'Positions',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('deposits', {
  ref: 'Deposits',
  localField: 'okx_account_name',
  foreignField: 'subAcct',
});

userSchema.virtual('withdraws', {
  ref: 'Withdraws',
  localField: 'okx_account_name',
  foreignField: 'subAcct',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
