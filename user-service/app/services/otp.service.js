const { HttpException } = require('../errors/HttpException');
const { isEmpty } = require('../utils/empty');
const User = require('../models/user.model');
const {
  generateOtp,
  checkValidOTP,
  getOTP,
  otpType,
  otpPurpose,
} = require('../utils/otp_helper');
const {
  validateSendMobileOtp,
  validateVerifyMobileOtp,
} = require('../validators/otp_helper.validator');
const { publishMessage, publishSMStoQ } = require('../rabbitmq/publisher');
const logger = require('log4js').getLogger('otp_service');

class OtpService {
  async verifyEmailOtp(data) {
    if (isEmpty(data)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const isValidEmailOTP = await checkValidOTP({
      type: otpType.EMAIL,
      value: data.email,
      otp: data.otp,
      purpose: otpPurpose.VERIFY,
    });
    if (!isValidEmailOTP) {
      throw new HttpException(
        400,
        'OTP verification failed due to incorrect value or expired'
      );
    }
    const user = await User.findOne({
      email: data.email,
    });
    if (user.is_verified === false) {
      publishMessage({
        ums_id: user._id.toString(),
        email: user.email,
        acc_freeze: user.acc_freeze,
      }).catch((err) => logger.error(err));
    }
    user.is_verified = true;
    await user.save();
  }

  async sendMobileOtp(data) {
    if (isEmpty(data)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const { error } = validateSendMobileOtp(data);
    if (error) throw new HttpException(400, error.details[0].message);

    if (data.accounts_page) {
      const findUser = await User.findOne({
        phone_number: data.phone_number,
      });

      if (findUser)
        throw new HttpException(
          400,
          `User with same phone number already exists`
        );
    }

    const { otp } = await generateOtp({
      purpose: otpPurpose.VERIFY,
      type: otpType.MOBILE,
      value: `${data.country_code}${data.phone_number}`,
    });

    publishSMStoQ({
      country_code: data.country_code,
      phone_number: data.phone_number,
      otp: otp,
    }).catch((err) => {
      logger.error(err);
    });
  }

  async verifyMobileOtp(data) {
    if (isEmpty(data)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const { error } = validateVerifyMobileOtp(data);
    if (error) throw new HttpException(400, error.details[0].message);

    const isValidMobileOTP = await checkValidOTP({
      type: otpType.MOBILE,
      value: `${data.country_code}${data.phone_number}`,
      otp: data.otp,
      purpose: otpPurpose.VERIFY,
    });

    if (!isValidMobileOTP) {
      throw new HttpException(
        400,
        'OTP verification failed due to incorrect value or expired'
      );
    }
    if (data.accounts_page) {
      await User.updateOne(
        { email: data.email },
        { phone_number: data.phone_number, country_code: data.country_code }
      );
    }
    await User.updateOne(
      { phone_number: data.phone_number },
      { phone_flag: true }
    );
  }
}

module.exports = OtpService;
