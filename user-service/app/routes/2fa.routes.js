const { Router } = require('express');
const TwoFactorAuthController = require('../controllers/2fa.controller');
const { authToken } = require('../middlewares/auth.middleware');

class TwoFARoute {
  constructor() {
    this.path = '/um-api/v1/2fa/';
    this.router = Router();
    this.tfaController = new TwoFactorAuthController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}setup2fa`,
      authToken,
      this.tfaController.setupAuth.bind(this.tfaController)
    );
    this.router.put(
      `${this.path}verify2fa`,
      authToken,
      this.tfaController.verifyAuthAndUpdateUser.bind(this.tfaController)
    );
    this.router.post(
      `${this.path}validate2fa`,
      this.tfaController.validateAuth.bind(this.tfaController)
    );
    this.router.post(
      `${this.path}disable2fa`,
      authToken,
      this.tfaController.disable2Fa.bind(this.tfaController)
    );
  }
}

module.exports = TwoFARoute;
