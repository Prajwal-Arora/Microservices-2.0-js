const axios = require('axios');
const { HttpException } = require('../errors/HttpException');
const User = require('../models/user.model');
const LoginHistory = require('../models/loginHistory.model');
const { isEmpty } = require('../utils/empty');
const bcrypt = require('bcrypt');
const { ORDER_SERVICE } = require('../../config/env');

class UserService {
  async logout(body, user) {
    if (!body.ip) {
      throw new HttpException(400, 'Request body arguments incomplete');
    }
    user.active_logins = user.active_logins.filter((obj) => {
      return obj.ip !== body.ip;
    });
    await user.save();
  }

  async resetPass(req) {
    if (isEmpty(req.body.password)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.user.password = hashedPassword;
    await req.user.save();
    await axios.put(
      `${ORDER_SERVICE}/tog-user/8248239452135/pf/${req.user.email}`
    );
  }

  async fetchLoginHistory(req) {
    const lh = await LoginHistory.find({
      user: req.user._id,
    });
    return lh;
  }

  async togFreeze(req) {
    await axios.put(
      `${ORDER_SERVICE}/tog-user/8248239452135/tf/${req.user.email}`
    );
    if (req.user.acc_freeze === true) {
      req.user.acc_freeze = false;
      await req.user.save();
    } else {
      req.user.acc_freeze = true;
      await req.user.save();
    }
    return true;
  }
}

module.exports = UserService;
