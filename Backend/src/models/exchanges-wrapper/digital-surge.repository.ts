import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exchangeConnection } from '../../common/ccxt/connection.providers';
import { data } from './data';
import { closedOrders } from './closedOrders';
import { Spot } from '@binance/connector';
import { coinGeckoRequest, getCoinId } from './common/coingeckoFunctions';
import { TaxCalculationService } from './algorithms/fifoAlogorithm';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import * as NodeCache from 'node-cache';
import { createExcelFile } from './common/excelSheet';
import { createPDF } from './common/pdf';
import axios from 'axios';
import { UserplanService } from '../userPlan/userPlan.service';
const myCache = new NodeCache();

@Injectable()
export class DigitalSurgeRepository {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly userPlanService: UserplanService,
    private readonly taxCalculationService: TaxCalculationService,
  ) {}

  algos = {
    fifo: this.taxCalculationService.taxCalculator,
    lifo: this.taxCalculationService.taxCalculatorLifo,
  };

  async getTrades(userID, algorithm) {
    const trades = await this.transactionService.findAll(
      userID,
      'digitalsurge',
    );
    return trades;
  }

  async getTradesSync(keys, userID) {
    if (myCache.has(userID)) myCache.del(userID);
    myCache.set(userID, {
      exchange: 'digitalsurge',
      syncing: true,
      time: new Date(),
    });
    const account: any = await this.getAccount(keys);
    const [apiToken] = keys;
    const data = await axios.get(
      'https://secure.digitalsurge.com.au/api/private/trades/?page=2&page_size=5',
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );
    // const data = await axios.get(
    //   'https://secure.digitalsurge.com.au/api/private/orders/',
    //   {
    //     headers: {
    //       Authorization: `Bearer ${apiToken}`,
    //     },
    //   },
    // );
    const allTrades = data.data.results((trade) => ({
      amount: trade.bc_amount,
      cost: trade.qc_amount,
      side: trade.direction,
      datetime: new Date(trade.created),
      fee: trade.qc_fee,
      price: trade.price,
      exchange: 'digitalsurge',
      symbol: '/',
    }));

    const exchangeName = 'digitalsurge';
    // await this.transactionService.remove(userID, exchangeName, 'api');
    await this.transactionService.removeExchangeApiTransactions(
      userID,
      exchangeName,
    );
    const existingTransactions = await this.transactionService.findAll(
      userID,
      exchangeName,
    );
    // let alltrades = allTrades.flat();
    let alltrades = await this.taxCalculationService.taxCalculator(
      [...allTrades.flat(), ...existingTransactions],
      account.info.balances,
    );

    for (let i = 0; i < alltrades.length; i++) {
      this.transactionService.create(
        new CreateTransactionDto({
          ...alltrades[i],
          fifoRelatedTransactions: JSON.stringify(
            alltrades[i].fifoRelatedTransactions,
          ),
          lifoRelatedTransactions: JSON.stringify(
            alltrades[i].lifoRelatedTransactions,
          ),
          user: userID,
          source: alltrades[i].source ? alltrades[i].source : 'api',
        }),
      );
    }

    myCache.set(userID, {
      exchange: 'digitalsurge',
      syncing: false,
      time: new Date(),
    });

    return alltrades;
    // return await taxCalculator(alltrades);
  }

  async getSyncStatus(userID) {
    const value: any = myCache.get(userID);
    if (value === undefined) return { syncing: false, time: 'Not synced' };
    if (!value.syncing) {
      myCache.del(userID);
      return { syncing: false, time: value.time };
    }
    return { syncing: false, time: 'Not synced Yet' };
  }

  async getDeposits(keys) {
    const [apiKey, apiSecret] = keys;
    const exchange = exchangeConnection('binance', apiKey, apiSecret);

    const startTime = exchange.parse8601('2021-12-01T00:00:00');

    let deposits;
    if (exchange.has['fetchDeposits']) {
      deposits = await exchange.fetchDeposits(undefined, startTime, undefined, {
        endTime: Date.now(),
      });
    }
    return deposits;
  }

  async getWithdrawals(keys) {
    const [apiKey, apiSecret] = keys;
    const exchange = exchangeConnection('binance', apiKey, apiSecret);

    let Withdrawals;
    if (exchange.has['fetchWithdrawals']) {
      Withdrawals = await exchange.fetchWithdrawals();
    }

    return Withdrawals;
  }

  async getBinanceClaimedHistory(keys) {
    const [apiKey, apiSecret] = keys;
    const client = new Spot(apiKey, apiSecret);
    let rewards;
    try {
      rewards = await client.bswapClaimRewards();
    } catch (error) {
      console.log(error);
    }
    return rewards;
  }

  async getBinanceAssetDividend(keys) {
    const [apiKey, apiSecret] = keys;
    const client = new Spot(apiKey, apiSecret);
    let assetDividend;
    try {
      assetDividend = await client.assetDevidendRecord();
    } catch (error) {
      console.log(error);
    }
    return assetDividend.data;
  }

  async getBinanceTransactionsFile() {
    return data;
  }

  async getExcelFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'binance')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'binance',
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(userID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(financialYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[financialYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }
    return await createExcelFile(trades, filename, algorithm);
  }

  async getPDFFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'binance')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'binance',
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(userID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(financialYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[financialYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }
    return await createPDF(trades, filename, algorithm, financialYear);
  }
  async getExcelFileClient(
    accountantID: string,
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'binance')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'binance',
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(accountantID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(fiscalYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[fiscalYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }
    return await createExcelFile(trades, filename, algorithm);
  }

  async getPDFFileClient(
    accountantID: string,
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'binance')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'binance',
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for the exchange',
        HttpStatus.NOT_FOUND,
      );
    }
    const userPlans = await this.userPlanService.findByUserID(accountantID);

    if (userPlans.length > 0) {
      const userPlan = userPlans.filter((userPlan) =>
        userPlan.formula.hasOwnProperty(fiscalYear),
      );
      if (
        userPlan.length > 0 &&
        userPlan[0].type === 'personal' &&
        userPlan[0].formula[fiscalYear] < trades.length
      ) {
        throw new HttpException(
          'Cannot create report. As the bought package does not support this number of transactions',
          HttpStatus.CONFLICT,
        );
      }
      if (userPlan.length === 0) {
        throw new HttpException(
          'Cannot create report. As the bought package does not have this fiscal year.',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'Cannot create report. As you have not bought any package',
        HttpStatus.CONFLICT,
      );
    }
    return await createPDF(trades, filename, algorithm, financialYear);
  }

  async getAccount(keys) {
    const [apiToken] = keys;
    const account = await axios.get(
      'https://secure.digitalsurge.com.au/api/private/balances/',
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    );
    const balances: any = Object.keys(account.data.total).map((asset) => ({
      asset,
      free: account.data.total[asset],
      locked: 0,
    }));
    for (let i = 0; i < balances.length; i++) {
      if (balances[i].free > 0 || balances[i].locked > 0) {
        const coinId = getCoinId(balances[i].asset);
        if (coinId) {
          const date = new Date();
          const result = await coinGeckoRequest(
            coinId,
            '' +
              date.getDate() +
              '-' +
              (date.getMonth() + 1) +
              '-' +
              date.getFullYear(),
          );
          balances[i] = {
            ...balances[i],
            currentPrice: result.market_data.current_price.aud,
          };
        } else {
          balances[i] = {
            ...balances[i],
            currentPrice: 0,
          };
        }
      } else {
        balances[i] = {
          ...balances[i],
          currentPrice: 0,
        };
      }
    }
    return { info: { balances } };
  }

  async fetchOHLCV() {
    const apiKey =
      'XTKjygsPSf4v7m0AEh8OvgqYpaLeQOEWUEXIajm58yR8kg3qutXQUI0p27lQUujR';
    const apiSecret =
      'WQMbImKMopCCmoJrOyoKoC1GuYfJUgpxsejYR23XPRfyhHRBBs6jep0ehKEmpkZZ';
    const exchange = await exchangeConnection(
      'binance',
      apiKey,
      apiSecret,
      // 'vg5SkScrYLauKMrby75aIz7QuFWdaYgxdAJkQQxyQOYOdqmgabyYT7IO4wHxplfs',
      // '3lhod5lpKGZHFf1VkyGQiyN3Zdib54qywytNjzXrajWLHz2gHzd98OB9Dizqvomi',
    );
    const exchangeRates = {};
    const orders = closedOrders.flat();

    if (exchange.has['fetchOHLCV']) {
      exchangeRates['AUD/USDT'] = await exchange.fetchOHLCV('AUD/USDT', '1d');
      exchangeRates['AUD/USDT'] = exchangeRates['AUD/USDT'].map(
        (exchangeRate) => {
          exchangeRate[0] = new Date(exchangeRate[0]).toString().slice(0, 15);
          return exchangeRate;
        },
      );
      const rates = {};
      for (let i = 0; i < exchangeRates['AUD/USDT'].length; i++) {
        rates[exchangeRates['AUD/USDT'][i][0]] = exchangeRates['AUD/USDT'][i];
      }
      exchangeRates['AUD/USDT'] = rates;
    }
    for (let i = 0; i < orders.length; i++) {
      let coin1 = orders[i].symbol.split('/')[0];
      let coin2 = orders[i].symbol.split('/')[1];
      if (coin2 === 'AUD') {
        orders[i]['exchangeRate'] = orders[i].cost;
        orders[i]['fee'] = {
          exchangeRateCurrency: orders[i].price * orders[i].amount,
          currency: coin1,
          cost: 0,
        };
      } else {
        let fetchSymbol;
        if (exchange.has['fetchOHLCV']) {
          if (
            !exchangeRates.hasOwnProperty(
              coin2 === 'USDT' ? 'AUD/USDT' : orders[i].symbol,
            )
          ) {
            fetchSymbol = orders[i].symbol;
            exchangeRates[fetchSymbol] = await exchange.fetchOHLCV(
              coin2 + '/AUD',
              '1d',
            );
            exchangeRates[fetchSymbol] = exchangeRates[fetchSymbol].map(
              (exchangeRate) => {
                exchangeRate[0] = new Date(exchangeRate[0])
                  .toString()
                  .slice(0, 15);
                return exchangeRate;
              },
            );
            const rates = {};
            for (let i = 0; i < exchangeRates[fetchSymbol].length; i++) {
              rates[exchangeRates[fetchSymbol][i][0]] =
                exchangeRates[fetchSymbol][i];
            }
            exchangeRates[fetchSymbol] = rates;
          } else {
            fetchSymbol = coin2 === 'USDT' ? 'AUD/USDT' : orders[i].symbol;
          }
          let exchangeRate;
          try {
            exchangeRate =
              exchangeRates[fetchSymbol][
                new Date(orders[i].datetime).toString().slice(0, 15)
              ];
            orders[i]['exchangeRate'] = (exchangeRate[1] + exchangeRate[4]) / 2;
            orders[i]['fee'] = {
              exchangeRateCurrency:
                orders[i].symbol === 'AUD/USDT'
                  ? (1 / orders[i].price) * orders[i].amount
                  : (orders[i].price / orders[i]['exchangeRate']) *
                    orders[i].amount,
              currency: coin1,
              cost: 0,
            };
            orders[i]['exchangeRate'] =
              orders[i].cost / orders[i]['exchangeRate'];
          } catch (error) {
            // console.log(coin1, coin2)
          }
        }
      }
    }

    return orders;
  }
}
