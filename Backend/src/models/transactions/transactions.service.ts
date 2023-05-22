import { Injectable } from '@nestjs/common';
import { Between, Like } from 'typeorm';
import { TaxCalculationService } from '../exchanges-wrapper/algorithms/fifoAlogorithm';
import { trades } from '../exchanges-wrapper/binance-trades';
import { CreateNewTransactionDto } from './dto/create-new-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly taxCalculationService: TaxCalculationService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    return await this.transactionsRepository.create({
      ...createTransactionDto,
    });
  }

  async createNewTransaction(
    createTransactionDto: CreateNewTransactionDto,
    userId: string,
  ) {
    const { userID, ...restUser } = createTransactionDto;
    const createdTransactions = await this.transactionsRepository.create({
      ...restUser,
      fileName: createTransactionDto.fileName
        ? createTransactionDto.fileName
        : '',
      fifoCGTDetail: JSON.parse(JSON.stringify({})),
      lifoCGTDetail: JSON.parse(JSON.stringify({})),
      fifoRelatedTransactions: JSON.parse(JSON.stringify([])),
      lifoRelatedTransactions: JSON.parse(JSON.stringify([])),
      currentBoughtCoinBalance: 0,
      currentSoldCoinBalance: 0,
      cgt: JSON.parse(JSON.stringify({})),
      source: 'manual',
      priceInAud: 0,
      isError: false,
      user: userId,
      balance: JSON.parse(
        JSON.stringify({
          previousBalance: 0,
          currentBalance: 0,
        }),
      ),
    });
    const transactionsToBeUpdated = [];
    const [coin1, coin2] = createdTransactions.symbol.split('/');
    const exchange = createdTransactions.exchange;
    const source = createdTransactions.source;
    // const transactionsToBeRecalculated =
    //   await this.transactionsRepository.getTransactionsFromCoins(
    //     userID,
    //     exchange,
    //     source,
    //     coin1,
    //     coin2,
    //   );

    const transactionsToBeRecalculated =
      await this.transactionsRepository.getTransactionData(userID, exchange);

    const transactionsToBeRecalculatedFiltered =
      transactionsToBeRecalculated.map((trade) => {
        if (trades['priceInAud'] && trades['priceInAud'] > 0) {
          return {
            id: trade.id,
            amount: trade.amount,
            cost: trade.cost,
            datetime: trade.datetime,
            fee: trade.fee,
            side: trade.side,
            symbol: trade.symbol,
            price: trade.price,
            priceInAud: trade.priceInAud,
            timestamp: new Date(trade.datetime).getTime(),
          };
        } else {
          return {
            id: trade.id,
            amount: trade.amount,
            cost: trade.cost,
            datetime: trade.datetime,
            fee: trade.fee,
            side: trade.side,
            symbol: trade.symbol,
            price: trade.price,
            timestamp: new Date(trade.datetime).getTime(),
          };
        }
      });
    const recalculatedTransactions =
      await this.taxCalculationService.taxCalculator(
        transactionsToBeRecalculatedFiltered,
      );
    const allTrades = recalculatedTransactions.flat();
    for (let i = 0; i < allTrades.length; i++) {
      transactionsToBeUpdated.push({
        ...allTrades[i],
        cgt: allTrades[i].CGT,
        fifoRelatedTransactions: JSON.stringify(
          allTrades[i].fifoRelatedTransactions,
        ),
        lifoRelatedTransactions: JSON.stringify(
          allTrades[i].lifoRelatedTransactions,
        ),
        priceInAud: allTrades[i].priceInAUD,
        user: userID,
        exchange,
        source: allTrades[i].source,
      });
    }

    return await this.transactionsRepository.updateRecalculatedTransactions(
      transactionsToBeUpdated.flat(),
    );
  }

  findAll(id: string, exchange: string) {
    return this.transactionsRepository.findAllTransactions(id, exchange);
  }

  findAllTrxs(id: string) {
    return this.transactionsRepository.findAllExchangesTransactions(id);
  }

  async resetData(userID: string) {
    return await this.transactionsRepository.resetData(userID);
  }

  async getTransactionsData(id: string, exchange: string) {
    const data = await this.transactionsRepository.findAllTransactions(
      id,
      exchange,
    );
    const coins = new Set();
    data.forEach((transaction) => {
      const [coin1, coin2] = transaction.symbol.split('/');
      if (!coins.has(coin1)) coins.add(coin1);
      if (!coins.has(coin2)) coins.add(coin2);
    });
    return { trxCount: data.length, coins: coins.size };
  }

  async getTransactionsDataByFiscalYear(
    id: string,
    exchange: string,
    financialYear: string,
  ) {
    return await this.transactionsRepository.findAllTransactionsByFiscalYear(
      id,
      exchange,
      financialYear,
    );
  }

  async getAllTransactionsDataByFiscalYear(id: string, financialYear: string) {
    return await this.transactionsRepository.findAllExchangesTransactionsByFiscalYear(
      id,
      financialYear,
    );
  }

  async getTransactionsCount(id: string, exchange: string) {
    const data = await this.transactionsRepository.transactionCount(
      id,
      exchange,
    );

    return {
      trxCount: data['api'] + data['csv'] + data['manual'],
      source: data,
    };
  }

  async getTransactions(
    userID: string,
    take: number,
    skip: number,
    filters: any = {},
  ) {
    let holdingsError = false;
    const queryFilters = {};

    const filtersList = new Set([
      'exchange',
      'symbol',
      'side',
      'datetime',
      'isError',
      'source',
      'priceInAud',
      'fileName',
    ]);
    if (filters !== {}) {
      const keys = Object.keys(filters);
      for (let i = 0; i < keys.length; i++) {
        if (filtersList.has(keys[i])) queryFilters[keys[i]] = filters[keys[i]];
      }

      if (filters['from'] && filters['to']) {
        queryFilters['datetime'] = Between(filters.from, filters.to);
      }
      if (filters['symbol']) {
        queryFilters['symbol'] = Like(`%${filters['symbol']}%`);
      }

      if (filters['holdingsError']) {
        holdingsError = true;
      }
    }

    let result: any = await this.transactionsRepository.getTransactions(
      userID,
      take,
      skip,
      queryFilters,
      holdingsError,
    );

    const count = result.count;
    const errorCount = result.errorCount;

    const uniqueCoins = new Set();
    const uniqueFileNames = new Set();

    result.uniqueCoins.forEach((symbols) => {
      const [coin1, coin2] = symbols.original_transaction_symbol.split('/');
      if (!uniqueCoins.has(coin1) && coin1) uniqueCoins.add(coin1);
      if (!uniqueCoins.has(coin2) && coin2) uniqueCoins.add(coin2);
    });

    result.uniqueFileNames.forEach((name) => {
      const fileName = name.original_transaction_fileName;
      if (fileName !== '' && !uniqueFileNames.has(fileName))
        uniqueFileNames.add(fileName);
    });

    result = result.transactions.map((trade) => {
      return {
        ...trade,
        fifoRelatedTransactions: trade.fifoRelatedTransactions
          ? JSON.parse(trade.fifoRelatedTransactions)
          : [],
        lifoRelatedTransactions: trade.lifoRelatedTransactions
          ? JSON.parse(trade.lifoRelatedTransactions)
          : [],
      };
    });

    return {
      transactions: result,
      count,
      uniqueCoins: Array.from(uniqueCoins),
      uniqueFileNames: Array.from(uniqueFileNames),
      errorCount,
    };
  }

  findOne(id: string) {
    return this.transactionsRepository.findOne(id);
  }

  async update(ids: string[], updates: any, userID: string) {
    const updatedTransactions = await this.transactionsRepository.update(
      ids,
      updates,
      userID,
    );
    const transactionsToBeUpdated = [];
    for (let i = 0; i < updatedTransactions.length; i++) {
      const [coin1, coin2] = updatedTransactions[i].symbol.split('/');
      const exchange = updatedTransactions[i].exchange;
      const source = updatedTransactions[i].source;
      // const transactionsToBeRecalculated =
      //   await this.transactionsRepository.getTransactionsFromCoins(
      //     userID,
      //     exchange,
      //     source,
      //     coin1,
      //     coin2,
      //   );
      const transactionsToBeRecalculated =
        await this.transactionsRepository.getTransactionData(userID, exchange);
      const transactionsToBeRecalculatedFiltered =
        transactionsToBeRecalculated.map((trade) => ({
          id: trade.id,
          amount: trade.amount,
          cost: trade.cost,
          datetime: trade.datetime,
          fee: trade.fee,
          side: trade.side,
          symbol: trade.symbol,
          price: trade.price,
          priceInAud: trade.priceInAud,
          timestamp: new Date(trade.datetime).getTime(),
        }));
      const recalculatedTransactions =
        await this.taxCalculationService.taxCalculator(
          transactionsToBeRecalculatedFiltered,
        );
      const allTrades = recalculatedTransactions.flat();
      for (let i = 0; i < allTrades.length; i++) {
        transactionsToBeUpdated.push({
          ...allTrades[i],
          cgt: allTrades[i].CGT,
          fifoRelatedTransactions: JSON.stringify(
            allTrades[i].fifoRelatedTransactions,
          ),
          lifoRelatedTransactions: JSON.stringify(
            allTrades[i].lifoRelatedTransactions,
          ),
          priceInAud: allTrades[i].priceInAUD,
          user: userID,
          exchange,
          source: allTrades[i].source,
        });
      }
    }
    return await this.transactionsRepository.updateRecalculatedTransactions(
      transactionsToBeUpdated.flat(),
    );
  }

  remove(id: string, exchange: string, source: string) {
    return this.transactionsRepository.remove(id, exchange, source);
  }

  removeExchangeTransactions(id: string, exchange: string) {
    return this.transactionsRepository.removeAllApiByName(id, exchange);
  }

  removeExchangeApiTransactions(id: string, exchange: string) {
    return this.transactionsRepository.removeAllApiDataByName(id, exchange);
  }

  removeAll(userId: string) {
    return this.transactionsRepository.removeAll(userId);
  }

  async removeByFileName(userId: string, fileName: string) {
    return this.transactionsRepository.removeByFileName(userId, fileName);
  }

  async removeTransactions(ids: string[]) {
    const data = await this.transactionsRepository.removeTransactions(ids);
    return data;
  }
}
