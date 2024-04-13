const cors = require('cors');
const express = require('express');
require('express-async-errors');
const helmet = require('helmet');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger/swagger.config');
// const rateLimit = require('express-rate-limit');
const {
  PORT,
  ELASTIC_APM_SERVICE_NAME,
  ELASTIC_APM_SERVER_URL,
} = require('../config/env');
const { catchUnhandledError } = require('./utils/unhandledError');
const { errorMiddleware } = require('./middlewares/error.middleware');
const logger = require('log4js').getLogger('gateway');

class App {
  constructor() {
    require('elastic-apm-node').start({
      serviceName: ELASTIC_APM_SERVICE_NAME,
      serverUrl: ELASTIC_APM_SERVER_URL,
    });
    this.app = express();
    this.port = PORT;
    this.routes = routes;

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

  initializeMiddlewares() {
    this.app.set('trust proxy', 1);
    this.app.use(cors({ origin: '*' }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(
    //   rateLimit({
    //     windowMs: 1 * 60 * 1000, // 1 minute
    //     max: 50, // Limit each IP to 20 requests per `window`
    //     message:
    //       'API calls limit exceeded, each IP is allowed 50 requests per minute',
    //     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    //     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    //   })
    // );
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
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    this.routes.forEach((route) => {
      this.app.use('/', route.router);
    });

    this.app.get('/healthcheck', (req, res) => {
      const ip = req.ip;
      res.json({ message: 'hello from gateway-service', ip });
    });
  }

  initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }
}

module.exports = App;
