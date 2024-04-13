const { Router } = require('express');
const GeetestController = require('../controllers/geetest.controller');

class GeetestRoute {
  constructor() {
    this.path = '/um-api/v1/geetest/';
    this.router = Router();
    this.geetestController = new GeetestController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}verify`,
      this.geetestController.verify.bind(this.geetestController)
    );
  }
}
module.exports = GeetestRoute;
