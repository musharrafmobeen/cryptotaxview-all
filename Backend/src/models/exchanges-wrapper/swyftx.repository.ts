import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { assets } from './assets';
import * as ExcelJS from 'exceljs';
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
export class SwyftxRepository {
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
    const trades = await this.transactionService.findAll(userID, 'swyftx');
    return await this.algos[algorithm](trades);
  }
  async getTradesSync(keys, userID) {
    console.log(keys);
    events.startEventEmit();
    if (myCache.has(userID)) myCache.del(userID);
    myCache.set(userID, {
      exchange: 'swyftx',
      syncing: true,
      time: new Date(),
    });
    const account = await this.getAccount(keys);
    const [api_key, key] = keys;

    const data = await axios.get(
      'https://api.swyftx.com.au/history/all/type/assetId/?limit=10000',
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      },
    );

    const stackings = await this.getStackingsHistory(keys);

    // console.log(stacking);

    const allData = [...data.data, ...stackings];

    const datas = [];
    const data2 = {};
    allData.forEach((obj) => {
      let symbol = '';
      let symbol2 = '';
      if (obj.actionType === 'Market Sell') {
        symbol = assets[obj.asset].code + assets[obj.primaryAsset].code;
        symbol2 = assets[obj.asset].code + '/' + assets[obj.primaryAsset].code;
      } else if (obj.actionType === 'Market Buy') {
        symbol = assets[obj.asset].code + assets[obj.primaryAsset].code;
        symbol2 = assets[obj.asset].code + '/' + assets[obj.primaryAsset].code;
      } else symbol = assets[obj.asset].code;
      const objt = {
        info: {
          symbol,
        },
        symbol: symbol2 === '' ? symbol : symbol2,
        price:
          obj.quantity === null ? 0 : obj.quantity / parseFloat(obj.amount),
        amount: obj.amount === null ? 0 : parseFloat(obj.amount),
        datetime: new Date(obj.updated),
        timestamp: new Date(obj.updated).getTime(),
        cost: obj.quantity === null ? 0 : obj.quantity,
        side: obj.actionType.includes(' ')
          ? obj.actionType.split(' ')[1].toLowerCase()
          : obj.actionType.toLowerCase(),
        fee: {
          cost: 0,
          currency: 'NA',
        },
      };
      if (data2[objt.info.symbol]) data2[objt.info.symbol].push(objt);
      else data2[objt.info.symbol] = [objt];
    });
    Object.keys(data2).forEach((arr) => {
      datas.push(data2[arr]);
    });

    const allTrades = datas.flat().sort((a, b) => a.timestamp - b.timestamp);
    const exchange = 'swyftx';
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
      [...allTrades.flat(), ...existingTransactions],
      account.info.balances,
    );
    for (let i = 0; i < alltrades.length; i++) {
      await this.transactionService.create(
        new CreateTransactionDto({
          ...alltrades[i],
          currentBoughtCoinBalance: parseFloat(
            alltrades[i].currentBoughtCoinBalance,
          ),
          currentSoldCoinBalance: parseFloat(
            alltrades[i].currentSoldCoinBalance,
          ),
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
      exchange: 'swyftx',
      syncing: false,
      time: new Date(),
    });
    events.eventEmit();
    return alltrades;

    // return await this.algos[algorithm](
    //   datas.flat().sort((a, b) => a.timestamp - b.timestamp),
    // );
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

  async getSwyftxTransactionsExcelFile(keys) {
    const [api_key, key] = keys;
    const data = await axios.get('https://api.swyftx.com.au/orders/', {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    const datas = [];
    const data2 = {};
    data.data.orders.forEach((obj) => {
      let symbol = '';
      if (obj.order_type === 2)
        symbol =
          assets[obj.secondary_asset].code + assets[obj.primary_asset].code;
      else if (obj.order_type === 1)
        symbol =
          assets[obj.primary_asset].code + assets[obj.secondary_asset].code;

      const objt = {
        id: obj.orderUuid,
        info: {
          symbol,
        },
        symbol,
        price: parseFloat(obj.rate),
        amount: obj.amount,
        datetime: new Date(obj.updated_time),
        time: new Date(obj.created_time),
        cost: obj.total,
        status: obj.status === 1 ? 'CLOSED' : 'FILLED',
        side: obj.order_type === 1 ? 'BUY' : 'SELL',
        type:
          obj.order_type >= 1 && obj.order_type <= 2
            ? 'MARKET'
            : obj.order_type >= 3 && obj.order_type <= 4
            ? 'limit'
            : obj.order_type >= 5 && obj.order_type <= 6
            ? 'STOP'
            : 'DUST',
        fee: {
          cost: 0,
        },
      };
      if (data2[objt.info.symbol]) data2[objt.info.symbol].push(objt);
      else data2[objt.info.symbol] = [objt];
    });
    Object.keys(data2).forEach((arr) => {
      datas.push(data2[arr]);
    });
    const excelData = datas;
    // excelData = excelData.sort((a, b) => b.timestamp - a.timestamp);
    // write to a file

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Orders');

    sheet.columns = [
      { header: 'Date(UTC)', key: 'datetime' },
      { header: 'OrderNo', key: 'orderNo' },
      { header: 'Pair', key: 'pair' },
      { header: 'Type', key: 'type' },
      { header: 'Side', key: 'side' },
      { header: 'Order Price', key: 'orderPrice' },
      { header: 'Order Amount', key: 'orderAmount' },
      { header: 'Time', key: 'time' },
      { header: 'Executed', key: 'executed' },
      { header: 'Average Price', key: 'averagePrice' },
      { header: 'Trading total', key: 'tradingTotal' },
      { header: 'Status', key: 'status' },
    ];

    const rows = excelData.flat().map((obj) => ({
      datetime: obj.time,
      orderNo: obj.id,
      pair: obj.symbol,
      type: obj.type,
      side: obj.side,
      orderPrice: obj.price,
      orderAmount: obj.amount,
      time: new Date(obj.datetime),
      executed: obj.amount,
      averagePrice: obj.price,
      tradingTotal: obj.cost,
      status: obj.status,
    }));

    sheet.addRows(rows);

    await workbook.xlsx.writeFile('sywftx_export.xlsx');

    return 'sywftx_export.xlsx';
  }

  async getExcelFile(
    userID: string,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'swyftx')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'swyftx',
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
    financialYear,
  ) {
    const trades =
      financialYear === ''
        ? await this.transactionService.findAll(userID, 'swyftx')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'swyftx',
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
        ? await this.transactionService.findAll(userID, 'swyftx')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'swyftx',
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
        ? await this.transactionService.findAll(userID, 'swyftx')
        : await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            'swyftx',
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
    const [api_key, key] = keys;
    const data = await axios.get('https://api.swyftx.com.au/user/balance/', {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    const balances = data.data.map((obj) => ({
      asset: assets[obj.assetId].code,
      free: obj.availableBalance,
      locked: obj.stakingBalance,
    }));
    for (let i = 0; i < balances.length; i++) {
      if (balances[i].free > 0 || balances[i].locked > 0) {
        const coinId = getCoinId(balances[i].asset);
        if (coinId) {
          try {
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
          } catch (e) {
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
      } else {
        balances[i] = {
          ...balances[i],
          currentPrice: 0,
        };
      }
    }
    return { info: { balances } };
  }

  async getStackingsHistory(keys) {
    const [api_key, key] = keys;
    const data = await axios.get(
      'https://api.swyftx.com.au/staking/history/?assets=&limit=1000',
      {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      },
    );

    const result = data.data.map((obj) => ({
      asset: obj.assetId.toString(),
      updated: obj.timestamp,
      quantity: obj.amount ? obj.amount : 0,
      actionType: obj.type.toLowerCase(),
      amount: obj.amount ? obj.amount : 0,
    }));
    return result;
  }

  async getStackingInfo(keys) {
    const [api_key, key] = keys;
    const data = await axios.get('https://api.swyftx.com.au/staking/info', {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    return data.data;
  }

  async getStackingHistory(keys) {
    const [api_key, key] = keys;
    const data = await axios.get('https://api.swyftx.com.au/staking/history/', {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });
    return data.data;
  }
}
