const { decryptData } = require('./encrypt_helper');
const redisService = require('./redis_service');
const {
  validateOTPVerification,
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
};
