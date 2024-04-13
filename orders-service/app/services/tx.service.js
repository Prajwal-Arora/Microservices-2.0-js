const { HttpException } = require('../errors/HttpException');
const { isEmpty } = require('../utils/empty');
const {
  validateNewOrder,
  validateAlgoOrder,
  validateCancelOrder,
  validateOrderBookQuery,
  validateGetTrades,
  validateGenerateDepositAddress,
  validateGetDepositAddress,
  validateWithdraw,
  validateOrdersHistoryArchive,
  validateOpenOrdersArchive,
  validateOrdersDistribution,
  validateSetLeverage,
  validateGetLeverage,
  validateJobs,
  validateClosePosition,
  validatePositions,
  validatePositionsHistory,
  validateMaxSize,
  validateAmendOrder,
  validateAmendAlgoOrder,
} = require('../validators/tx.validator');
const {
  signPreHash,
  sendRequest,
  sendPublicRequest,
} = require('../utils/okx_helper');
const Order = require('../models/order.model');
const Deposits = require('../models/deposits.model');
const Withdraws = require('../models/withdraws.model');
const {
  OKX_MASTER_API_KEY,
  OKX_MASTER_PASSPHRASE,
} = require('../../config/env');
const { checkValidOTP } = require('../utils/otp_helper');
const { publishEmailtoQ } = require('../rabbitmq/publisher');
const logger = require('log4js').getLogger('tx-service');

class TxService {
  async setAccountLevel(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/account/set-account-level',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/account/set-account-level',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }
    user.acctLv = body.acctLv;
    await user.save();
  }

  async setLeverage(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateSetLeverage(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/account/set-leverage',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/account/set-leverage',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }
    return data.data;
  }

  async getLeverage(query, user) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateGetLeverage(query);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/account/leverage-info',
      query,
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/account/leverage-info',
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }
    return data.data;
  }

  async newOrder(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateNewOrder(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/order',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/order',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }
    await Order.create({
      user: user._id,
      ...body,
      ordId: data?.data[0]?.ordId,
      state: 'new',
    });

    const currentDate = new Date();
    const currentDateTimeString =
      currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();

    publishEmailtoQ({
      to: user.email,
      purpose: 'newOrder',
      orderId: data?.data[0]?.ordId,
      time: currentDateTimeString,
      amount: body.sz,
      order_type: body.ordType,
      order_side: body.side,
    }).catch((err) => logger.error(err));

    return data;
  }

  async amendOrder(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateAmendOrder(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/amend-order',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/amend-order',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }

    await Order.findOneAndUpdate(
      {
        user: user._id,
        ordId: body.ordId,
        instId: body.instId,
      },
      {
        ...body,
      }
    );

    return data;
  }

  async amendAlgoOrder(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateAmendAlgoOrder(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/amend-algos',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/amend-algos',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }

    await Order.findOneAndUpdate(
      {
        user: user._id,
        algoId: body.algoId,
        instId: body.instId,
      },
      {
        ...body,
      }
    );

    return data;
  }

  async cancelOrder(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateCancelOrder(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/cancel-order',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/cancel-order',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }

    await Order.findOneAndUpdate(
      {
        user: user._id,
        ...body,
      },
      {
        state: 'cancel',
      }
    );

    const currentDate = new Date();
    const currentDateTimeString =
      currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();

    publishEmailtoQ({
      to: user.email,
      purpose: 'cancelOrder',
      orderId: body.ordId,
      time: currentDateTimeString,
    }).catch((err) => logger.error(err));

    return data;
  }

  async getTrades(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateGetTrades(query);
    if (error) throw new HttpException(400, error.details[0].message);
    const data = await sendPublicRequest('GET', '/market/trades', query);
    if (data.msg) throw new HttpException(400, data.msg);
    return data.data;
  }

  async orderBook(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateOrderBookQuery(query);
    if (error) throw new HttpException(400, error.details[0].message);
    const data = await sendPublicRequest('GET', '/market/books', query);
    if (data.msg) throw new HttpException(400, data.msg);
    return data.data;
  }

  async generateDepositAddress(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateGenerateDepositAddress(body);
    if (error) throw new HttpException(400, error.details[0].message);

    body.subAcct = user.okx_account_name;
    body.to = '18';

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/asset/broker/nd/subaccount-deposit-address',
      {},
      body
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/asset/broker/nd/subaccount-deposit-address',
      {},
      body,
      OKX_MASTER_API_KEY,
      sign,
      timeStamp,
      OKX_MASTER_PASSPHRASE
    );
    if (data.msg) throw new HttpException(400, data.msg);
    return data.data;
  }

  async getDepositAddress(query, user) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateGetDepositAddress(query);
    if (error) throw new HttpException(400, error.details[0].message);

    query.subAcct = user.okx_account_name;
    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/asset/broker/nd/subaccount-deposit-address',
      query,
      {}
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/asset/broker/nd/subaccount-deposit-address',
      query,
      {},
      OKX_MASTER_API_KEY,
      sign,
      timeStamp,
      OKX_MASTER_PASSPHRASE
    );
    if (data.msg) throw new HttpException(400, data.msg);
    const res = data?.data?.filter((d) => d.to === '18' && d.selected === true);
    return res;
  }

  async getCurrencies(user) {
    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/asset/currencies',
      {},
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/asset/currencies',
      {},
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data.msg) throw new HttpException(400, data.msg);
    return data.data;
  }

  async getDepositHistory(user, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const dbQuery = {
      subAcct: user.okx_account_name,
    };
    if (query.instId) {
      dbQuery.instId = query.instId;
    }
    if (query.start && query.end) {
      dbQuery.cTime = {
        $gte: query.start,
        $lte: query.end,
      };
    }
    const history = await Deposits.find(dbQuery)
      .skip(startIndex)
      .limit(limit)
      .lean();
    const total = await Deposits.countDocuments(dbQuery);
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
    return { history, pagination };
  }

  async getOrdersHistory(user, query) {
    if (!query.instType) {
      throw new HttpException(400, 'instType is required');
    }
    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/trade/orders-history',
      query,
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/trade/orders-history',
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data.msg) throw new HttpException(400, data.msg);
    return data.data;
  }

  async getOpenOrders(user, query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    let url;
    if (
      query.ordType === 'market' ||
      query.ordType === 'limit' ||
      query.ordType === 'post_only' ||
      query.ordType === 'fok' ||
      query.ordType === 'ioc'
    ) {
      url = '/api/v5/trade/orders-pending';
    } else if (
      query.ordType === 'conditional' ||
      query.ordType === 'oco' ||
      query.ordType === 'trigger' ||
      query.ordType === 'move_order_stop'
    ) {
      url = '/api/v5/trade/orders-algo-pending';
    } else {
      throw new HttpException(400, 'Invalid ordType');
    }
    let { sign, timeStamp } = signPreHash(
      'GET',
      url,
      query,
      {},
      user.okx_secret_key
    );
    const data = await sendRequest(
      'GET',
      url,
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data.msg) throw new HttpException(400, data.msg);
    return data.data;
  }

  async getTradingBalance(user) {
    const query = { subAcct: user.okx_account_name };
    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/account/subaccount/balances',
      query,
      {}
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/account/subaccount/balances',
      query,
      {},
      OKX_MASTER_API_KEY,
      sign,
      timeStamp,
      OKX_MASTER_PASSPHRASE
    );
    if (data.msg) throw new HttpException(400, data.msg);
    return data?.data[0]?.details;
  }

  async withdraw(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateWithdraw(body);
    if (error) throw new HttpException(400, error.details[0].message);

    const isValidEmailOTP = await checkValidOTP({
      type: otpType.EMAIL,
      value: user.email,
      otp: body.otp,
      purpose: otpPurpose.VERIFY,
    });
    if (!isValidEmailOTP) {
      throw new HttpException(
        400,
        'OTP verification failed due to incorrect value or expired'
      );
    }

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/asset/withdrawal',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/asset/withdrawal',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data.msg) throw new HttpException(400, data.msg);
    return data;
  }

  async withdrawHistory(user, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const dbQuery = {
      subAcct: user.okx_account_name,
    };
    if (query.instId) {
      dbQuery.instId = query.instId;
    }
    if (query.start && query.end) {
      dbQuery.cTime = {
        $gte: query.start,
        $lte: query.end,
      };
    }
    const history = await Withdraws.find(dbQuery)
      .skip(startIndex)
      .limit(limit)
      .lean();
    const total = await Withdraws.countDocuments(dbQuery);
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };
    return { history, pagination };
  }

  async OrdersHistoryArchive(query, user) {
    const { error } = validateOrdersHistoryArchive(query);
    if (error) throw new HttpException(400, error.details[0].message);

    const arrayML = ['filled', 'canceled'];
    const arrayAlgo = ['effective', 'canceled', 'order_failed'];
    const arrayMLOPEN = ['live', 'partially_filled'];
    const arrayAlgoOPEN = [
      'live',
      'pause',
      'partially_effective',
      'partially_failed',
    ];

    const dbQuery = { user: user._id };

    if (
      query.ordType === 'market' ||
      query.ordType === 'limit' ||
      query.ordType === 'post_only' ||
      query.ordType === 'fok' ||
      query.ordType === 'ioc'
    ) {
      if (query.state === 'open') {
        dbQuery.state = { $in: arrayMLOPEN };
      } else {
        dbQuery.state = { $in: arrayML };
      }
      dbQuery.ordType = query.ordType;
    } else if (
      query.ordType === 'conditional' ||
      query.ordType === 'oco' ||
      query.ordType === 'trigger' ||
      query.ordType === 'move_order_stop'
    ) {
      if (query.state === 'open') {
        dbQuery.state = { $in: arrayAlgoOPEN };
      } else {
        dbQuery.state = { $in: arrayAlgo };
      }
      dbQuery.ordType = query.ordType;
    } else if (query.ordType === 'all') {
    } else {
      throw new HttpException(400, 'Invalid ordType');
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    if (query.instId) {
      dbQuery.instId = query.instId;
    }
    if (query.side) {
      dbQuery.side = query.side;
    }
    if (query.start && query.end) {
      dbQuery.cTime = {
        $gte: query.start,
        $lte: query.end,
      };
    }

    const history = await Order.find(dbQuery)
      .skip(startIndex)
      .limit(limit)
      .lean();
    const total = await Order.countDocuments(dbQuery);
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };

    return { history, pagination };
  }

  async getOrdersDistribution(query) {
    const { error } = validateOrdersDistribution(query);
    if (error) throw new HttpException(400, error.details[0].message);
    const hours = Number(query.filter.slice(0, -1));

    const result = await Order.aggregate([
      {
        $match: {
          cTime: { $gte: Date.now() - hours * 60 * 60 * 1000 },
        },
      },
      {
        $group: {
          _id: '$side',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const obj = result.reduce((a, c) => {
      a[c._id] = c.count;
      return a;
    }, {});
    if (!obj.buy) obj.buy = 0;
    if (!obj.sell) obj.sell = 0;
    return {
      buy: (obj.buy / (obj.buy + obj.sell)) * 100,
      sell: (obj.sell / (obj.buy + obj.sell)) * 100,
    };
  }

  async placeAlgoOrders(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateAlgoOrder(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/order-algo',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/order-algo',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }
    if (body.currentPrice) delete body.currentPrice;
    await Order.create({
      user: user._id,
      ...body,
      algoId: data?.data[0]?.algoId,
      state: 'algo',
    });

    const currentDate = new Date();
    const currentDateTimeString =
      currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString();

    publishEmailtoQ({
      to: user.email,
      purpose: 'newOrder',
      orderId: data?.data[0]?.algoId,
      time: currentDateTimeString,
      amount: body.sz,
      order_type: body.ordType,
      order_side: body.side,
    }).catch((err) => logger.error(err));

    return data;
  }

  async cancelAlgoOrders(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const isValid = validateJobs(body);
    if (!isValid) {
      throw new HttpException(400, 'Request body validation failed');
    }

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/cancel-algos',
      {},
      body.data,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/cancel-algos',
      {},
      body.data,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }

    await Order.updateMany(
      { algoId: { $in: body.data.map((b) => b.algoId) } },
      { state: 'cancelA' }
    );

    publishEmailtoQ({
      to: user.email,
      purpose: 'cancelOrder_array',
      data: body,
    }).catch((err) => logger.error(err));

    return data;
  }

  async cancelAdvanceAlgoOrders(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const isValid = validateJobs(body);
    if (!isValid) {
      throw new HttpException(400, 'Request body validation failed');
    }

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/cancel-advance-algos',
      {},
      body.data,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/cancel-advance-algos',
      {},
      body.data,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.data[0]?.sCode !== '0') {
      logger.error(data);
      throw new HttpException(400, data?.data[0]?.sMsg);
    }

    await Order.updateMany(
      { algoId: { $in: body.data.map((b) => b.algoId) } },
      { state: 'cancelA' }
    );

    publishEmailtoQ({
      to: user.email,
      purpose: 'cancelOrder_array',
      data: body,
    }).catch((err) => logger.error(err));

    return data;
  }

  async closePosition(body, user) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { error } = validateClosePosition(body);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'POST',
      '/api/v5/trade/close-position',
      {},
      body,
      user.okx_secret_key
    );

    const data = await sendRequest(
      'POST',
      '/api/v5/trade/close-position',
      {},
      body,
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );
    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }

    return data;
  }

  async positions(query, user) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validatePositions(query);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/account/positions',
      query,
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/account/positions',
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );

    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }

    return data.data;
  }

  async positionsHistory(query, user) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validatePositionsHistory(query);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/account/positions-history',
      query,
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/account/positions-history',
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );

    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }

    return data.data;
  }

  async maxSize(query, user) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateMaxSize(query);
    if (error) throw new HttpException(400, error.details[0].message);

    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/account/max-size',
      query,
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/account/max-size',
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );

    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }

    return data.data;
  }

  async maxAvailSize(query, user) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');

    let { sign, timeStamp } = signPreHash(
      'GET',
      '/api/v5/account/max-avail-size',
      query,
      {},
      user.okx_secret_key
    );

    const data = await sendRequest(
      'GET',
      '/api/v5/account/max-avail-size',
      query,
      {},
      user.okx_api_key,
      sign,
      timeStamp,
      user.okx_passphrase
    );

    if (data?.code !== '0') {
      throw new HttpException(400, data.msg);
    }

    return data.data;
  }
}

module.exports = TxService;
