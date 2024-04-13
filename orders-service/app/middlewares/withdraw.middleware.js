const { HttpException } = require('../errors/HttpException');

const pwdChangeCheck = async (req, res, next) => {
  if (new Date().getTime() >= req.user.pwd_change_time + 86400000) {
    next();
  }
  throw new HttpException(
    400,
    'Withdrawal unavailable at the moment, please wait for 24 hours after password change'
  );
};

module.exports = { pwdChangeCheck };
