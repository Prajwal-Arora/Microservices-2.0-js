const TwoFactorAuthService = require('../services/2fa.service');

class TwoFactorAuthController {
  constructor() {
    this.tfaService = new TwoFactorAuthService();
  }

  async setupAuth(req, res) {
    const secretCode = await this.tfaService.setupAuth(req.user);
    res.status(200).json({
      success: true,
      secret: secretCode.otpauthUrl,
      secretKey: secretCode.base32,
    });
  }

  async verifyAuthAndUpdateUser(req, res) {
    const data = req.body; // {otp, secretKey}
    await this.tfaService.verifyAuthAndUpdateUser(data, req.user);
    res.status(200).json({
      success: true,
      message: 'User is successfully verified',
    });
  }

  async validateAuth(req, res) {
    const data = req.body; // {id, otp}
    await this.tfaService.validateAuth(data);
    res.status(200).json({
      success: true,
      message: 'User is valid',
    });
  }

  async disable2Fa(req, res) {
    const data = req.body; // {otp}
    await this.tfaService.disable2Fa(data, req.user);
    res.status(200).json({
      success: true,
      message: 'User Disabled Successfully',
    });
  }
}

module.exports = TwoFactorAuthController;
