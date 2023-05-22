import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as n from 'nonce';
import * as crypto from 'crypto';
import { coinGeckoRequest, getCoinId } from './common/coingeckoFunctions';
import { TaxCalculationService } from './algorithms/fifoAlogorithm';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import * as NodeCache from 'node-cache';
import { createExcelFile } from './common/excelSheet';
import { createPDF } from './common/pdf';
import { events } from 'src/common/events/eventEmitter';
import { UserFilesService } from '../user-files/user-files.service';
import { UserplanService } from '../userPlan/userPlan.service';
const myCache = new NodeCache();

@Injectable()
export class CoinspotRepository {
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
    const trades = await this.transactionService.findAll(userID, 'coinspot');
    return await this.algos[algorithm](trades);
  }

  async getTradesSync(keys, userID) {
    events.startEventEmit();
    myCache.set(userID, { exchange: 'coinspot' });
    const account = await this.getAccount(keys);
    const [apiKey, apiSecret] = keys;
    const nonce = n()();
    const postdata = { nonce };

    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const trades = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/ro/my/transactions',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });

      let allTrades = trades.data.buyorders.map((order) => ({
        amount: order.amount,
        cost: order.audtotal,
        datetime: order.created,
        fee: {
          cost: order.audGst,
          currency: order.market.split('/')[1],
        },
        side: 'buy',
        symbol: order.market,
        price: order.audtotal / order.amount,
        priceInAUD: order.audtotal / order.amount,
        timestamp: new Date(order.created).getTime(),
      }));

      trades.data.sellorders.forEach((order) => {
        allTrades.push({
          amount: order.amount,
          cost: order.total,
          datetime: order.created,
          fee: {
            cost: order.audGst,
            currency: order.market.split('/')[1],
          },
          side: 'sell',
          symbol: order.market,
          price: order.amount / order.audtotal,
          priceInAud: order.audtotal / order.amount,
          timestamp: new Date(order.created).getTime(),
        });
      });

      allTrades = allTrades.sort((a, b) => a.timestamp - b.timestamp);

      const exchange = 'coinspot';
      await this.transactionService.removeExchangeApiTransactions(
        userID,
        exchange,
      );
      const existingTransactions = await this.transactionService.findAll(
        userID,
        exchange,
      );

      let alltrades = await this.taxCalculationService.taxCalculator(
        [...allTrades.flat(), ...existingTransactions],
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
            exchange,
            source: alltrades[i].source ? alltrades[i].source : 'api',
          }),
        );
      }
      myCache.set(userID, {
        exchange: 'binance',
        syncing: false,
        time: new Date(),
      });
      events.eventEmit();
      return alltrades;

      // return await this.algos[algorithm](allTrades);
    } catch (err) {
      // console.log(err);
    }
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
  async getOrders() {
    const nonce = n()();
    const postdata = { nonce };
    const apiKey = '860731c798dd793a34fab7a98635dfd6';
    const apiSecret =
      'AMR72YG8FDGXMU88MNJPQ3HNM98Y6GWMHH3JXF7Y2AMH59Z08E8U1K8B4E9DCEUFMNFQNRL3DRB0M2EA';
    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const orders = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/v2/ro/my/orders/completed',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });
      let allOrders = orders.data.buyorders.map((order) => ({
        amount: order.amount,
        cost: order.audtotal,
        datetime: order.solddate,
        fee: {
          cost: order.audGst,
          currency: order.market.split('/')[1],
        },
        side: 'buy',
        status: 'closed',
        symbol: order.market,
        price: order.amount / order.audtotal,
        timestamp: new Date(order.solddate).getTime(),
      }));

      orders.data.sellorders.forEach((order) => {
        allOrders.push({
          amount: order.amount,
          cost: order.audtotal,
          datetime: order.solddate,
          fee: {
            cost: order.audGst,
            currency: order.market.split('/')[1],
          },
          status: 'closed',
          side: 'sell',
          symbol: order.market,
          price: order.amount / order.audtotal,
          timestamp: new Date(order.solddate).getTime(),
        });
      });
      allOrders = allOrders.sort((a, b) => a.timestamp - b.timestamp);
      return allOrders;
    } catch (err) {
      console.log(err);
    }
  }

  async getExcelFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'coinspot')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinspot',
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
        ? await this.transactionService.findAll(userID, 'coinspot')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinspot',
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for The exchange',
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
        ? await this.transactionService.findAll(userID, 'coinspot')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinspot',
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
        ? await this.transactionService.findAll(userID, 'coinspot')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinspot',
            financialYear,
          );
    if (trades.length < 1) {
      throw new HttpException(
        'No transaction found for The exchange',
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

  async getDeposits() {
    const nonce = n()();
    const postdata = { nonce };
    const apiKey = '860731c798dd793a34fab7a98635dfd6';
    const apiSecret =
      'AMR72YG8FDGXMU88MNJPQ3HNM98Y6GWMHH3JXF7Y2AMH59Z08E8U1K8B4E9DCEUFMNFQNRL3DRB0M2EA';
    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const deposits = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/v2/ro/my/deposits',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });

      const newDepositsData = deposits.data.deposits.map((obj) => ({
        ...obj,
        timestamp: new Date(obj.created).getTime(),
      }));

      return { ...deposits.data, deposits: newDepositsData };
    } catch (err) {
      console.log(err);
    }
  }

  async getWithdrawals() {
    const nonce = n()();
    const postdata = { nonce };
    const apiKey = '860731c798dd793a34fab7a98635dfd6';
    const apiSecret =
      'AMR72YG8FDGXMU88MNJPQ3HNM98Y6GWMHH3JXF7Y2AMH59Z08E8U1K8B4E9DCEUFMNFQNRL3DRB0M2EA';
    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const widthdrawals = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/v2/ro/my/withdrawals',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });
      return widthdrawals.data;
    } catch (err) {
      console.log(err);
    }
  }

  async getAccount(keys) {
    const [apiKey, apiSecret] = keys;
    const nonce = n()();
    const postdata = { nonce };
    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const balances = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/v2/ro/my/balances',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });
      const wallet = { info: { balances: [] } };
      balances.data.balances.forEach((balance) => {
        const currency = Object.keys(balance)[0];
        wallet.info.balances.push({
          asset: currency,
          free: balance[currency].balance,
          locked: 0,
        });
      });
      for (let i = 0; i < wallet.info.balances.length; i++) {
        if (
          wallet.info.balances[i].free > 0 ||
          wallet.info.balances[i].locked > 0
        ) {
          const coinId = getCoinId(wallet.info.balances[i].asset);
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
            wallet.info.balances[i] = {
              ...wallet.info.balances[i],
              currentPrice: result.market_data.current_price.aud,
            };
          } else {
            wallet.info.balances[i] = {
              ...wallet.info.balances[i],
              currentPrice: 0,
            };
          }
        } else {
          wallet.info.balances[i] = {
            ...wallet.info.balances[i],
            currentPrice: 0,
          };
        }
      }
      return wallet;
    } catch (err) {
      console.log(err);
    }
  }

  async getCoinSpotAffiliatePayment() {
    const nonce = n()();
    const postdata = { nonce };
    const apiKey = '860731c798dd793a34fab7a98635dfd6';
    const apiSecret =
      'AMR72YG8FDGXMU88MNJPQ3HNM98Y6GWMHH3JXF7Y2AMH59Z08E8U1K8B4E9DCEUFMNFQNRL3DRB0M2EA';
    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const affiliatePayment = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/v2/ro/my/affiliatepayments',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });

      return affiliatePayment.data;

      // const wallet = { info: { balances: [] } };
      // balances.data.balances.forEach((balance) => {
      //   const currency = Object.keys(balance)[0];
      //   wallet.info.balances.push({
      //     asset: currency,
      //     free: balance[currency].balance,
      //     locked: 0,
      //   });
      // });
      // return wallet;
    } catch (err) {
      console.log(err);
    }
  }

  async getCoinSpotSendReceive() {
    const nonce = n()();
    const postdata = { nonce };
    const apiKey = '860731c798dd793a34fab7a98635dfd6';
    const apiSecret =
      'AMR72YG8FDGXMU88MNJPQ3HNM98Y6GWMHH3JXF7Y2AMH59Z08E8U1K8B4E9DCEUFMNFQNRL3DRB0M2EA';
    const sign = getSecurePassword(
      apiSecret,
      JSON.stringify(postdata),
      'SHA-512',
    );
    try {
      const sendReceive = await axios({
        baseURL: 'https://www.coinspot.com.au',
        url: '/api/v2/ro/my/sendreceive',
        method: 'post',
        data: postdata,
        headers: { key: apiKey, sign: sign },
      });

      return sendReceive.data;

      // const wallet = { info: { balances: [] } };
      // balances.data.balances.forEach((balance) => {
      //   const currency = Object.keys(balance)[0];
      //   wallet.info.balances.push({
      //     asset: currency,
      //     free: balance[currency].balance,
      //     locked: 0,
      //   });
      // });
      // return wallet;
    } catch (err) {
      console.log(err);
    }
  }
}

function getSecurePassword(password, salt, algo) {
  const algoFormatted = algo.toLowerCase().replace('-', '');
  const hash = crypto.createHmac(algoFormatted, password);
  const res = hash.update(salt).digest('hex');
  // const res = hash.digest('hex');
  return res;
}
