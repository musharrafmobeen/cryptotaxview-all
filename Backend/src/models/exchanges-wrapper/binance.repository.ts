import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { exchangeConnection } from '../../common/ccxt/connection.providers';
import { data } from './data';
import { closedOrders } from './closedOrders';
import { Spot } from '@binance/connector';
import { coinGeckoRequest, getCoinId } from './common/coingeckoFunctions';
import { TaxCalculationService } from './algorithms/fifoAlogorithm';
import { TransactionsService } from '../transactions/transactions.service';
// import { trades } from './binance-trades';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import * as NodeCache from 'node-cache';
import { createExcelFile } from './common/excelSheet';
import { createPDF } from './common/pdf';
import { events } from 'src/common/events/eventEmitter';
import { UserFilesService } from '../user-files/user-files.service';
import { UserplanService } from '../userPlan/userPlan.service';
const myCache = new NodeCache();

@Injectable()
export class BinanceRepository {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly userFileService: UserFilesService,
    private readonly userPlanService: UserplanService,
    private readonly taxCalculationService: TaxCalculationService,
  ) {}

  algos = {
    fifo: this.taxCalculationService.taxCalculator,
    lifo: this.taxCalculationService.taxCalculatorLifo,
  };

  async getTrades(userID, algorithm) {
    const trades = await this.transactionService.findAll(userID, 'binance');
    return await this.algos[algorithm](trades);
  }

  async getTradesSync(keys, userID) {
    events.startEventEmit();

    if (myCache.has(userID)) myCache.del(userID);
    myCache.set(userID, {
      exchange: 'binance',
      syncing: true,
      time: new Date(),
    });
    const account = await this.getAccount(keys);
    const [apiKey, apiSecret] = keys;
    const exchange = exchangeConnection('binance', apiKey, apiSecret);
    const since = exchange.parse8601('2008-01-01T00:00:00Z');
    const limit = 10000;
    let transactions;
    const trades = [];
    if (exchange.has['fetchDeposits']) {
      transactions = await exchange.load_markets();
      transactions = Object.keys(transactions).map(
        (key) => transactions[key]['info']['symbol'],
      );
      const time = Date.now();
      // transactions.length;
      for (let i = 0; i < transactions.length; i++) {
        try {
          if (i % 20 === 0) {
            for (let i = 0; i < 1000000000; i++) {}
            const trd = await exchange.fetchMyTrades(
              transactions[i],
              since,
              limit,
            );
            if (trd.length > 0) {
              trades.push(trd);
            }
          } else {
            const trd = await exchange.fetchMyTrades(
              transactions[i],
              since,
              limit,
            );

            if (trd.length > 0) {
              trades.push(trd);
            }
          }
        } catch (e) {
          console.log(i);
        }
      }
      // assets = transactions['info']['balances'].map((asset) => asset.asset);
    } else {
      throw new Error(exchange.id + ' does not have the fetchTrades method');
    }
    const exchangeName = 'binance';
    // await this.transactionService.remove(userID, exchangeName, 'api');
    await this.transactionService.removeExchangeApiTransactions(
      userID,
      exchange,
    );
    const existingTransactions = await this.transactionService.findAll(
      userID,
      exchangeName,
    );
    let alltrades = await this.taxCalculationService.taxCalculator(
      [...trades.flat(), ...existingTransactions],
      account.info.balances,
    );
    for (let i = 0; i < alltrades.length; i++) {
      await this.transactionService.create(
        new CreateTransactionDto({
          ...alltrades[i],
          fifoRelatedTransactions: JSON.stringify(
            alltrades[i].fifoRelatedTransactions,
          ),
          lifoRelatedTransactions: JSON.stringify(
            alltrades[i].lifoRelatedTransactions,
          ),
          user: userID,
          exchange: exchangeName,
          source: alltrades[i].source ? alltrades[i].source : 'api',
        }),
      );
    }

    // const event = new Event('data synced');

    myCache.set(userID, {
      exchange: 'binance',
      syncing: false,
      time: new Date(),
    });

    events.eventEmit();

    return alltrades;
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
      // console.log(error);
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
      // console.log(error);
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
    const [apiKey, apiSecret] = keys;
    const exchange = exchangeConnection('binance', apiKey, apiSecret);
    let account;
    if (exchange.has['fetchDeposits']) {
      account = await exchange.fetchBalance();
      const client = new Spot(apiKey, apiSecret);
      const accountSnapShot = await client.accountSnapshot('MARGIN');
      accountSnapShot.data['snapshotVos'][0]['data']['userAssets'].forEach(
        (asset) => account.info.balances.push(asset),
      );

      for (let i = 0; i < account.info.balances.length; i++) {
        if (
          account.info.balances[i].free > 0 ||
          account.info.balances[i].locked > 0
        ) {
          const coinId = getCoinId(account.info.balances[i].asset);
          if (coinId) {
            const date = new Date();
            const result = await coinGeckoRequest(
              coinId,
              '' +
                (date.getDay() + 1) +
                '-' +
                (date.getMonth() + 1) +
                '-' +
                date.getFullYear(),
            );
            account.info.balances[i] = {
              ...account.info.balances[i],
              currentPrice: result.market_data.current_price.aud,
            };
          } else {
            account.info.balances[i] = {
              ...account.info.balances[i],
              currentPrice: 0,
            };
          }
        } else {
          account.info.balances[i] = {
            ...account.info.balances[i],
            currentPrice: 0,
          };
        }
      }
    } else {
      throw new Error(exchange.id + ' does not have the fetchTrades method');
    }
    return account;
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
