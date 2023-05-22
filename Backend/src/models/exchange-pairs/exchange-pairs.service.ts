import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ReferralsService } from '../referrals/referrals.service';
import { TransactionsService } from '../transactions/transactions.service';
import { UserFilesService } from '../user-files/user-files.service';
import { UsersService } from '../users/users.service';
import { CreateExchangePairDto } from './dto/create-exchange-pair.dto';
import { UpdateExchangePairDto } from './dto/update-exchange-pair.dto';
import { ExchangePairsRepository } from './exchange-pairs.repository';

@Injectable()
export class ExchangePairsService {
  constructor(
    private readonly exchangePairRepository: ExchangePairsRepository,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionService: TransactionsService,
    private readonly userFileService: UserFilesService,
    private readonly usersService: UsersService,
    private readonly referralsService: ReferralsService,
  ) {}

  async create(userID: string, createExchangePairDto: CreateExchangePairDto) {
    const exchangeIntegration = await this.exchangePairRepository.create(
      userID,
      createExchangePairDto,
    );
    const { trxCount, coins } =
      await this.transactionService.getTransactionsData(
        userID,
        createExchangePairDto.exchange,
      );
    return { ...exchangeIntegration, trxCount, coins };
  }

  async checkUserValidity(userID: string, clientID: string) {
    const user = await this.usersService.findOne(userID);
    const client = await this.usersService.findOneByEmail(clientID);
    if (user && client) {
      const clients = await this.referralsService.findAllByReferralCode(
        user.referralCode,
      );
      for (let i = 0; i < clients.length; i++) {
        if (client.email === clients[i].email) {
          console.log(client);
          return client;
        }
      }
      throw new HttpException(
        'No Such Clients for the user',
        HttpStatus.NOT_FOUND,
      );
    } else {
      throw new HttpException(
        'No Such Clients for the user',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findAll(userID: string, order: any) {
    const data = await this.exchangePairRepository.findAll(userID);
    const added = {};
    for (let i = 0; i < data.length; i++) {
      if (!added[data[i].exchange]) {
        added[data[i].exchange] = data[i].lastSynced;
      }
    }
    const exchanges = [
      { exchange: 'coinspot' },
      { exchange: 'coinbase' },
      { exchange: 'binance' },
      { exchange: 'swyftx' },
      { exchange: 'metamask' },
      { exchange: 'bitcoin' },
      { exchange: 'digitalsurge' },
    ];

    const files = await this.userFileService.findAll(userID, false);
    const allIntegratedExchanges = [];
    for (let i = 0; i < exchanges.length; i++) {
      const { trxCount, source } =
        await this.transactionService.getTransactionsCount(
          userID,
          exchanges[i].exchange,
        );

      if (added[exchanges[i].exchange]) {
        const dataSource =
          source['api'] >= 0 && source['csv'] > 0 && source['manual'] > 0
            ? 'api/csv/manual'
            : source['api'] >= 0 && source['csv'] > 0 && source['manual'] <= 0
            ? 'api/csv'
            : source['api'] >= 0 && source['csv'] <= 0 && source['manual'] > 0
            ? 'api/manual'
            : source['api'] >= 0 && source['csv'] <= 0 && source['manual'] <= 0
            ? 'api'
            : 'api';

        allIntegratedExchanges.push({
          ...exchanges[i],
          trxCount,
          source: dataSource,
          lastSynced: parseInt(added[exchanges[i].exchange]),
          files,
        });
      } else if (source['csv'] > 0 && source['manual'] <= 0) {
        allIntegratedExchanges.push({
          ...exchanges[i],
          trxCount,
          source: 'csv',
          lastSynced: new Date().getTime(),
          files,
        });
      } else if (source['manual'] > 0 && source['csv'] <= 0) {
        allIntegratedExchanges.push({
          ...exchanges[i],
          trxCount,
          source: 'manual',
          lastSynced: new Date().getTime(),
          files,
        });
      } else if (source['manual'] > 0 && source['csv'] > 0) {
        allIntegratedExchanges.push({
          ...exchanges[i],
          trxCount,
          source: 'csv/manual',
          lastSynced: new Date().getTime(),
          files,
        });
      }
    }

    if (order !== null && order !== undefined) {
      const epkeys = Object.keys(order)[0];
      if (epkeys === 'exchange' || epkeys === 'source') {
        return order[epkeys] === 'ASC'
          ? allIntegratedExchanges.sort((a, b) =>
              a[epkeys].localeCompare(b[epkeys]),
            )
          : allIntegratedExchanges.sort((a, b) =>
              b[epkeys].localeCompare(a[epkeys]),
            );
      }
      return order[epkeys] === 'ASC'
        ? allIntegratedExchanges.sort((a, b) => a[epkeys] - b[epkeys])
        : allIntegratedExchanges.sort((a, b) => b[epkeys] - a[epkeys]);
    }
    return allIntegratedExchanges;
  }

  async findOne(id: string, exchange: string) {
    return await this.exchangePairRepository.findOne(id, exchange);
  }

  update(userID: string, lastSynced: number) {
    return this.exchangePairRepository.update(userID, lastSynced);
  }

  async remove(name: string, exchange: string, userID: string) {
    return await this.exchangePairRepository.remove(name, exchange, userID);
  }
}
