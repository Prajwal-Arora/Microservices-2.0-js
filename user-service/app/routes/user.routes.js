const { Router } = require('express');
const UserController = require('../controllers/user.controller');
const { authToken } = require('../middlewares/auth.middleware');

class UserRoute {
  constructor() {
    this.path = '/um-api/v1/user/';
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}details`,
      authToken,
      this.userController.single.bind(this.userController)
    );
    this.router.post(
      `${this.path}logout`,
      authToken,
      this.userController.logout.bind(this.userController)
    );
    this.router.put(
      `${this.path}reset-password`,
      authToken,
      this.userController.resetPass.bind(this.userController)
    );
    this.router.get(
      `${this.path}loginHistory`,
      authToken,
      this.userController.fetchLoginHistory.bind(this.userController)
    );
    this.router.put(
      `${this.path}toggle-freeze`,
      authToken,
      this.userController.togFreeze.bind(this.userController)
    );
  }
}
module.exports = UserRoute;
