import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateLedgersDto } from './dto/create-ledgers.dto';
import { UpdateLedgersDto } from './dto/update-ledgers.dto';
import { Ledgers } from './entities/ledgers.entity';

@Injectable()
export class LedgersRepository {
  constructor(
    @Inject('LEDGERS_REPOSITORY')
    private ledgersRepository: Repository<Ledgers>,
  ) {}

  async create(createLedgersDto: CreateLedgersDto) {
    return await this.ledgersRepository.save(createLedgersDto);
  }

  async findAll(userID: string) {
    return await this.ledgersRepository.find({
      where: { accountantID: userID },
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    return await this.ledgersRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  async findByUserAndFiscalYear(id: string, fiscalYear: string) {
    return await this.ledgersRepository.find({
      where: { accountantID: id, fiscalYear },
    });
  }

  async update(id: string, updateLedgersDto: UpdateLedgersDto) {
    const ledgers = await this.ledgersRepository.findOne({ where: { id } });

    if (!ledgers) {
      throw new HttpException('ledgers not found', HttpStatus.NOT_FOUND);
    }

    return this.ledgersRepository.save({
      ...ledgers, // existing fields
      ...updateLedgersDto, // updated fields
    });
  }

  async remove(id: string) {
    return await this.ledgersRepository.delete({ id });
  }
}
