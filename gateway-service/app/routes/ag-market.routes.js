const { Router } = require('express');
const AgController = require('../controllers/ag.controller');
const { authToken } = require('../middlewares/auth.middleware');

class AgRoute_Market {
  constructor() {
    this.path = '/market-api/v1/';
    this.router = Router();
    this.agController = new AgController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}fetch/price-change`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/coin-details`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/coin-list`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/chart-data`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/market-cards`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/market-overview-cards`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/pd-chart-data`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.put(
      `${this.path}inc-searches`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/search`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/tv-chart`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/tv-coins-list`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/tv-bar`,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.post(
      `${this.path}set/favToken`,
      authToken,
      this.agController.request_marketService.bind(this.agController)
    );
    this.router.get(
      `${this.path}fetch/favTokens`,
      authToken,
      this.agController.request_marketService.bind(this.agController)
    );
  }
}

module.exports = AgRoute_Market;
