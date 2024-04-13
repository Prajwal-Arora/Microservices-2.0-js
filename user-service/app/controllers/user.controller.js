const UserService = require('../services/user.service');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async single(req, res) {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }

  async logout(req, res) {
    await this.userService.logout(req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'logout successfull',
    });
  }

  async resetPass(req, res) {
    await this.userService.resetPass(req);
    res.status(200).json({
      success: true,
      message: 'Password reset successfull',
    });
  }

  async fetchLoginHistory(req, res) {
    const lh = await this.userService.fetchLoginHistory(req);
    res.status(200).json({
      success: true,
      loginHistory: lh,
    });
  }

  async togFreeze(req, res) {
    await this.userService.togFreeze(req);
    res.status(200).json({
      success: true,
      message: 'Account freeze status set',
    });
  }
}

module.exports = UserController;
