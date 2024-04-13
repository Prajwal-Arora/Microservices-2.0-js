const Joi = require('joi');

function validateChartDataQuery(object) {
  const schema = Joi.object({
    symbol: Joi.string().required(),
    filter: Joi.string()
      .valid('1D', '7D', '30D', '90D', '180D', '365D', 'ALL')
      .required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateHistoryQuery(object) {
  const schema = Joi.object({
    symbol: Joi.string().required(),
    resolution: Joi.string().valid(
      '1m',
      '3m',
      '5m',
      '15m',
      '30m',
      '1H',
      '2H',
      '4H',
      '6H',
      '12H',
      '1D',
      '2D',
      '3D',
      '1W',
      '1M',
      '3M'
    ),
    from: Joi.number(),
    to: Joi.number(),
  });
  const result = schema.validate(object);
  return result;
}

module.exports = {
  validateChartDataQuery,
  validateHistoryQuery,
};
