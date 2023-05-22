import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Between, LessThan, Like, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { OriginalTransaction } from './entities/transaction-original.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsRepository {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    @Inject('ORIGINAL_TRANSACTION_REPOSITORY')
    private originalTransactionRepository: Repository<OriginalTransaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionRepository.find({
      where: { ...createTransactionDto },
    });
    if (transaction.length > 0) return transaction[0];
    if (createTransactionDto.source !== 'manual')
      await this.originalTransactionRepository.save({
        ...createTransactionDto,
      });
    return await this.transactionRepository.save({ ...createTransactionDto });
  }

  async findAllTransactions(id: string, exchange: string) {
    return await this.transactionRepository.find({
      where: {
        user: id,
        exchange,
      },
    });
  }

  async findAllExchangesTransactions(id: string) {
    return await this.transactionRepository.find({
      where: {
        user: id,
      },
    });
  }

  async resetData(userID: string) {
    await this.transactionRepository.delete({ user: userID });
    const trades = await this.originalTransactionRepository.find({
      where: { user: userID },
    });
    return await this.transactionRepository.save(trades);
  }

  async findAllTransactionsByFiscalYear(
    id: string,
    exchange: string,
    financialYear: string,
  ) {
    const [year1, year2] = financialYear.split('-');
    return await this.transactionRepository.find({
      where: {
        user: id,
        exchange,
        datetime: Between(`${year1}-7-1 00:00:00`, `${year2}-6-30 00:00:00`),
      },
    });
  }

  async findAllExchangesTransactionsByFiscalYear(
    id: string,
    financialYear: string,
  ) {
    const [year1, year2] = financialYear.split('-');
    return await this.transactionRepository.find({
      where: {
        user: id,
        datetime: Between(`${year1}-7-1 00:00:00`, `${year2}-6-30 00:00:00`),
      },
    });
  }

  async transactionCount(id: string, exchange: string) {
    const counts = {};
    counts['api'] = await this.transactionRepository.count({
      where: { user: id, exchange, source: 'api' },
    });
    counts['csv'] = await this.transactionRepository.count({
      where: { user: id, exchange, source: 'csv' },
    });

    counts['manual'] = await this.transactionRepository.count({
      where: { user: id, exchange, source: 'manual' },
    });

    return counts;
  }

  async getTransactionData(id: string, exchange: string) {
    return await this.transactionRepository.find({
      where: { user: id, exchange },
    });
  }

  async getTransactions(
    userID: string,
    take: number,
    skip: number,
    filters: any,
    holdingsError: boolean,
  ) {
    let count = 0;
    if (!holdingsError) {
      count = await this.transactionRepository.count({
        where: { user: userID, ...filters },
      });
    } else {
      count = await this.transactionRepository.count({
        where: [
          { user: userID, ...filters, currentCoinBalance: LessThan(0) },
          { user: userID, ...filters, previousCoinBalance: LessThan(0) },
        ],
      });
    }

    let errorCount = 0;
    if (filters.exchange) {
      errorCount = await this.transactionRepository.count({
        where: {
          user: userID,
          isError: true,
          exchange: filters.exchange,
          ...filters,
        },
      });
    } else {
      errorCount = await this.transactionRepository.count({
        where: { user: userID, isError: true, ...filters },
      });
    }

    const uniqueCoins = await this.transactionRepository
      .createQueryBuilder('original_transaction')
      .select('original_transaction.symbol')
      .where('original_transaction.user = :userID ', { userID })
      .distinct(true)
      .execute();

    const uniqueFileNames = await this.transactionRepository
      .createQueryBuilder('original_transaction')
      .select('original_transaction.fileName')
      .where('original_transaction.user = :userID ', { userID })
      .distinct(true)
      .execute();

    if (filters !== {}) {
      let transactions = [];
      if (!holdingsError) {
        transactions = await this.transactionRepository.find({
          order: {
            datetime: 'DESC',
          },
          skip,
          take,
          where: { user: userID, ...filters },
        });
      } else {
        transactions = await this.transactionRepository.find({
          order: {
            datetime: 'DESC',
          },
          skip,
          take,
          where: [
            { user: userID, ...filters, currentCoinBalance: LessThan(0) },
            { user: userID, ...filters, previousCoinBalance: LessThan(0) },
          ],
        });
      }

      return { transactions, count, uniqueCoins, uniqueFileNames, errorCount };
    }

    const transactions = await this.transactionRepository.find({
      order: {
        datetime: 'DESC',
      },
      skip,
      take,
      where: { user: userID },
    });
    return { transactions, count, uniqueCoins, errorCount };
  }

  async getTransactionsFromCoins(
    userID: string,
    exchange: string,
    source: string,
    coin1: string,
    coin2: string,
  ) {
    return await this.transactionRepository.find({
      where: [
        {
          user: userID,
          exchange,
          symbol: Like(`%${coin1}%`),
        },
        {
          user: userID,
          exchange,
          symbol: Like(`%${coin2}%`),
        },
      ],
    });
  }

  async findOne(id: string) {
    return await this.transactionRepository.findOne({ id });
  }

  async update(ids: string[], updates: any, userID: string) {
    const transactions = await this.transactionRepository.findByIds(ids);
    const filteredTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].user === userID) {
        filteredTransactions.push({
          ...transactions[i],
          ...updates,
        });
      }
    }
    return await this.transactionRepository.save(filteredTransactions);
  }

  async updateRecalculatedTransactions(transactions) {
    return await this.transactionRepository.save(transactions);
  }

  async remove(id: string, exchange: string, source: string) {
    await this.originalTransactionRepository.delete({
      user: id,
      exchange,
      source,
    });

    return await this.transactionRepository.delete({
      user: id,
      exchange,
      source,
    });
  }

  async removeAll(userId: string) {
    return await this.transactionRepository.delete({ user: userId });
  }

  async removeAllApiByName(userId: string, name: string) {
    try {
      await this.transactionRepository.delete({
        user: userId,
        source: 'csv',
        exchange: name,
      });

      await this.originalTransactionRepository.delete({
        user: userId,
        source: 'csv',
        exchange: name,
      });

      return 'deleted';
    } catch (e) {
      throw new Error('Deletion Failed');
    }
  }

  async removeAllApiDataByName(userId: string, name: string) {
    try {
      await this.transactionRepository.delete({
        user: userId,
        source: 'api',
        exchange: name,
      });

      await this.originalTransactionRepository.delete({
        user: userId,
        source: 'api',
        exchange: name,
      });

      return 'deleted';
    } catch (e) {
      throw new Error('Deletion Failed');
    }
  }

  async removeAllSourcesApiByName(userId: string, name: string) {
    try {
      await this.transactionRepository.delete({
        user: userId,
        exchange: name,
      });

      await this.originalTransactionRepository.delete({
        user: userId,
        exchange: name,
      });

      return 'deleted';
    } catch (e) {
      throw new Error('Deletion Failed');
    }
  }

  async removeAllApi(userId: string) {
    try {
      await this.transactionRepository.delete({
        user: userId,
      });

      await this.originalTransactionRepository.delete({
        user: userId,
        source: 'api',
      });

      return 'deleted';
    } catch (e) {
      throw new Error('Deletion Failed');
    }
  }

  async removeByFileName(userId: string, fileName: string) {
    try {
      await this.transactionRepository.delete({
        user: userId,
        fileName,
        source: 'csv',
      });

      await this.originalTransactionRepository.delete({
        user: userId,
        fileName,
        source: 'csv',
      });

      return 'deleted';
    } catch (e) {
      throw new Error('Deletion Failed');
    }
  }

  async removeTransactions(ids: string[]) {
    const entities = await this.transactionRepository.findByIds(ids);
    if (!entities) {
      throw new NotFoundException(
        `Some Entities not found, no changes applied!`,
      );
    }
    return this.transactionRepository.remove(entities);
  }
}
