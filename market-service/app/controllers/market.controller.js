const MarketService = require('../services/market.service');

class MarketController {
  constructor() {
    this.marketService = new MarketService();
  }

  async fetchPriceChange(req, res) {
    const data = await this.marketService.fetchPriceChange(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async coinDetails(req, res) {
    const data = await this.marketService.coinDetails(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async fetchCoinsList(req, res) {
    const data = await this.marketService.fetchCoinsList(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async chartData(req, res) {
    const data = await this.marketService.chartData(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async fourCards(req, res) {
    const data = await this.marketService.fourCards();
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async fiveCards(req, res) {
    const data = await this.marketService.fiveCards();
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async fetchPriceChangeDistribution(req, res) {
    const data = await this.marketService.fetchPriceChangeDistribution();
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async incrementSearches(req, res) {
    await this.marketService.incrementSearches(req.query);
    res.status(200).json({
      success: true,
    });
  }

  async searchSymbol(req, res) {
    const searches = await this.marketService.searchSymbol(req.query);
    res.status(200).json({
      success: true,
      data: searches,
    });
  }

  async tradingViewChart(req, res) {
    const data = await this.marketService.tradingViewChart(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async tvCoinsList(req, res) {
    const data = await this.marketService.tvCoinsList(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async tvBar(req, res) {
    const data = await this.marketService.tvBar(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async favToken(req, res) {
    await this.marketService.favToken(req.body);
    res.status(200).json({
      success: true,
      message: 'Favourite tokens list updated',
    });
  }

  async fetchFavToken(req, res) {
    const data = await this.marketService.fetchFavToken(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }
}

module.exports = MarketController;
