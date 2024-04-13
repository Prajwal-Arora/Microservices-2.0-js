const AuthRoute = require('./auth.routes');
const OtpRoute = require('./otp.routes');
const GeetestRoute = require('./geetest.routes');
const UserRoute = require('./user.routes');
const TwoFARoute = require('./2fa.routes');

module.exports = [
  new AuthRoute(),
  new OtpRoute(),
  new GeetestRoute(),
  new UserRoute(),
  new TwoFARoute(),
];
