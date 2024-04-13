const mongoose = require('mongoose');
const validator = require('validator');
const { HttpException } = require('../errors/HttpException');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config/env');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new HttpException(400, 'Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new HttpException(400, 'Password cannot contain "password"');
        }
      },
    },
    phone_number: {
      type: Number,
      trim: true,
    },
    country_code: {
      type: Number,
      trim: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    phone_flag: {
      type: Boolean,
      default: false,
    },
    totp_flag: {
      type: Boolean,
      default: false,
    },
    active_logins: [
      {
        time: { type: Date, default: Date.now },
        device: { type: String, required: true, trim: true },
        ip: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
      },
    ],
    secret_key_2fa: {
      type: String,
      default: null,
    },
    acc_freeze: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.secret_key_2fa;
      },
    },
  }
);

userSchema.virtual('login_history', {
  ref: 'LoginHistory',
  localField: '_id',
  foreignField: 'user',
});

userSchema.methods.generateAuthToken = async function (device, ip, location) {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET_KEY, {
    expiresIn: '24h',
  });
  user.active_logins = user.active_logins.concat({
    device,
    ip,
    location,
  });
  await user.save();
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
