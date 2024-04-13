const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const { catchUnhandledError } = require('./utils/unhandledError');
const {
  PORT,
  MONGODB_CONNECTION_STRING,
  ELASTIC_APM_SERVICE_NAME,
  ELASTIC_APM_SERVER_URL,
} = require('../config/env');
const { initializeCrons } = require('./utils/initializeCrons');
const logger = require('log4js').getLogger('APP');

class App {
  constructor() {
    require('elastic-apm-node').start({
      serviceName: ELASTIC_APM_SERVICE_NAME,
      serverUrl: ELASTIC_APM_SERVER_URL,
    });
    this.app = express();
    this.port = PORT;

    this.connectToDatabase();
    this.initializeRoutes();
    initializeCrons();
  }

  listen() {
    this.app.listen(this.port, () => {
      catchUnhandledError();
      logger.info('=================================');
      logger.info(`🚀 App listening on port ${this.port}`);
      logger.info('=================================');
    });
  }

  connectToDatabase() {
    mongoose
      .connect(MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        logger.info('Database connection successful ✅');
      })
      .catch((err) => {
        logger.error('Database connection error >> ' + err);
      });
  }

  initializeRoutes() {
    this.app.get('/healthcheck', (req, res) => {
      res.json({ message: 'hello from crons-service' });
    });
  }
}

module.exports = App;
