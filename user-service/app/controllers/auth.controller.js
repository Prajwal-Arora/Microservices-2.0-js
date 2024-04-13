const AuthService = require('../services/auth.service');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async signUp(req, res) {
    const userData = req.body; // {email, password}
    const user = await this.authService.signUp(userData);
    res.status(200).json({
      success: true,
      user: user,
      message: 'Signup successfull, please verify your email',
    });
  }

  async login(req, res) {
    const userData = req.body; // {email, password, country, regionName, city, device, os, ip, browser}
    const { token, findUser } = await this.authService.login(userData);
    res.status(200).json({
      success: true,
      token: token,
      user: findUser,
      message: 'login successfull',
    });
  }

  async forgotPass(req, res) {
    await this.authService.forgotPass(
      req.body.otp,
      req.body.email,
      req.body.password
    );
    res.status(200).json({
      success: true,
      message: 'Password reset successfull',
    });
  }

  async sendEmailOtp(req, res) {
    await this.authService.sendEmailOtp(req.body); // {email, purpose}
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  }

  async preLogin(req, res) {
    const userData = req.body; // {email, password, country, regionName, city, device, os, ip, browser}
    const { token, findUser } = await this.authService.preLogin(userData);
    res.status(200).json({
      success: true,
      token: token,
      user: findUser,
      message: 'Pre-login successfull',
    });
  }
}

module.exports = AuthController;
