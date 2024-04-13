const { HttpException } = require('../errors/HttpException');

const freezeCheck = async (req, res, next) => {
  if (req.user.acc_freeze === true) {
    throw new HttpException(400, 'Account is currently freezed');
  }
  next();
};

module.exports = { freezeCheck };
