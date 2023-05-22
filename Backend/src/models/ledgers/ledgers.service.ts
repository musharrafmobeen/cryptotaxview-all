import { Injectable } from '@nestjs/common';
import { LedgersRepository } from './ledgers.repository';
import { CreateLedgersDto } from './dto/create-ledgers.dto';
import { UpdateLedgersDto } from './dto/update-ledgers.dto';

@Injectable()
export class LedgersService {
  constructor(private readonly ledgersRepository: LedgersRepository) {}

  create(createLedgersDto: CreateLedgersDto) {
    return this.ledgersRepository.create(createLedgersDto);
  }

  async findAll(userID: string) {
    const ledgers = await this.ledgersRepository.findAll(userID);
    return ledgers.length > 0
      ? ledgers.sort(
          (a, b) => new Date(+b.date).getTime() - new Date(+a.date).getTime(),
        )
      : [];
  }

  findByUserAndFiscalYear(userID: string, fiscalYear: string) {
    return this.ledgersRepository.findByUserAndFiscalYear(userID, fiscalYear);
  }

  findOne(id: string) {
    return this.ledgersRepository.findOne(id);
  }

  update(id: string, updateLedgersDto: UpdateLedgersDto) {
    return this.ledgersRepository.update(id, updateLedgersDto);
  }

  remove(id: string) {
    return this.ledgersRepository.remove(id);
  }
}
