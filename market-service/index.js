const log4js = require('log4js');
const App = require('./app/app');
const logConfig = require('./config/logConfig');

const start = async () => {
  log4js.configure(logConfig);
  const app = new App();
  app.listen();
};

start();
