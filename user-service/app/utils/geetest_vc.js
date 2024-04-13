const axios = require('axios');

async function geetestValidateCaptcha(captcha_id, datas) {
  const options = {
    url: `http://gcaptcha4.geetest.com/validate?captcha_id=${captcha_id}`,
    method: 'POST',
    params: datas,
    timeout: 5000,
  };

  const response = await axios(options);
  return response.data;
}

module.exports = {
  geetestValidateCaptcha,
};
