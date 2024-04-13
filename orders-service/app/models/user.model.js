const crypto = require('crypto');
const mongoose = require('mongoose');
const { ENCRYPTION_KEY } = require('../../config/env');

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
    acc_freeze_time: {
      type: Number,
      default: 0,
    },
    pwd_change_time: {
      type: Number,
      default: 0,
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
    acctLv: {
      type: String,
      default: '1',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  if (this.okx_secret_key) {
    this.okx_secret_key = encrypt(this.okx_secret_key);
  }
  if (this.okx_api_key) {
    this.okx_api_key = encrypt(this.okx_api_key);
  }
  if (this.okx_passphrase) {
    this.okx_passphrase = encrypt(this.okx_passphrase);
  }
  next();
});

userSchema.post('init', function (doc) {
  if (doc.okx_secret_key) {
    doc.okx_secret_key = decrypt(doc.okx_secret_key);
  }
  if (doc.okx_api_key) {
    doc.okx_api_key = decrypt(doc.okx_api_key);
  }
  if (doc.okx_passphrase) {
    doc.okx_passphrase = decrypt(doc.okx_passphrase);
  }
});

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

function encrypt(text) {
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
