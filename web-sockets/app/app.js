const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
require('express-async-errors');
const { catchUnhandledError } = require('./utils/unhandledError');
const { attachServer, getInstance } = require('./utils/socket');
const { socketInit } = require('./socketInit');
const { privateSocketInit } = require('./privateSocketInit');
const {
  PORT,
  MONGODB_CONNECTION_STRING,
  ELASTIC_APM_SERVICE_NAME,
  ELASTIC_APM_SERVER_URL,
} = require('../config/env');
const logger = require('log4js').getLogger('APP');

class App {
  constructor() {
    require('elastic-apm-node').start({
      serviceName: ELASTIC_APM_SERVICE_NAME,
      serverUrl: ELASTIC_APM_SERVER_URL,
    });
    this.app = express();
    this.port = PORT;
    this.server = http.createServer(this.app);

    this.connectToDatabase();
    this.initializeRoutes();
    this.attachWebSocketServer();
    socketInit();
    privateSocketInit();
  }

  listen() {
    this.server.listen(this.port, () => {
      catchUnhandledError();
      logger.info('=================================');
      logger.info(`🚀 App listening on port ${this.port}`);
      logger.info('=================================');
    });
  }

  initializeRoutes() {
    this.app.get('/healthcheck', (req, res) => {
      res.json({ message: 'hello from web-socket-service' });
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

  attachWebSocketServer() {
    attachServer(this.server);
    io = getInstance();

    io.on('connection', (socket) => {
      logger.log('User connected: ' + socket.id + ' ✅');

      socket.on('error', (err) => {
        logger.error(`socket error 🚩 ${err}`);
      });

      socket.on('disconnect', () => {
        logger.log('User disconnected: ' + socket.id + ' 💔');
      });
    });
  }
}

module.exports = App;
