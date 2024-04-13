const { Router } = require('express');
const AgController = require('../controllers/ag.controller');
const { authToken } = require('../middlewares/auth.middleware');

class AgRoute_Tx {
  constructor() {
    this.path = '/orders-api/v1/';
    this.router = Router();
    this.agController = new AgController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post(
      `${this.path}set-account-level`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}get-account-level`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}set-leverage`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}get-leverage`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}new-order`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}amend-order`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}amend-algo-order`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}cancel-order`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}recent-trades`,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}order-book`,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}generate-deposit-address`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}deposit-address`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}currencies`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}deposit-history`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}orders-history`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}open-orders`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}trading-balance`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}withdraw`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}withdraw-history`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}orders-history-archive`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}orders-distribution-chart`,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}algo-orders`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}cancel-algo-orders`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}cancel-advance-algo-orders`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.post(
      `${this.path}close-position`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}positions`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}positions-history`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}max-size`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
    this.router.get(
      `${this.path}max-avail-size`,
      authToken,
      this.agController.request_orderService.bind(this.agController)
    );
  }
}

module.exports = AgRoute_Tx;