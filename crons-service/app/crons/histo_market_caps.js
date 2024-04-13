const schedule = require('node-schedule');
const HMC = require('../models/hmc.model');
const logger = require('log4js').getLogger('hmc_cron');
const symbols = [
  'BTC',
  'ETH',
  'BNB',
  'XRP',
  'ADA',
  'DOGE',
  'TRX',
  'SOL',
  'LTC',
  'MATIC',
];
