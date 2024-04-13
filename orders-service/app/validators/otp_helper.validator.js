const Joi = require('joi');

function validateOTPVerification(object) {
  const schema = Joi.object({
    type: Joi.string().valid('EMAIL', 'PASS', 'MOBILE').required(),
    purpose: Joi.string().valid('VERIFY', 'RESET').required(),
    value: Joi.string().required(),
    otp: Joi.string().length(6).required(),
  });

  const result = schema.validate(object);
  return result;
}

function validateOTPExpiry(object) {
  const schema = Joi.object({
    type: Joi.string().valid('EMAIL', 'PASS', 'MOBILE').required(),
    purpose: Joi.string().valid('VERIFY', 'RESET').required(),
    value: Joi.string().required(),
  });

  const result = schema.validate(object);
  return result;
}

module.exports = {
  validateOTPVerification,
  validateOTPExpiry,
};
