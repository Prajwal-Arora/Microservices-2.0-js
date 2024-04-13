const { Router } = require('express');
const AgController = require('../controllers/ag.controller');
const { authToken } = require('../middlewares/auth.middleware');

class AgRoute_User {
  constructor() {
    this.path = '/um-api/v1/';
    this.router = Router();
    this.agController = new AgController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}auth/signup`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}auth/login`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.put(
      `${this.path}auth/forgot-password`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}auth/sendEmailOtp`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}auth/pre-login`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.put(
      `${this.path}otp/email-verification`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}otp/send-message`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.put(
      `${this.path}otp/phone-verification`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}geetest/verify`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.get(
      `${this.path}user/details`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}user/logout`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.put(
      `${this.path}user/reset-password`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.get(
      `${this.path}user/loginHistory`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.put(
      `${this.path}user/toggle-freeze`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.get(
      `${this.path}2fa/setup2fa`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.put(
      `${this.path}2fa/verify2fa`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}2fa/validate2fa`,
      this.agController.request_userService.bind(this.agController)
    );
    this.router.post(
      `${this.path}2fa/disable2fa`,
      authToken,
      this.agController.request_userService.bind(this.agController)
    );
  }
}

module.exports = AgRoute_User;
