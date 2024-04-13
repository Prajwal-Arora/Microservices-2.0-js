const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');
const helmet = require('helmet');
const routes = require('./routes');
const { catchUnhandledError } = require('./utils/unhandledError');
const {
  PORT,
  MONGODB_CONNECTION_STRING,
  ELASTIC_APM_SERVICE_NAME,
  ELASTIC_APM_SERVER_URL,
} = require('../config/env');
const { errorMiddleware } = require('./middlewares/error.middleware');
const logger = require('log4js').getLogger('APP');

class App {
  constructor() {
    require('elastic-apm-node').start({
      serviceName: ELASTIC_APM_SERVICE_NAME,
      serverUrl: ELASTIC_APM_SERVER_URL,
    });
    this.app = express();
    this.port = PORT;
    this.routes = routes;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRequestLogs();
    this.initializeRoutes();
    this.initializeErrorMiddleware();
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

  initializeMiddlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRequestLogs() {
    this.app.use((req, res, next) => {
      const ip =
        req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
      logger.info(
        `${new Date().toISOString()} - ${req.method} ${req.url} - ${ip}`
      );
      next();
    });
  }

  initializeRoutes() {
    this.routes.forEach((route) => {
      this.app.use('/', route.router);
    });
    this.app.get('/healthcheck', (req, res) => {
      res.json({ message: 'hello from market-api-service' });
    });
  }

  initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }
}

module.exports = App;
