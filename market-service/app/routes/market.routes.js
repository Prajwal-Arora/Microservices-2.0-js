const { Router } = require('express');
const MarketController = require('../controllers/market.controller');

class MarketRoute {
  constructor() {
    this.path = '/market-api/v1/';
    this.router = Router();
    this.marketController = new MarketController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(
      `${this.path}fetch/price-change`,
      this.marketController.fetchPriceChange.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/coin-details`,
      this.marketController.coinDetails.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/coin-list`,
      this.marketController.fetchCoinsList.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/chart-data`,
      this.marketController.chartData.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/market-cards`,
      this.marketController.fourCards.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/market-overview-cards`,
      this.marketController.fiveCards.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/pd-chart-data`,
      this.marketController.fetchPriceChangeDistribution.bind(
        this.marketController
      )
    );
    this.router.put(
      `${this.path}inc-searches`,
      this.marketController.incrementSearches.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/search`,
      this.marketController.searchSymbol.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/tv-chart`,
      this.marketController.tradingViewChart.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/tv-coins-list`,
      this.marketController.tvCoinsList.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/tv-bar`,
      this.marketController.tvBar.bind(this.marketController)
    );
    this.router.post(
      `${this.path}set/favToken`, // add authToken in gateway for this
      this.marketController.favToken.bind(this.marketController)
    );
    this.router.get(
      `${this.path}fetch/favTokens`, // add authToken in gateway for this
      this.marketController.fetchFavToken.bind(this.marketController)
    );
  }
}

module.exports = MarketRoute;
