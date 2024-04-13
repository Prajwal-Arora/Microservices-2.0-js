const OtpService = require('../services/otp.service');

class OtpController {
  constructor() {
    this.otpService = new OtpService();
  }

  async emailVerification(req, res) {
    const data = req.body; // {email, otp}
    await this.otpService.verifyEmailOtp(data);
    res.status(200).json({
      success: true,
      message: 'OTP verification successfull',
    });
  }

  async sendMobileOtp(req, res) {
    const data = req.body; // {country_code, phone_number, ?accounts_page}
    await this.otpService.sendMobileOtp(data);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  }

  async verifyMobileOtp(req, res) {
    const data = req.body; // {email, country_code, phone_number, otp, ?accounts_page}
    await this.otpService.verifyMobileOtp(data);
    res
      .status(200)
      .json({ success: true, message: 'OTP verification successfull' });
  }
}

module.exports = OtpController;
