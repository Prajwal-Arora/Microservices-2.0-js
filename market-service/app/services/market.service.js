const moment = require('moment');
const axios = require('axios');
const { HttpException } = require('../errors/HttpException');
const { isEmpty } = require('../utils/empty');
const DailyModel = require('../models/int1D.model');
const HourlyModel = require('../models/int1H.model');
const FourHourlyModel = require('../models/int4H.model');
const CoinDetails = require('../models/cd.model');
const CoinsList = require('../models/cl.model');
const TMC = require('../models/tmc.model');
const Ftok = require('../models/favToken.model');
const {
  validateChartDataQuery,
  validateHistoryQuery,
} = require('../validators/market.validator');
const {
  priceChangeAggregator,
  mo_fiveCards,
} = require('../utils/service_helper');

class MarketService {
  async coinDetails(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { symbol } = query;
    const data = await CoinDetails.findOne({ symbol });
    const cl = await CoinsList.findOne({
      base_asset: symbol,
      quote_asset: 'USDT',
    });
    return { data, cl };
  }

  async fourCards() {
    const cl = await CoinsList.find({ quote_asset: 'USDT' });
    let upCount = 0;
    let downCount = 0;
    let totalVol = 0;
    for (const token of cl) {
      if (token.current_price > token.open24h) {
        upCount++;
      } else if (token.current_price < token.open24h) {
        downCount++;
      }
      totalVol += token.vol24h;
    }
    const doc = await TMC.findOne();
    return {
      firstCard: cl.length,
      secondCard: { up: upCount, down: downCount },
      thirdCard: {
        tmc: doc?.tmc,
        percentChange: doc?.tmc_yesterday_percentage_change,
      },
      fourthCard: totalVol,
    };
  }

  async fetchPriceChange(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { symbol } = query;
    const cl = await CoinsList.findOne({
      base_asset: symbol,
      quote_asset: 'USDT',
    });

    const data = await priceChangeAggregator(symbol);

    const percentChange24hrs =
      ((cl.current_price - cl.open24h) / cl.open24h) * 100;
    const percentChange7d =
      ((cl.current_price - data[0]?.record7DaysEarlier[0]?.value) /
        data[0]?.record7DaysEarlier[0]?.value) *
      100;
    const percentChange30d =
      ((cl.current_price - data[0]?.record30DaysEarlier[0]?.value) /
        data[0]?.record30DaysEarlier[0]?.value) *
      100;
    const percentChange90d =
      ((cl.current_price - data[0]?.record90DaysEarlier[0]?.value) /
        data[0]?.record90DaysEarlier[0]?.value) *
      100;
    const percentChange180d =
      ((cl.current_price - data[0]?.record180DaysEarlier[0]?.value) /
        data[0]?.record180DaysEarlier[0]?.value) *
      100;
    const percentChange365d =
      ((cl.current_price - data[0]?.record365DaysEarlier[0]?.value) /
        data[0]?.record365DaysEarlier[0]?.value) *
      100;
    const percentChangeAll =
      ((cl.current_price - data[0]?.oldestRecord[0]?.value) /
        data[0]?.oldestRecord[0]?.value) *
      100;

    return {
      percentChange24hrs,
      percentChange7d,
      percentChange30d,
      percentChange90d,
      percentChange180d,
      percentChange365d,
      percentChangeAll,
    };
  }

  async fetchCoinsList(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const thirtyDaysAgo = moment().subtract(30, 'days').valueOf();
    const limit = 50;
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * limit;
    const sortField = query.sort || 'market_cap';
    const sortOptions = {};

    // Sorting options based on the provided query parameters
    if (
      sortField === 'current_price' ||
      sortField === 'vol24h' ||
      sortField === 'market_cap'
    ) {
      if (query.sortType === 'asc') {
        sortOptions[sortField] = 1;
      } else {
        sortOptions[sortField] = -1;
      }
    }

    const clArray = await CoinsList.find({
      quote_asset: 'USDT',
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Fetching the 30-day previous data from the DailyModel collection
    const data = await Promise.all(
      clArray.map(async (obj, index) => {
        const symbol = obj.base_asset;
        const x = await DailyModel.find({
          base_asset: symbol,
          quote_asset: 'USDT',
          timestamp: { $lte: thirtyDaysAgo },
        })
          .sort({ timestamp: -1 })
          .limit(1);

        const percentChange30d =
          ((obj.current_price - x[0]?.value) / x[0]?.value) * 100;

        const trend = await this.chartData({
          symbol,
          filter: '7D',
        });

        return {
          index: skip + index,
          symbol: obj.base_asset,
          name: null,
          value: obj.current_price,
          percentChange24hrs:
            ((obj.current_price - obj.open24h) / obj.open24h) * 100,
          percentChange30d,
          value24hr: obj.vol24h,
          market_cap: obj.market_cap,
          trend,
        };
      })
    );
    const total = await CoinsList.countDocuments({ quote_asset: 'USDT' });

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    };

    return { data, pagination };
  }

  async chartData(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateChartDataQuery(query);
    if (error) throw new HttpException(400, error.details[0].message);
    const { symbol, filter } = query;
    const no_of_days = parseInt(filter.slice(0, -1));
    const ts = moment().subtract(no_of_days, 'days').valueOf();
    let schema;
    let timestampCondition;
    switch (filter) {
      case '1D':
      case '7D':
        schema = HourlyModel;
        timestampCondition = { $gt: ts };
        break;
      case '30D':
        schema = FourHourlyModel;
        timestampCondition = { $gt: ts };
        break;
      case '90D':
      case '180D':
      case '365D':
      case 'ALL':
        schema = DailyModel;
        if (filter !== 'ALL') {
          timestampCondition = { $gt: ts };
        }
        break;
    }
    const arr = await schema
      .find({
        base_asset: symbol,
        quote_asset: 'USDT',
        timestamp: timestampCondition,
      })
      .select('timestamp value');

    const data = arr.map((element) => ({
      timestamp: element.timestamp,
      value: element.value,
    }));

    return data;
  }

  async fetchPriceChangeDistribution() {
    const cl = await CoinsList.find({ quote_asset: 'USDT' });
    const positiveRangeCount = {
      '3%': {
        value: 0,
        perc: 3,
      },
      '5%': {
        value: 0,
        perc: 5,
      },
      '7%': {
        value: 0,
        perc: 7,
      },
      '10%': {
        value: 0,
        perc: 10,
      },
      '>10%': {
        value: 0,
        perc: 10,
      },
    };
    const negativeRangeCount = {
      '-3%': {
        value: 0,
        perc: -3,
      },
      '-5%': {
        value: 0,
        perc: -5,
      },
      '-7%': {
        value: 0,
        perc: -7,
      },
      '-10%': {
        value: 0,
        perc: -10,
      },
      '<-10%': {
        value: 0,
        perc: -10,
      },
    };
    for (const token of cl) {
      const percentChange24hrs =
        ((token.current_price - token.open24h) / token.open24h) * 100;

      if (percentChange24hrs >= 10) {
        positiveRangeCount['>10%'].value++;
      } else if (percentChange24hrs >= 7) {
        positiveRangeCount['10%'].value++;
      } else if (percentChange24hrs >= 5) {
        positiveRangeCount['7%'].value++;
      } else if (percentChange24hrs >= 3) {
        positiveRangeCount['5%'].value++;
      } else if (percentChange24hrs > 0) {
        positiveRangeCount['3%'].value++;
      } else if (percentChange24hrs <= -10) {
        negativeRangeCount['<-10%'].value++;
      } else if (percentChange24hrs <= -7) {
        negativeRangeCount['-10%'].value++;
      } else if (percentChange24hrs <= -5) {
        negativeRangeCount['-7%'].value++;
      } else if (percentChange24hrs <= -3) {
        negativeRangeCount['-5%'].value++;
      } else if (percentChange24hrs < 0) {
        negativeRangeCount['-3%'].value++;
      }
    }

    let up = 0;
    for (const key in positiveRangeCount) {
      if (positiveRangeCount.hasOwnProperty(key)) {
        up += positiveRangeCount[key].value;
      }
    }
    let down = 0;
    for (const key in negativeRangeCount) {
      if (negativeRangeCount.hasOwnProperty(key)) {
        down += negativeRangeCount[key].value;
      }
    }

    return { positiveRangeCount, negativeRangeCount, up, down };
  }

  async fiveCards() {
    const data = await mo_fiveCards();
    return data;
  }

  async incrementSearches(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const doc = await CoinsList.findOne({
      base_asset: query.symbol,
      quote_asset: 'USDT',
    });
    if (!doc) throw new HttpException(400, 'Symbol not found');
    doc.searches++;
    await doc.save();
  }

  async searchSymbol(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { search, quote_asset } = query;
    const db_query = {
      base_asset: {
        $regex: new RegExp(`.*${search}.*`, 'i'),
      },
      quote_asset: quote_asset,
    };
    const result = await CoinsList.find(db_query).select('base_asset');
    return result;
  }

  async tradingViewChart(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const { error } = validateHistoryQuery(query);
    if (error) throw new HttpException(400, error.details[0].message);
    const { symbol, resolution, from, to } = query;
    const instance = axios.create({
      baseURL: 'https://www.okx.com/api/v5/market/candles',
    });
    try {
      const { data } = await instance.request({
        method: 'GET',
        params: {
          instId: symbol,
          bar: resolution,
          before: from,
          after: to,
        },
      });
      return data.data;
    } catch (error) {
      return error;
    }
  }

  async tvCoinsList(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const limit = parseInt(query.limit);
    const page = parseInt(query.page) || 1;
    const skip = (page - 1) * limit;

    if (query.quote_asset === 'star') {
      const data = await this.fetchFavToken(query);
      return { data };
    } else {
      const clArray = await CoinsList.find({
        quote_asset: query.quote_asset,
      })
        .sort({ market_cap: -1 })
        .skip(skip)
        .limit(limit);

      const data = clArray.map((obj) => {
        return {
          symbol: `${obj.base_asset}/${obj.quote_asset}`,
          price: obj.current_price,
          percentChange24hrs:
            ((obj.current_price - obj.open24h) / obj.open24h) * 100,
        };
      });
      const total = await CoinsList.countDocuments({
        quote_asset: query.quote_asset,
      });

      const pagination = {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      };
      return { data, pagination };
    }
  }

  async tvBar(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const coin = await CoinsList.findOne({
      base_asset: query.base_asset,
      quote_asset: query.quote_asset,
    });
    return {
      symbol: `${coin.base_asset}/${coin.quote_asset}`,
      price: coin.current_price,
      percentChange24hrs:
        ((coin.current_price - coin.open24h) / coin.open24h) * 100,
      high24h: coin.high24h,
      low24h: coin.low24h,
      vol24h: coin.vol24h,
    };
  }

  async favToken(body) {
    if (isEmpty(body)) throw new HttpException(400, 'Request body is empty');
    const { email, base_asset, quote_asset } = body;
    const findUser = await Ftok.findOne({ email: email });
    if (!findUser) {
      const t = `${base_asset}/${quote_asset}`;
      const user = new Ftok({
        email: email,
        tokens: [t],
      });
      await user.save();
      return;
    }
    const index = findUser.tokens.indexOf(`${base_asset}/${quote_asset}`);
    if (index === -1) {
      findUser.tokens.push(`${base_asset}/${quote_asset}`);
    } else {
      findUser.tokens.splice(index, 1);
    }
    await findUser.save();
    return;
  }

  async fetchFavToken(query) {
    if (isEmpty(query)) throw new HttpException(400, 'Request query is empty');
    const findUser = await Ftok.findOne({ email: query.email });
    const tokenPairs = findUser.tokens;
    const token = await CoinsList.find({
      $or: tokenPairs.map((pair) => ({
        quote_asset: pair.split('/')[1],
        base_asset: pair.split('/')[0],
      })),
    });

    const data = token.map((obj) => {
      return {
        symbol: `${obj.base_asset}/${obj.quote_asset}`,
        price: obj.current_price,
        percentChange24hrs:
          ((obj.current_price - obj.open24h) / obj.open24h) * 100,
      };
    });

    return data;
  }
}

module.exports = MarketService;
