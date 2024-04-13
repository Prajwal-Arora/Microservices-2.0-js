const otpGenerator = require('otp-generator');
const { OTP_EXPIRY } = require('../../config/env');
const { encryptData, decryptData } = require('./encrypt_helper');
const redisService = require('./redis_service');
const {
  validateOTPVerification,
  validateGenerateOTP,
  validateOTPExpiry,
} = require('../validators/otp_helper.validator');
const { HttpException } = require('../errors/HttpException');

const redisClient = redisService.getClient();

const otpEnum = Object.freeze({
  EMAIL: 'EMAIL',
  PASS: 'PASS',
  MOBILE: 'MOBILE',
});
const otpPurpose = Object.freeze({ VERIFY: 'VERIFY', RESET: 'RESET' });

module.exports = {
  otpType: otpEnum,
  otpPurpose: otpPurpose,
  generateOtp: async ({ purpose, type, value }) => {
    const { error } = validateGenerateOTP({ purpose, type, value });
    if (error) {
      throw new HttpException(
        400,
        `Invalid Input for generateOtp: ${error.details[0].message}`
      );
    }

    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      digits: true,
      specialChars: false,
    });

    const encryptedOtp = encryptData(otp);
    const key = `OTP/${purpose}/${type}/${value.trim().replace(' ', '')}`;

    await redisClient.set(key, encryptedOtp, 'EX', OTP_EXPIRY);
    const ttl = await redisClient.ttl(key);
    return { otp, ttl };
  },

  checkValidOTP: async ({ purpose, type, value, otp }) => {
    const { error } = validateOTPVerification({
      purpose,
      type,
      value,
      otp,
    });
    if (error) {
      throw new HttpException(
        400,
        `Invalid Input for validateOTP :${error.details[0].message}`
      );
    }

    const key = `OTP/${purpose}/${type}/${value.trim().replace(' ', '')}`;

    const encryptedOtp = await redisClient.get(key);
    if (!encryptedOtp) {
      return false;
    }

    const decryptedOtp = decryptData(encryptedOtp);
    if (decryptedOtp !== otp) {
      return false;
    }

    await redisClient.del(key);

    return true;
  },

  checkOTPExpiry: async ({ purpose, type, value }) => {
    const { error } = validateOTPExpiry({
      purpose,
      type,
      value,
    });
    if (error) {
      throw new HttpException(
        400,
        `Invalid Input for validateOTP :${error.details[0].message}`
      );
    }

    const key = `OTP/${purpose}/${type}/${value.trim().replace(' ', '')}`;

    const encrptedOtp = await redisClient.get(key);
    if (!encrptedOtp) {
      return false;
    }
    const ttl = await redisClient.ttl(key);
    return ttl;
  },

  getOTP: async ({ purpose, type, value }) => {
    const { error } = validateOTPExpiry({
      purpose,
      type,
      value,
    });
    if (error) {
      throw new HttpException(
        400,
        `Invalid Input for validateOTP :${error.details[0].message}`
      );
    }

    const key = `OTP/${purpose}/${type}/${value.trim().replace(' ', '')}`;

    const encrptedOtp = await redisClient.get(key);
    if (!encrptedOtp) {
      return 'otp expired';
    }
    const decryptedOtp = decryptData(encrptedOtp);
    return decryptedOtp;
  },
};
