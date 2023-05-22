import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateVouchershistoryDto } from './dto/create-vouchersHistory.dto';
import { UpdateVouchershistoryDto } from './dto/update-vouchersHistory.dto';
import { Vouchershistory } from './entities/vouchersHistory.entity';

@Injectable()
export class VouchershistoryRepository {
  constructor(
    @Inject('VOUCHERSHISTORY_REPOSITORY')
    private vouchersHistoryRepository: Repository<Vouchershistory>,
  ) {}

  async create(createVouchershistoryDto: CreateVouchershistoryDto) {
    return await this.vouchersHistoryRepository.save(createVouchershistoryDto);
  }

  async findAll() {
    return await this.vouchersHistoryRepository.find();
  }

  async findOne(id: string) {
    return await this.vouchersHistoryRepository.findOne({ where: { id } });
  }

  async findForFiscalYear(fiscalYear: string) {
    return await this.vouchersHistoryRepository.findOne({
      where: { fiscalYear },
    });
  }

  async findByClientsByFiscalYear(accountantID: string, creditYear: string) {
    const clients = await this.vouchersHistoryRepository.find({
      where: { accountantID, creditYear },
    });

    return clients.length;
  }

  async findByClients(accountantID: string) {
    return await this.vouchersHistoryRepository.find({
      where: { accountantID },
    });
  }
  async findByUser(accountantID: string, fiscalYear: string) {
    return await this.vouchersHistoryRepository.find({
      where: { accountantID, fiscalYear },
    });
  }
  async findByClientID(
    accountantID: string,
    clientID: string,
    fiscalYear: string,
    creditYear: string,
  ) {
    return await this.vouchersHistoryRepository.findOne({
      where: { accountantID, clientID, fiscalYear, creditYear },
    });
  }

  async update(id: string, updateVouchershistoryDto: UpdateVouchershistoryDto) {
    const vouchersHistory = await this.vouchersHistoryRepository.findOne({
      where: { id },
    });

    if (!vouchersHistory) {
      throw new HttpException(
        'vouchersHistory not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.vouchersHistoryRepository.save({
      ...vouchersHistory, // existing fields
      ...updateVouchershistoryDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.vouchersHistoryRepository.delete({ id });
  }
}
