const GeetestService = require('../services/geetest.service');

class GeetestController {
  constructor() {
    this.geetestService = new GeetestService();
  }

  async verify(req, res) {
    const data = req.body; // { lot_number, captcha_id, captcha_output, pass_token, gen_time }
    await this.geetestService.verify(data);
    res.status(200).json({
      success: true,
      message: 'Geetest verification successfull',
    });
  }
}

module.exports = GeetestController;
