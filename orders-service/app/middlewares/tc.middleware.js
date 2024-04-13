const { HttpException } = require('../errors/HttpException');

const oneDayCheck = async (req, res, next) => {
  if (
    req.user.acc_freeze === false &&
    new Date().getTime() >= req.user.acc_freeze_time + 86400000
  ) {
    next();
  }
  throw new HttpException(
    400,
    'Withdrawal unavailable at the moment, please wait for 24 hours after account has been unfreezed'
  );
};

module.exports = { oneDayCheck };
