const TxService = require('../services/tx.service');

class TxController {
  constructor() {
    this.txService = new TxService();
  }

  async setAccountLevel(req, res) {
    await this.txService.setAccountLevel(req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Account level updated',
    });
  }

  async setLeverage(req, res) {
    const data = await this.txService.setLeverage(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getLeverage(req, res) {
    const data = await this.txService.getLeverage(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getAccountLevel(req, res) {
    res.status(200).json({
      success: true,
      data: req.user.acctLv,
    });
  }

  async newOrder(req, res) {
    const data = await this.txService.newOrder(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async amendOrder(req, res) {
    const data = await this.txService.amendOrder(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }
  async amendAlgoOrder(req, res) {
    const data = await this.txService.amendAlgoOrder(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }
  async cancelOrder(req, res) {
    const data = await this.txService.cancelOrder(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getTrades(req, res) {
    const data = await this.txService.getTrades(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async orderBook(req, res) {
    const data = await this.txService.orderBook(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async generateDepositAddress(req, res) {
    const data = await this.txService.generateDepositAddress(
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getDepositAddress(req, res) {
    const data = await this.txService.getDepositAddress(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getCurrencies(req, res) {
    const data = await this.txService.getCurrencies(req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getDepositHistory(req, res) {
    const data = await this.txService.getDepositHistory(req.user, req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getOrdersHistory(req, res) {
    const data = await this.txService.getOrdersHistory(req.user, req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getOpenOrders(req, res) {
    const data = await this.txService.getOpenOrders(req.user, req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getTradingBalance(req, res) {
    const data = await this.txService.getTradingBalance(req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async withdraw(req, res) {
    const data = await this.txService.withdraw(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async withdrawHistory(req, res) {
    const data = await this.txService.withdrawHistory(req.user, req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async OrdersHistoryArchive(req, res) {
    const data = await this.txService.OrdersHistoryArchive(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async getOrdersDistribution(req, res) {
    const data = await this.txService.getOrdersDistribution(req.query);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async placeAlgoOrders(req, res) {
    const data = await this.txService.placeAlgoOrders(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async cancelAlgoOrders(req, res) {
    const data = await this.txService.cancelAlgoOrders(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async cancelAdvanceAlgoOrders(req, res) {
    const data = await this.txService.cancelAdvanceAlgoOrders(
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async closePosition(req, res) {
    const data = await this.txService.closePosition(req.body, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async positions(req, res) {
    const data = await this.txService.positions(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async positionsHistory(req, res) {
    const data = await this.txService.positionsHistory(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async maxSize(req, res) {
    const data = await this.txService.maxSize(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }

  async maxAvailSize(req, res) {
    const data = await this.txService.maxAvailSize(req.query, req.user);
    res.status(200).json({
      success: true,
      data: data,
    });
  }
}

module.exports = TxController;
