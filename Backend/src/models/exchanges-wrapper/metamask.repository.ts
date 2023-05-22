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
export class MetamaskRepository {
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
    const trades = await this.transactionService.findAll(userID, 'metamask');
    return await this.algos[algorithm](trades);
  }

  async getTradesSync(keys, userID) {
    const [key] = keys;
    try {
      const trades = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${key}&startblock=0&endblock=99999999&page=1&offset=100&sort=asc&apikey=KHM61FRBSBJB48Y64F98ZSMI5JMPI7JPY7`,
      );
      const account = await this.getAccount(keys);
      const transactions = [];

      trades.data.result.forEach((trade) => {
        const side = trade.from === key.toLowerCase() ? 'send' : 'deposit';
        const symbol =
          trade.from === key.toLowerCase()
            ? `ETH/${trade.to}`
            : `ETH/${trade.from}`;
        transactions.push({
          amount: parseFloat(trade.value) / 100000000000000000,
          cost: 0,
          datetime: new Date(parseInt(trade.timeStamp) * 1000),
          fee: {
            cost: parseFloat(trade.gasPrice) / 100000000000000000,
            currency: 'ETH',
          },
          side: side,
          symbol: 'ETH/Wallet',
          price: 0,
          timestamp: parseInt(trade.timeStamp) * 1000,
        });
      });

      const exchange = 'metamask';
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
      `https://api.etherscan.io/api?module=account&action=balance&address=${key}&tag=latest&apikey=KHM61FRBSBJB48Y64F98ZSMI5JMPI7JPY7`,
    );
    const wallet = {
      info: {
        balances: [
          {
            asset: 'ETH',
            free: parseInt(trades.data.result) / 100000000000000000,
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
        ? await this.transactionService.findAll(userID, 'metamask')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'metamask',
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
        ? await this.transactionService.findAll(userID, 'metamask')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'metamask',
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
        ? await this.transactionService.findAll(userID, 'metamask')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'metamask',
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
        ? await this.transactionService.findAll(userID, 'metamask')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'metamask',
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
