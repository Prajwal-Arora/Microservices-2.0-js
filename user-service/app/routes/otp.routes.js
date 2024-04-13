const { Router } = require('express');
const OtpController = require('../controllers/otp.controller');

class OtpRoute {
  constructor() {
    this.path = '/um-api/v1/otp/';
    this.router = Router();
    this.otpController = new OtpController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.put(
      `${this.path}email-verification`,
      this.otpController.emailVerification.bind(this.otpController)
    );
    this.router.post(
      `${this.path}send-message`,
      this.otpController.sendMobileOtp.bind(this.otpController)
    );
    this.router.put(
      `${this.path}phone-verification`,
      this.otpController.verifyMobileOtp.bind(this.otpController)
    );
  }
}
module.exports = OtpRoute;
