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
export class BitcoinRepository {
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
    const trades = await this.transactionService.findAll(userID, 'bitcoin');
    return await this.algos[algorithm](trades);
  }

  async getTradesSync(keys, userID) {
    const [key] = keys;
    try {
      const trades = await axios.get(`https://blockchain.info/rawaddr/${key}`);
      const account = await this.getAccount(keys);
      const transactions = [];

      for (let i = 0; i < trades.data.txs.length; i++) {
        const result = parseFloat(trades.data.txs[i].result) / 100000000;
        const fee = parseFloat(trades.data.txs[i].fee) / 100000000;
        const time = parseInt(trades.data.txs[i].time) * 1000;
        if (result < 0) {
          transactions.push({
            amount: Math.abs(result),
            cost: Math.abs(result),
            datetime: new Date(time),
            fee: {
              cost: fee,
              currency: 'BTC',
            },
            side: 'send',
            symbol: 'BTC',
            price: 0,
            timestamp: new Date(time).getTime(),
          });
        } else {
          transactions.push({
            amount: result,
            cost: result,
            datetime: new Date(time),
            fee: {
              cost: fee,
              currency: 'BTC',
            },
            side: 'receive',
            symbol: 'BTC',
            price: 0,
            timestamp: new Date(time).getTime(),
          });
        }
      }

      const exchange = 'bitcoin';
      // await this.transactionService.remove(userID, exchange, 'api');
      await this.transactionService.removeExchangeApiTransactions(
        userID,
        exchange,
      );
      const existingTransactions = await this.transactionService.findAll(
        userID,
        exchange,
      );
      let alltrades = await this.taxCalculationService.taxCalculator(
        [...transactions, ...existingTransactions],
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

      return alltrades;
    } catch (e) {
      console.log(e);
    }
  }

  async getAccount(keys) {
    const [key] = keys;
    const trades = await axios.get(
      `https://blockchain.info/balance?active=${key}`,
    );
    const wallet = {
      info: {
        balances: [
          {
            asset: 'BTC',
            free: parseFloat(trades.data[key].final_balance) / 100000000,
            locked: 0,
            currentPrice: 0,
          },
        ],
      },
    };

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
  }
  catch(err) {
    console.log(err);
  }

  async getExcelFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'bitcoin')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'bitcoin',
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
        ? await this.transactionService.findAll(userID, 'bitcoin')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'bitcoin',
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
        ? await this.transactionService.findAll(userID, 'bitcoin')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'bitcoin',
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
        ? await this.transactionService.findAll(userID, 'bitcoin')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'bitcoin',
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
}
