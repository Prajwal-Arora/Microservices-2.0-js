const TwoFactorAuthHelper = require('../utils/2fa_helper');
const User = require('../models/user.model');
const { isEmpty } = require('../utils/empty');
const { HttpException } = require('../errors/HttpException');

const tfaHelper = new TwoFactorAuthHelper();

class TwoFactorAuthService {
  async setupAuth(user) {
    if (user.totp_flag) {
      throw new HttpException(400, `TOTP is already bound for this user`);
    }
    const secretCode = tfaHelper.generateSecret(user.email);
    return secretCode;
  }

  async verifyAuthAndUpdateUser(data, user) {
    if (isEmpty(data)) throw new HttpException(400, 'Request body is empty');
    const { otp, secretKey } = data;
    const isVerified = tfaHelper.verifyTwoFactorAuthCode(otp, secretKey);
    if (!isVerified) throw new HttpException(400, 'Invalid Token');

    await User.updateOne(
      { email: user.email },
      { totp_flag: true, secret_key_2fa: secretKey }
    );
  }

  async validateAuth(data) {
    if (isEmpty(data)) throw new HttpException(400, 'Request body is empty');
    const { id, otp } = data;
    const user = await User.findById(id);
    if (!user) throw new HttpException(400, `User not found`);

    const isVerified = tfaHelper.verifyTwoFactorAuthCode(
      otp,
      user.secret_key_2fa
    );
    if (!isVerified) throw new HttpException(400, 'Invalid Token');
  }

  async disable2Fa(data, user) {
    if (isEmpty(data)) throw new HttpException(400, 'Request body is empty');

    const { otp } = data;
    const isVerified = tfaHelper.verifyTwoFactorAuthCode(
      otp,
      user.secret_key_2fa
    );

    if (!isVerified) throw new HttpException(400, 'Invalid Token');

    await User.updateOne(
      { email: user.email },
      { totp_flag: false, secret_key_2fa: null }
    );
  }
}

module.exports = TwoFactorAuthService;
