const crypto = require('crypto');
const { isEmpty } = require('../utils/empty');
const { HttpException } = require('../errors/HttpException');
const { validateGeetestParams } = require('../validators/geetest.validator');
const { geetestValidateCaptcha } = require('../utils/geetest_vc');
const { GEETEST_CAPTCHA_KEY } = require('../../config/env');

class GeetestService {
  async verify(data) {
    if (isEmpty(data)) {
      throw new HttpException(400, 'Request body is empty');
    }
    const { error } = validateGeetestParams(data);
    if (error) throw new HttpException(400, error.details[0].message);

    const sign_token = crypto
      .createHmac('sha256', GEETEST_CAPTCHA_KEY)
      .update(data.lot_number, 'utf8')
      .digest('hex');

    const response = await geetestValidateCaptcha(data.captcha_id, {
      lot_number: data.lot_number,
      captcha_output: data.captcha_output,
      pass_token: data.pass_token,
      gen_time: data.gen_time,
      sign_token: sign_token,
    });

    if (response.status == 'success' && response.result == 'fail') {
      throw new HttpException(
        400,
        `Geetest verification failed due to >> ${response.reason}`
      );
    }
    return true;
  }
}

module.exports = GeetestService;
