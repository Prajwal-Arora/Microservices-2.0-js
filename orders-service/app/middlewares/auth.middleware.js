const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET_KEY } = require('../../config/env');
const { HttpException } = require('../errors/HttpException');

const authToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY);
  const user = await User.findOne({ ums_id: decoded._id });

  if (!user) {
    throw new HttpException(404, `User not found`);
  }

  req.token = token;
  req.user = user;
  next();
};

module.exports = { authToken };
