const express = require('express');
const http = require('http');
require('express-async-errors');
const { catchUnhandledError } = require('./utils/unhandledError');
const { attachServer, getInstance } = require('./utils/socket');
const { socketInit } = require('./socketInit');
const {
  PORT,
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

    this.initializeRoutes();
    this.attachWebSocketServer();
    socketInit();
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
      res.json({ message: 'hello from candle-web-socket-service' });
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
