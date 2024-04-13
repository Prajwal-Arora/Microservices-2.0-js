const User = require('../models/user.model');
const { HttpException } = require('../errors/HttpException');

class UserService {
  async togFreeze(params) {
    const findUser = await User.findOne({ email: params.email });
    if (!findUser) {
      throw new HttpException(
        400,
        `okx account does not exist for > ${params.email}`
      );
    }
    if (findUser.acc_freeze === true) {
      findUser.acc_freeze = false;
      findUser.acc_freeze_time = new Date().getTime();
      await findUser.save();
    } else {
      findUser.acc_freeze = true;
      await findUser.save();
    }
    return true;
  }

  async disableWithdraw(params) {
    const findUser = await User.findOne({ email: params.email });
    if (!findUser) {
      throw new HttpException(
        400,
        `okx account does not exist for > ${params.email}`
      );
    }
    findUser.pwd_change_time = new Date().getTime();
    await findUser.save();
    return true;
  }
}

module.exports = UserService;
