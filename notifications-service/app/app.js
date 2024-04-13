const cors = require('cors');
const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const { catchUnhandledError } = require('./utils/unhandledError');
const {
  PORT,
  ELASTIC_APM_SERVICE_NAME,
  ELASTIC_APM_SERVER_URL,
} = require('../config/env');
const {
  consumeMessagesEmail,
  consumeMessagesSMS,
} = require('./rabbitmq/consumer');
const logger = require('log4js').getLogger('APP');

class App {
  constructor() {
    require('elastic-apm-node').start({
      serviceName: ELASTIC_APM_SERVICE_NAME,
      serverUrl: ELASTIC_APM_SERVER_URL,
    });
    this.app = express();
    this.port = PORT;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeRabbitMqConsumer();
  }

  listen() {
    this.app.listen(this.port, () => {
      catchUnhandledError();
      logger.info('=================================');
      logger.info(`🚀 App listening on port ${this.port}`);
      logger.info('=================================');
    });
  }

  initializeMiddlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    this.app.get('/healthcheck', (req, res) => {
      res.json({ message: 'hello from notification-service' });
    });
  }

  initializeRabbitMqConsumer() {
    consumeMessagesEmail().catch((error) => {
      logger.error(error);
      process.exit(1);
    });
    consumeMessagesSMS().catch((error) => {
      logger.error(error);
      process.exit(1);
    });
  }
}

module.exports = App;
