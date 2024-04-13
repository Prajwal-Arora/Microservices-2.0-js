const { Router } = require('express');
const UserController = require('../controllers/user.controller');

class UserRoute {
  constructor() {
    this.path = '/tog-user/8248239452135/';
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.put(
      `${this.path}tf/:email`,
      this.userController.togFreeze.bind(this.userController)
    );
    this.router.put(
      `${this.path}pf/:email`,
      this.userController.disableWithdraw.bind(this.userController)
    );
  }
}
module.exports = UserRoute;
