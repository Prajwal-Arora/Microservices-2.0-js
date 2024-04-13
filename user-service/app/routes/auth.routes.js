const { Router } = require('express');
const AuthController = require('../controllers/auth.controller');

class AuthRoute {
  constructor() {
    this.path = '/um-api/v1/auth/';
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}signup`,
      this.authController.signUp.bind(this.authController)
    );
    this.router.post(
      `${this.path}login`,
      this.authController.login.bind(this.authController)
    );
    this.router.put(
      `${this.path}forgot-password`,
      this.authController.forgotPass.bind(this.authController)
    );
    this.router.post(
      `${this.path}sendEmailOtp`,
      this.authController.sendEmailOtp.bind(this.authController)
    );
    this.router.post(
      `${this.path}pre-login`,
      this.authController.preLogin.bind(this.authController)
    );
  }
}
module.exports = AuthRoute;
