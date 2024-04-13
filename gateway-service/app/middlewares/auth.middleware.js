const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../../config/env');
const logger = require('log4js').getLogger('auth-middleware');

const authToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  logger.info(`Request from user _id = ${decoded._id}`);
  next();
};

module.exports = { authToken };
