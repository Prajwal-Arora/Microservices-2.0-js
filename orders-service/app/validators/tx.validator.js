const Joi = require('joi');

function validateNewOrder(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    tdMode: Joi.string().valid('cash', 'cross', 'isolated').required(),
    side: Joi.string().valid('buy', 'sell').required(),
    ordType: Joi.string()
      .valid('limit', 'market', 'post_only', 'fok', 'ioc')
      .required(),
    tgtCcy: Joi.string().valid('quote_ccy', 'base_ccy'),
    sz: Joi.string().required(),
    instType: Joi.string().valid('SPOT', 'SWAP'),
    px: Joi.string(),
    slOrdPx: Joi.string(),
    slTriggerPx: Joi.string(),
    slTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
    tpOrdPx: Joi.string(),
    tpTriggerPx: Joi.string(),
    tpTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
    reduceOnly: Joi.string().valid('true', 'false'),
    posSide: Joi.string().valid('long', 'short'),
  });
  const result = schema.validate(object);
  return result;
}

function validateAmendOrder(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    ordId: Joi.string().required(),
    newSz: Joi.string(),
    newPx: Joi.string(),
    newTpTriggerPx: Joi.string(),
    newTpOrdPx: Joi.string(),
    newSlTriggerPx: Joi.string(),
    newSlOrdPx: Joi.string(),
    newTpTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
    newSlTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
  });
  const result = schema.validate(object);

  return result;
}

function validateAmendAlgoOrder(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    algoId: Joi.string().required(),
    cxlOnFail: Joi.boolean(),
    newSz: Joi.string(),
    newTpTriggerPx: Joi.string(),
    newTpOrdPx: Joi.string(),
    newSlTriggerPx: Joi.string(),
    newSlOrdPx: Joi.string(),
    newTpTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
    newSlTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
  });
  const result = schema.validate(object);

  return result;
}
function validateAlgoOrder(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    tdMode: Joi.string().valid('cash', 'cross', 'isolated').required(),
    side: Joi.string().valid('buy', 'sell').required(),
    ordType: Joi.string()
      .valid('conditional', 'oco', 'trigger', 'move_order_stop')
      .required(),
    sz: Joi.string(),
    closeFraction: Joi.string(),
    posSide: Joi.string().valid('long', 'short'),
    slOrdPx: Joi.string(),
    slTriggerPx: Joi.string(),
    slTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
    tpOrdPx: Joi.string(),
    tpTriggerPx: Joi.string(),
    tpTriggerPxType: Joi.string().valid('last', 'index', 'mark'),
    tgtCcy: Joi.string().valid('quote_ccy', 'base_ccy'),
    orderPx: Joi.string(),
    proposedPx: Joi.string(),
    triggerPx: Joi.string(),
    triggerPxType: Joi.string().valid('last', 'index', 'mark'),
    callbackRatio: Joi.string(),
    callbackSpread: Joi.string(),
    activePx: Joi.string(),
    cxlOnClosePos: Joi.string().valid('true', 'false'),
    reduceOnly: Joi.string().valid('true', 'false'),
  });
  const result = schema.validate(object);
  return result;
}

function validateCancelOrder(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    ordId: Joi.string().required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateOrderBookQuery(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    sz: Joi.number(),
  });
  const result = schema.validate(object);
  return result;
}

function validateGetTrades(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    limit: Joi.string(),
  });
  const result = schema.validate(object);
  return result;
}

function validateGenerateDepositAddress(object) {
  const schema = Joi.object({
    ccy: Joi.string().required(),
    chain: Joi.string().required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateGetDepositAddress(object) {
  const schema = Joi.object({
    ccy: Joi.string().required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateWithdraw(object) {
  const schema = Joi.object({
    ccy: Joi.string().required(),
    amt: Joi.string().required(),
    dest: Joi.string().required(),
    toAddr: Joi.string().required(),
    fee: Joi.string().required(),
    chain: Joi.string().required(),
    otp: Joi.string().required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateOrdersHistoryArchive(object) {
  const schema = Joi.object({
    instId: Joi.string(),
    ordType: Joi.string(),
    side: Joi.string(),
    start: Joi.number(),
    end: Joi.number(),
    page: Joi.number(),
    limit: Joi.number(),
  });
  const result = schema.validate(object);
  return result;
}

function validateOpenOrdersArchive(object) {
  const schema = Joi.object({
    instId: Joi.string(),
    side: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
  });
  const result = schema.validate(object);
  return result;
}

function validateOrdersDistribution(object) {
  const schema = Joi.object({
    filter: Joi.string().valid('6H', '12H').required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateSetLeverage(object) {
  const schema = Joi.object({
    instId: Joi.string(),
    ccy: Joi.string(),
    lever: Joi.string().required(),
    mgnMode: Joi.string().valid('cross', 'isolated').required(),
    posSide: Joi.string().valid('long', 'short'),
  });
  const result = schema.validate(object);
  return result;
}

function validateGetLeverage(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    mgnMode: Joi.string().valid('cross', 'isolated').required(),
  });
  const result = schema.validate(object);
  return result;
}

function validateClosePosition(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    mgnMode: Joi.string().valid('cross', 'isolated').required(),
    posSide: Joi.string().valid('long', 'short'),
    ccy: Joi.string(),
    autoCxl: Joi.string().valid('true', 'false'),
    clOrdId: Joi.string(),
    tag: Joi.string(),
  });
  const result = schema.validate(object);
  return result;
}

function validatePositions(object) {
  const schema = Joi.object({
    instType: Joi.string().valid('SWAP'),
    instId: Joi.string(),
    posId: Joi.string(),
  });
  const result = schema.validate(object);
  return result;
}

function validatePositionsHistory(object) {
  const schema = Joi.object({
    instType: Joi.string().valid('SWAP'),
    instId: Joi.string(),
    posId: Joi.string(),
    mgnMode: Joi.string().valid('cross', 'isolated'),
    type: Joi.string(),
    after: Joi.string(),
    before: Joi.string(),
  });
  const result = schema.validate(object);
  return result;
}

function validateMaxSize(object) {
  const schema = Joi.object({
    instId: Joi.string().required(),
    tdMode: Joi.string().valid('cash', 'cross', 'isolated').required(),
    ccy: Joi.string(),
    px: Joi.string(),
    leverage: Joi.string(),
    unSpotOffset: Joi.string().valid('true', 'false'),
  });
  const result = schema.validate(object);
  return result;
}

function validateJobs({ data }) {
  if (!Array.isArray(data)) {
    return false; // The input is not an array
  }

  if (data.length > 10) {
    return false; // Exceeded the maximum limit of 10 objects
  }

  for (let i = 0; i < data.length; i++) {
    const job = data[i];
    if (!job.algoId || typeof job.algoId !== 'string') {
      return false; // algoId is missing or not a string
    }
    if (!job.instId || typeof job.instId !== 'string') {
      return false; // instId is missing or not a string
    }
  }

  return true; // All validation checks passed
}

module.exports = {
  validateNewOrder,
  validateAmendAlgoOrder,
  validateAmendOrder,
  validateAlgoOrder,
  validateCancelOrder,
  validateOrderBookQuery,
  validateGetTrades,
  validateGenerateDepositAddress,
  validateGetDepositAddress,
  validateWithdraw,
  validateOrdersHistoryArchive,
  validateOpenOrdersArchive,
  validateOrdersDistribution,
  validateSetLeverage,
  validateGetLeverage,
  validateJobs,
  validateClosePosition,
  validatePositions,
  validatePositionsHistory,
  validateMaxSize,
};
