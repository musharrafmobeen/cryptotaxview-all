import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as coinbase from 'coinbase';
import { promisify } from 'util';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { TaxCalculationService } from './algorithms/fifoAlogorithm';
import { coinGeckoRequest, getCoinId } from './common/coingeckoFunctions';
import * as NodeCache from 'node-cache';
import { createExcelFile } from './common/excelSheet';
import { createPDF } from './common/pdf';
import { events } from 'src/common/events/eventEmitter';
import { UserFilesService } from '../user-files/user-files.service';
import { UserplanService } from '../userPlan/userPlan.service';
const myCache = new NodeCache();

@Injectable()
export class CoinbaseRepository {
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
    const trades = await this.transactionService.findAll(userID, 'coinbase');
    return await this.algos[algorithm](trades);
  }

  async getTradesSync(keys, userID) {
    events.startEventEmit();
    if (myCache.has(userID)) myCache.del(userID);
    myCache.set(userID, {
      exchange: 'coinbase',
      syncing: true,
      time: new Date(),
    });
    const account = await this.getAccount(keys);
    const [apiKey, apiSecret] = keys;
    const client = new coinbase.Client({
      apiKey,
      apiSecret,
      strictSSL: false,
    });

    const getAccounts = promisify(client.getAccounts).bind(client);
    const accounts = await getAccounts({});
    const transactions = [];
    for (let i = 0; i < accounts.length; i++) {
      const getTransactions = promisify(accounts[i].getTransactions).bind(
        accounts[i],
      );
      const trx = await getTransactions({
        limit: 100,
      });
      transactions.push(trx);
    }

    const structuredTransactions = transactions.flat().map((transaction) => ({
      amount: Math.abs(parseFloat(transaction.amount.amount)),
      cost: Math.abs(parseFloat(transaction.native_amount.amount)),
      datetime: transaction.created_at,
      fee: {
        cost: transaction.network?.transaction_fee?.amount
          ? transaction.network.transaction_fee.amount
          : 0,
        currency: transaction.network?.transaction_fee?.currency
          ? transaction.network.transaction_fee.currency
          : transaction.amount.currency,
      },
      fees: {
        cost: transaction.network?.transaction_fee?.amount
          ? transaction.network.transaction_fee.amount
          : 0,
        currency: transaction.network?.transaction_fee?.currency
          ? transaction.network.transaction_fee.currency
          : transaction.amount.currency,
      },
      id: transaction.id,
      symbol:
        transaction.amount.currency + '/' + transaction.native_amount.currency,
      order: transaction.id,
      price:
        Math.abs(parseFloat(transaction.native_amount.amount)) /
        Math.abs(parseFloat(transaction.amount.amount)),
      side: transaction.type === 'send' ? 'sell' : transaction.type,
      timestamp: new Date(transaction.updated_at),
    }));

    // return await structuredTransactions;
    const exchange = 'coinbase';
    await this.transactionService.remove(userID, exchange, 'api');
    const existingTransactions = await this.transactionService.findAll(
      userID,
      exchange,
    );
    let alltrades = await this.taxCalculationService.taxCalculator(
      [...structuredTransactions.flat(), ...existingTransactions],
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
      exchange: 'coinbase',
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

  async getAccount(keys) {
    const [apiKey, apiSecret] = keys;
    const client = new coinbase.Client({
      apiKey,
      apiSecret,
      strictSSL: false,
    });

    const getAccounts = promisify(client.getAccounts).bind(client);
    const accounts = await getAccounts({});

    const allAccounts = {
      info: {
        balances: [],
      },
    };
    accounts.forEach((account) => {
      allAccounts.info.balances.push({
        asset: account.currency,
        free: account.balance.amount,
        locked: account.native_balance.amount,
      });
    });

    for (let i = 0; i < allAccounts.info.balances.length; i++) {
      if (
        allAccounts.info.balances[i].free > 0 ||
        allAccounts.info.balances[i].locked > 0
      ) {
        const coinId = getCoinId(allAccounts.info.balances[i].asset);
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
          allAccounts.info.balances[i] = {
            ...allAccounts.info.balances[i],
            currentPrice: result.market_data.current_price.aud,
          };
        } else {
          allAccounts.info.balances[i] = {
            ...allAccounts.info.balances[i],
            currentPrice: 0,
          };
        }
      } else {
        allAccounts.info.balances[i] = {
          ...allAccounts.info.balances[i],
          currentPrice: 0,
        };
      }
    }

    return allAccounts;
  }

  async getExcelFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'coinbase')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinbase',
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
        ? await this.transactionService.findAll(userID, 'coinbase')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinbase',
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
        ? await this.transactionService.findAll(userID, 'coinbase')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinbase',
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
        ? await this.transactionService.findAll(userID, 'coinbase')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'coinbase',
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

  async getDeposits(keys) {
    const [apiKey, apiSecret] = keys;
    const client = new coinbase.Client({
      apiKey,
      apiSecret,
      strictSSL: false,
    });

    const getAccounts = promisify(client.getAccounts).bind(client);
    const accounts = await getAccounts({});

    const deposits = [];
    for (let i = 0; i < accounts.length; i++) {
      const getDeposits = promisify(accounts[i].getDeposits).bind(accounts[i]);
      deposits.push(await getDeposits(null));
    }

    return deposits;
  }

  async getWithdrawals(keys) {
    const [apiKey, apiSecret] = keys;
    const client = new coinbase.Client({
      apiKey,
      apiSecret,
      strictSSL: false,
    });

    const getAccounts = promisify(client.getAccounts).bind(client);
    const accounts = await getAccounts({});

    const widthdrawals = [];
    for (let i = 0; i < accounts.length; i++) {
      const getWithdrawals = promisify(accounts[i].getWithdrawals).bind(
        accounts[i],
      );
      widthdrawals.push(await getWithdrawals(null));
    }

    return widthdrawals;
  }
}
