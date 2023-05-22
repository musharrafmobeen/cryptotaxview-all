import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { string, any, number } from 'joi';
import { async } from 'rxjs';
import { isDate } from 'util/types';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateUserFileDto } from '../user-files/dto/create-user-file.dto';
import { UserFilesService } from '../user-files/user-files.service';
import { newCoinIds } from './algorithms/coingeckoCoinIds';
import { calculateHoldings, calculateInvestments } from './algorithms/holdings';
import { AllExchangesRepository } from './allExchanges.respository';
import { BinanceRepository } from './binance.repository';
import { BitcoinRepository } from './bitcoin.reprository';
import { CoinbaseRepository } from './coinbase.repository';
import { CoinspotRepository } from './coinspot.repository';
import { getCoinId, coinGeckoRequest } from './common/coingeckoFunctions';
import {
  createExcelFileInvestment,
  createExcelFileTransactions,
} from './common/excelSheet';
import { createPDFInvestment, createPDFTransactions } from './common/pdf';
import { DigitalSurgeRepository } from './digital-surge.repository';
import { MetamaskRepository } from './metamask.repository';
import { SwyftxRepository } from './swyftx.repository';

@Injectable()
export class ExchangesWrapperService {
  constructor(
    private readonly binanceRepository: BinanceRepository,
    private readonly swyftxRepository: SwyftxRepository,
    private readonly digitalSurgeRepository: DigitalSurgeRepository,
    private readonly coinpsotRepository: CoinspotRepository,
    private readonly coinbaseRepository: CoinbaseRepository,
    private readonly userFileService: UserFilesService,
    private readonly exchangePairService: ExchangePairsService,
    private readonly metamaskRepository: MetamaskRepository,
    private readonly bitcoinRepository: BitcoinRepository,
    private readonly allExchangesRepository: AllExchangesRepository,
    private readonly transactionService: TransactionsService,
  ) {}

  exchanges = {
    binance: this.binanceRepository,
    coinspot: this.coinpsotRepository,
    swyftx: this.swyftxRepository,
    coinbase: this.coinbaseRepository,
    metamask: this.metamaskRepository,
    bitcoin: this.bitcoinRepository,
    all: this.allExchangesRepository,
    digitalsurge: this.digitalSurgeRepository,
  };

  async getTradesSync(exchange: string, keys: Object, userID: any) {
    try {
      let trades = await this.exchanges[exchange].getTradesSync(keys, userID);
      if (trades === undefined) {
        trades = [];
      }
      await this.exchangePairService.update(userID, new Date().getTime());
      return trades.sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
      );
    } catch (e) {
      throw new HttpException('UnAuthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async getSyncStatus(exchange: string, userID: string) {
    const status = await this.exchanges[exchange].getSyncStatus(userID);
    if (status.syncing === false && isDate(new Date(status.time))) {
      await this.exchangePairService.update(
        userID,
        new Date(status.time).getTime(),
      );
    }
    return status;
  }

  async getTrades(exchange: string, userID: any, algorithm: string) {
    const trades = await this.exchanges[exchange].getTrades(userID, algorithm);
    return trades.sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
    );
  }

  async getDeposits(exchange: string, keys: Object) {
    return await this.exchanges[exchange].getDeposits(keys);
  }

  async getWithdrawals(exchange: string, keys: Object) {
    return await this.exchanges[exchange].getWithdrawals(keys);
  }

  async getAccount(exchange: string, keys: Object) {
    return await this.exchanges[exchange].getAccount(keys);
  }

  async getHoldings(userID: string, exchange: string) {
    const trades = await this.exchanges[exchange].getTrades(userID, 'fifo');
    return await calculateHoldings(trades);
  }

  async getExcelSheet(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    fiscalYear: string = '',
  ) {
    const fileName = await this.exchanges[exchange].getExcelFile(
      userID,
      algorithm,
      filename,
      fiscalYear,
    );
    let userFile = new CreateUserFileDto({
      user: userID,
      exchange,
      fileName,
      createdAt: new Date(),
      type: true,
      originalFileName: fileName,
    });
    this.userFileService.createReport(userFile, userID);
    return fileName;
  }

  async getExcelSheetTransactions(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    fiscalYear: string = '',
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        const trades =
          await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            allExchanges[i],
            fiscalYear,
          );
        allTrades = [...allTrades, ...trades];
      }

      const fileName = await createExcelFileTransactions(
        allTrades,
        filename,
        algorithm,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades =
        await this.transactionService.getTransactionsDataByFiscalYear(
          userID,
          exchange,
          fiscalYear,
        );
      const fileName = await createExcelFileTransactions(
        trades,
        filename,
        algorithm,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }

  async getExcelSheetHoldings(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    fiscalYear: string = '',
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        const trades = await this.exchanges[allExchanges[i]].getTrades(
          userID,
          'fifo',
        );
        allTrades = [...allTrades, ...trades];
      }
      const holdings = await calculateInvestments(allTrades, fiscalYear);

      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        fiscalYear,
      );

      const fileName = await createExcelFileInvestment(
        holdingsExcelData,
        filename,
        algorithm,
      );

      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);

      return fileName;
    } else {
      const trades = await this.exchanges[exchange].getTrades(userID, 'fifo');
      const holdings = await calculateInvestments(trades, fiscalYear);

      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        fiscalYear,
      );
      const fileName = await createExcelFileInvestment(
        holdingsExcelData,
        filename,
        algorithm,
      );

      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);

      return fileName;
    }
  }

  async getExcelSheetClient(
    accountantID: string,
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string = '',
  ) {
    const fileName = await this.exchanges[exchange].getExcelFileClient(
      accountantID,
      userID,
      algorithm,
      filename,
      financialYear,
      fiscalYear,
    );
    let userFile = new CreateUserFileDto({
      user: userID,
      exchange,
      fileName,
      createdAt: new Date(),
      type: true,
      originalFileName: fileName,
    });
    this.userFileService.createReport(userFile, userID);
    return fileName;
  }

  async getExcelSheetClientTransactions(
    accountantID: string,
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string = '',
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        const trades =
          await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            allExchanges[i],
            financialYear,
          );
        allTrades = [...allTrades, ...trades];
      }

      const fileName = await createExcelFileTransactions(
        allTrades,
        filename,
        algorithm,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades =
        await this.transactionService.getTransactionsDataByFiscalYear(
          userID,
          exchange,
          financialYear,
        );
      const fileName = await createExcelFileTransactions(
        trades,
        filename,
        algorithm,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }

  async getExcelSheetClientHoldings(
    accountantID: string,
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string = '',
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        if (allExchanges[i] === 'all') continue;
        const trades = await this.exchanges[allExchanges[i]].getTrades(
          userID,
          'fifo',
        );

        allTrades = [...allTrades, ...trades];
      }

      const holdings = await calculateInvestments(allTrades, financialYear);
      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        financialYear,
      );
      const fileName = await createExcelFileInvestment(
        holdingsExcelData,
        filename,
        algorithm,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades = await this.exchanges[exchange].getTrades(userID, 'fifo');
      const holdings = await calculateInvestments(trades, financialYear);
      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        financialYear,
      );

      const fileName = await createExcelFileInvestment(
        holdingsExcelData,
        filename,
        algorithm,
      );

      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }

  async getAssetDividend(keys: Object) {
    return await this.exchanges['binance'].getBinanceAssetDividend(keys);
  }

  async getStackingHistory(keys: Object) {
    return await this.exchanges['swyftx'].getStackingsHistory(keys);
  }
  coinNotFound = (symbol) => {
    return newCoinIds.filter((obj) => obj.symbol === symbol.toLowerCase())[0]
      ? newCoinIds.filter((obj) => obj.symbol === symbol.toLowerCase())[0].id
      : undefined;
  };
  async getPDF(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    const fileName = await this.exchanges[exchange].getPDFFile(
      userID,
      algorithm,
      filename,
      financialYear,
    );
    let userFile = new CreateUserFileDto({
      user: userID,
      exchange,
      fileName,
      createdAt: new Date(),
      type: true,
      originalFileName: fileName,
    });
    await this.userFileService.createReport(userFile, userID);
    return fileName;
  }
  async getPDFTransactions(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        const trades =
          await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            allExchanges[i],
            financialYear,
          );
        allTrades = [...allTrades, ...trades];
      }
      const fileName = await createPDFTransactions(
        allTrades,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades =
        await this.transactionService.getTransactionsDataByFiscalYear(
          userID,
          exchange,
          financialYear,
        );
      const fileName = await createPDFTransactions(
        trades,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }
  async getPDFClient(
    accountantID: string,
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    const fileName = await this.exchanges[exchange].getPDFFileClient(
      accountantID,
      userID,
      algorithm,
      filename,
      financialYear,
      fiscalYear,
    );
    let userFile = new CreateUserFileDto({
      user: userID,
      exchange,
      fileName,
      createdAt: new Date(),
      type: true,
      originalFileName: fileName,
    });
    await this.userFileService.createReport(userFile, userID);
    return fileName;
  }
  async getPDFClientTransactions(
    accountantID: string,
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        const trades =
          await this.transactionService.getTransactionsDataByFiscalYear(
            userID,
            allExchanges[i],
            financialYear,
          );
        allTrades = [...allTrades, ...trades];
      }
      const fileName = await createPDFTransactions(
        allTrades,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades =
        await this.transactionService.getTransactionsDataByFiscalYear(
          userID,
          exchange,
          financialYear,
        );

      const fileName = await createPDFTransactions(
        trades,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }

  async getPDFHoldings(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        if (allExchanges[i] === 'all') continue;
        const trades = await this.exchanges[allExchanges[i]].getTrades(
          userID,
          'fifo',
        );

        allTrades = [...allTrades, ...trades];
      }

      const holdings = await calculateInvestments(allTrades, financialYear);
      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        financialYear,
      );
      const fileName = await createPDFInvestment(
        holdingsExcelData,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades = await this.exchanges[exchange].getTrades(userID, 'fifo');
      const holdings = await calculateInvestments(trades, financialYear);
      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        financialYear,
      );
      const fileName = await createPDFInvestment(
        holdingsExcelData,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }
  async getPDFClientHoldings(
    accountantID: string,
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
    financialYear: string,
    fiscalYear: string,
  ) {
    if (exchange.toLowerCase() === 'all') {
      const allExchanges = Object.keys(this.exchanges);
      let allTrades = [];
      for (let i = 0; i < allExchanges.length; i++) {
        if (allExchanges[i] === 'all') continue;
        const trades = await this.exchanges[allExchanges[i]].getTrades(
          userID,
          'fifo',
        );

        allTrades = [...allTrades, ...trades];
      }

      const holdings = await calculateInvestments(allTrades, financialYear);
      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        financialYear,
      );
      const fileName = await createPDFInvestment(
        holdingsExcelData,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    } else {
      const trades = await this.exchanges[exchange].getTrades(userID, 'fifo');
      const holdings = await calculateInvestments(trades, financialYear);
      const holdingsExcelData = await this.calculateHoldingsData(
        holdings,
        exchange,
        financialYear,
      );
      const fileName = await createPDFInvestment(
        holdingsExcelData,
        filename,
        algorithm,
        financialYear,
      );
      let userFile = new CreateUserFileDto({
        user: userID,
        exchange,
        fileName,
        createdAt: new Date(),
        type: true,
        originalFileName: fileName,
      });
      await this.userFileService.createReport(userFile, userID);
      return fileName;
    }
  }

  async deleteReports(userID: any, filenames: string[]) {
    return await this.userFileService.removeMultiple(userID, filenames);
  }

  async deletePDF(
    exchange: string,
    userID: any,
    algorithm: string,
    filename: string,
  ) {
    const fileName = await this.exchanges[exchange].getPDFFile(
      userID,
      algorithm,
      filename,
    );
    let userFile = new CreateUserFileDto({
      user: userID,
      exchange,
      fileName,
      createdAt: new Date(),
    });
    this.userFileService.create(userFile, userID);
    return fileName;
  }

  async calculateHoldingsData(
    holdings,
    exchange: string,
    financialYear: string,
  ) {
    const holdingsExcelData = [];
    const holdingCoins = Object.keys(holdings);
    for (let i = 0; i < holdingCoins.length; i++) {
      const holding = holdings[holdingCoins[i]];
      let coinID = getCoinId(holdingCoins[i].toLowerCase());
      if (!coinID) coinID = this.coinNotFound(holdingCoins[i].toLowerCase());
      const yr = financialYear.split('-')[1];
      const date = new Date('6 30 ' + yr);
      let exchangeRates;
      let exchangeRate = 0;
      try {
        exchangeRates = await coinGeckoRequest(
          coinID,
          '' +
            date.getDate() +
            '-' +
            (date.getMonth() + 1) +
            '-' +
            date.getFullYear(),
        );
        exchangeRate = exchangeRates.market_data.current_price.aud;
        // console.log(exchangeRate);
      } catch (e) {
        // console.log('coingecko error', e);
      }
      // console.log(holdingCoins[i], exchange, holding['previousHoldingForCoin']);
      const opBal = holding['previousHoldingForCoin']
        ? typeof holding['previousHoldingForCoin']['amount'] === 'number'
          ? holding['previousHoldingForCoin']['amount'].toFixed(3)
          : 0
        : 0;

      const amount = holding['amount']
        ? typeof holding['amount'] === 'number'
          ? parseFloat(holding['amount'].toFixed(3))
          : 0
        : 0;
      holdingsExcelData.push({
        exchange,
        currency: holdingCoins[i],
        opBalQT: opBal,
        opCostBase: holding['previousHoldingForCoin']
          ? holding['previousHoldingForCoin']['costBase'].toFixed(3)
          : 0,
        purchasesQTY: holding['boughtQty'].toFixed(3),
        purchasePrice: holding['boughtCostBase'].toFixed(3),
        saleQTY: holding['soledQty'].toFixed(3),
        costOfSoldQty: holding['soledCostBase'].toFixed(3),
        closingBalQT: amount,
        closingCostBase: (
          (holding['previousHoldingForCoin']
            ? holding['previousHoldingForCoin']['costBase']
            : 0) +
          holding['boughtCostBase'] -
          holding['soledCostBase']
        ).toFixed(3),
        marketValue: Math.abs(amount * exchangeRate).toFixed(3),
        unrealized: (
          amount * exchangeRate -
          ((holding['previousHoldingForCoin']
            ? holding['previousHoldingForCoin']['costBase']
            : 0) +
            holding['boughtCostBase'] -
            holding['soledCostBase'])
        ).toFixed(3),
      });
    }
    return holdingsExcelData;
  }
}
