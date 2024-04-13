const axios = require('axios');
const {
  USER_SERVICE,
  MARKET_SERVICE,
  ORDER_SERVICE,
} = require('../../config/env');
const logger = require('log4js').getLogger('gateway-controller');

class AgController {
  async makeRequest(serviceUrl, req, res) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'Application/json',
      Authorization: req.headers.authorization,
    };

    try {
      if (req.method === 'POST') {
        const response = await axios.post(`${serviceUrl}${req.url}`, req.body, {
          headers,
        });
        res.send(response.data);
      } else if (req.method === 'PUT') {
        const response = await axios.put(`${serviceUrl}${req.url}`, req.body, {
          headers,
        });
        res.send(response.data);
      } else if (req.method === 'GET') {
        const response = await axios.get(`${serviceUrl}${req.url}`, {
          headers,
        });
        res.send(response.data);
      }
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        logger.error(error);
        res.send(error);
      }
    }
  }

  async request_userService(req, res) {
    await this.makeRequest(USER_SERVICE, req, res);
  }

  async request_marketService(req, res) {
    await this.makeRequest(MARKET_SERVICE, req, res);
  }

  async request_orderService(req, res) {
    await this.makeRequest(ORDER_SERVICE, req, res);
  }
}

module.exports = AgController;
