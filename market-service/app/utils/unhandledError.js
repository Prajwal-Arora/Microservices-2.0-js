const logger = require('log4js').getLogger('unhandled_error');

const catchUnhandledError = () => {
  // catching uncaughtExceptions
  process.on('uncaughtException', (exception) => {
    logger.error('we got an Uncaught Exception', exception.message, exception);
  });

  // catching unhandledRejection
  process.on('unhandledRejection', (rejection) => {
    logger.error('we got an Unhandled Rejection', rejection);
  });

  // just incase warning are needed to be logged
  process.on('warning', (warning) => {
    logger.info(warning.stack);
  });
};

module.exports = { catchUnhandledError };
