const Redis = require('ioredis');
const logger = require('log4js').getLogger('redis_service');
const { REDIS_HOST, REDIS_PORT } = require('../../config/env');

module.exports = {
  getClient: () => {
    const client = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });

    client.on('ready', () => {
      logger.info('redis is ready ✅');
    });

    client.on('connect', () => {
      logger.info('redis connection established ✅');
    });

    client.on('reconnecting', () => {
      logger.info('redis reconnecting ⏳');
    });

    client.on('error', (error) => {
      logger.error('redis error occured 🚩', error);
    });

    client.on('end', () => {
      logger.error('redis connection ended 💔');
    });

    return client;
  },
};
