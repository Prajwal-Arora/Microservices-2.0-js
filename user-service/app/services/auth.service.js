const axios = require('axios');
const bcrypt = require('bcrypt');
const { isEmpty } = require('../utils/empty');
const { HttpException } = require('../errors/HttpException');
const User = require('../models/user.model');
const LoginHistory = require('../models/loginHistory.model');
const { publishEmailtoQ } = require('../rabbitmq/publisher');
const {
  generateOtp,
  checkValidOTP,
  otpType,
  otpPurpose,
} = require('../utils/otp_helper');
const { ORDER_SERVICE } = require('../../config/env');

class AuthService {
  async sendEmailOtp(data) {
    if (isEmpty(data)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const { email, purpose } = data;

    if (purpose !== 'Signup') {
      const findUser = await User.findOne({
        email: email,
      });
      if (!findUser) {
        throw new HttpException(400, 'Email not registered with any user');
      }
    }

    const { otp } = await generateOtp({
      purpose: otpPurpose.VERIFY,
      type: otpType.EMAIL,
      value: email,
    });

    publishEmailtoQ({
      to: email,
      OTP: otp,
      purpose: purpose,
    }).catch((err) => {
      logger.error(err);
    });
  }

  async signUp(userData) {
    if (isEmpty(userData)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const findUser = await User.findOne({
      email: userData.email,
    });
    if (findUser && findUser.is_verified === false) {
      await this.sendEmailOtp({ email: userData.email, purpose: 'Signup' });
      return findUser;
    }
    if (findUser && findUser.is_verified === true) {
      throw new HttpException(400, `Email already exists`);
    }
    if (!findUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await this.sendEmailOtp({ email: userData.email, purpose: 'Signup' });
      const user = await User.create({
        email: userData.email,
        password: hashedPassword,
      });
      return user;
    }
  }

  async login(userData) {
    if (isEmpty(userData)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const findUser = await User.findOne({ email: userData.email });
    if (!findUser) {
      throw new HttpException(
        400,
        `This email ${userData.email} was not found`
      );
    }
    if (findUser.is_verified === false) {
      throw new HttpException(400, `Email is not verified`);
    }
    const isPasswordMatching = await bcrypt.compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching) {
      throw new HttpException(409, 'Password is incorrect');
    }
    const location = `${userData.city}, ${userData.regionName}, ${userData.country}`;
    const device = `${userData.device} / ${userData.os} / ${userData.browser}`;
    const token = await findUser.generateAuthToken(
      device,
      userData.ip,
      location
    );
    await LoginHistory.create({
      device: device,
      ip: userData.ip,
      location: location,
      user: findUser._id,
    });
    return { token, findUser };
  }

  async forgotPass(otp, email, password) {
    if (isEmpty(password)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const isValidEmailOTP = await checkValidOTP({
      type: otpType.EMAIL,
      value: email,
      otp: otp,
      purpose: otpPurpose.VERIFY,
    });
    if (!isValidEmailOTP) {
      throw new HttpException(
        400,
        'OTP verification failed due to incorrect value or expired'
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email: email }, { password: hashedPassword });
    await axios.put(`${ORDER_SERVICE}/tog-user/8248239452135/pf/${email}`);
  }

  async preLogin(userData) {
    if (isEmpty(userData)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const findUser = await User.findOne({ email: userData.email });
    if (!findUser) {
      throw new HttpException(
        400,
        `This email ${userData.email} was not found`
      );
    }
    if (findUser.is_verified === false) {
      throw new HttpException(400, `Email is not verified`);
    }
    const isPasswordMatching = await bcrypt.compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching) {
      throw new HttpException(409, 'Password is incorrect');
    }

    if (findUser.phone_flag || findUser.totp_flag) {
      return {
        token: null,
        findUser,
      };
    }
    const location = `${userData.city}, ${userData.regionName}, ${userData.country}`;
    const device = `${userData.device} / ${userData.os} / ${userData.browser}`;
    const token = await findUser.generateAuthToken(
      device,
      userData.ip,
      location
    );
    await LoginHistory.create({
      device: device,
      ip: userData.ip,
      location: location,
      user: findUser._id,
    });
    return {
      token,
      findUser,
    };
  }
}

module.exports = AuthService;
