const log4js = require('log4js');
const App = require('./app/app');
const logConfig = require('./config/logConfig');
const { JWT_SECRET_KEY } = require('./config/env');

const start = async () => {
  log4js.configure(logConfig);
  if (!JWT_SECRET_KEY) {
    console.error('FATAL ERROR: JWT_SECRET_KEY is not been defined in env');
    process.exit(1);
  }
  const app = new App();
  app.listen();
};

start();
