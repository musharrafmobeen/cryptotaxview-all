import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { UserFilesRepository } from '../user-files/user-files.repository';
import { UserFilesService } from '../user-files/user-files.service';
import { CreateExchangePairDto } from './dto/create-exchange-pair.dto';
import { UpdateExchangePairDto } from './dto/update-exchange-pair.dto';
import { ExchangePair } from './entities/exchange-pair.entity';

@Injectable()
export class ExchangePairsRepository {
  constructor(
    @Inject('EXCHANGE_PAIR_REPOSITORY')
    private exchangePairsRepository: Repository<ExchangePair>,
    private transactionsRepository: TransactionsRepository,
    private userFilesService: UserFilesService,
  ) {}

  async create(userID: string, createExchangePairDto: CreateExchangePairDto) {
    createExchangePairDto.userID = userID;
    const result = await this.exchangePairsRepository.find({
      where: {
        userID,
        name: createExchangePairDto.exchange,
        source: 'api',
      },
    });

    if (!result) {
      return await this.exchangePairsRepository.save(createExchangePairDto);
    } else {
      await this.exchangePairsRepository.delete({
        userID,
        name: createExchangePairDto.exchange,
      });
      return await this.exchangePairsRepository.save(createExchangePairDto);
    }
  }

  async findAll(userID: string) {
    return await this.exchangePairsRepository.find({
      where: { userID },
    });
  }

  findOne(id: string, exchange: string) {
    return this.exchangePairsRepository.find({
      where: { userID: id, name: exchange },
    });
  }

  async update(userID: string, lastSynced: number) {
    const exchangePair = await this.exchangePairsRepository.findOne({
      where: { userID },
    });
    exchangePair.lastSynced = lastSynced;
    const result = await this.exchangePairsRepository.save(exchangePair);
  }

  async remove(name: string, exchange: string, userID: string) {
    try {
      await this.exchangePairsRepository.delete({
        userID,
        name,
      });

      await this.userFilesService.removeFilesByExchange(userID, exchange);

      return await this.transactionsRepository.removeAllSourcesApiByName(
        userID,
        name,
      );
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
