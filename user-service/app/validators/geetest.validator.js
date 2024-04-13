const Joi = require('joi');

function validateGeetestParams(object) {
  const schema = Joi.object({
    lot_number: Joi.string().required(),
    captcha_output: Joi.string().required(),
    pass_token: Joi.string().required(),
    gen_time: Joi.string().required(),
    captcha_id: Joi.string().required(),
  });
  const result = schema.validate(object);
  return result;
}

module.exports = {
  validateGeetestParams,
};
