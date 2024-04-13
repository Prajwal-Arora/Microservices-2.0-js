module.exports = {
  appenders: {
    console: {
      type: 'console',
    },
    access: {
      type: 'dateFile',
      filename: 'log/access.log',
      pattern: '-yyyy-MM-dd',
      category: 'http',
    },
    app: {
      type: 'file',
      filename: 'log/app.log',
      maxLogSize: 10485760,
      numBackups: 3,
    },
    errorFile: {
      type: 'file',
      filename: 'log/errors.log',
    },
    errors: {
      type: 'logLevelFilter',
      level: 'error',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['app', 'errors', 'console'],
      level: 'trace',
    },
    error: { appenders: ['errorFile'], level: 'error' },
    http: { appenders: ['access'], level: 'debug' },
  },
};
