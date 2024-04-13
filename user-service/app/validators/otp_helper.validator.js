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

function validateGenerateOTP(object) {
  const schema = Joi.object({
    type: Joi.string().valid('EMAIL', 'PASS', 'MOBILE').required(),
    purpose: Joi.string().valid('VERIFY', 'RESET').required(),
    value: Joi.string().required(),
  });

  const result = schema.validate(object);
  return result;
}

function validateEmailVerificationOtp(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const result = schema.validate(body);
  return result;
}

function validateSendMobileOtp(body) {
  const schema = Joi.object({
    country_code: Joi.number().required(),
    phone_number: Joi.number().required(),
    accounts_page: Joi.boolean(),
  });

  const result = schema.validate(body);
  return result;
}

function validateVerifyMobileOtp(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    country_code: Joi.number().required(),
    phone_number: Joi.number().required(),
    otp: Joi.string().length(6).required(),
    accounts_page: Joi.boolean(),
  });

  const result = schema.validate(body);
  return result;
}

module.exports = {
  validateGenerateOTP,
  validateEmailVerificationOtp,
  validateOTPVerification,
  validateOTPExpiry,
  validateSendMobileOtp,
  validateVerifyMobileOtp,
};
