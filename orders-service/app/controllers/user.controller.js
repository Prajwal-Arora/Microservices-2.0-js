const UserService = require('../services/user.service');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async togFreeze(req, res) {
    await this.userService.togFreeze(req.params);
    res.status(200).json({ success: true });
  }

  async disableWithdraw(req, res) {
    await this.userService.disableWithdraw(req.params);
    res.status(200).json({ success: true });
  }
}

module.exports = UserController;
