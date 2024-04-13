const { depositsCron } = require('../crons/deposits');
const { withdrawsCron } = require('../crons/withdraws');
const { ordersCron, algoOrdersCron } = require('../crons/orders');
const logger = require('log4js').getLogger('initialize-crons');

async function initializeCrons() {
  try {
    depositsCron();
    withdrawsCron();
    ordersCron();
    algoOrdersCron();
  } catch (err) {
    logger.error(err);
  }
}

module.exports = {
  initializeCrons,
};
