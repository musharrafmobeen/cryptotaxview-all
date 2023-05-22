import { Injectable } from '@nestjs/common';
import { CreateExchangeMasterTableDto } from './dto/create-exchange_master_table.dto';
import { UpdateExchangeMasterTableDto } from './dto/update-exchange_master_table.dto';
import { ExchangeMasterTableRepository } from './exchange_master_table.repository';

@Injectable()
export class ExchangeMasterTableService {
  constructor(
    private readonly exchangeMasterTableRepository: ExchangeMasterTableRepository,
  ) {}
  async create(createExchangeMasterTableDto: CreateExchangeMasterTableDto) {
    return await this.exchangeMasterTableRepository.create(
      createExchangeMasterTableDto,
    );
  }

  async findAll() {
    return await this.exchangeMasterTableRepository.findAll();
  }

  async findOne(name: string) {
    return await this.exchangeMasterTableRepository.findOne(name);
  }

  async update(
    id: string,
    updateExchangeMasterTableDto: CreateExchangeMasterTableDto,
  ) {
    return await this.exchangeMasterTableRepository.update(
      id,
      updateExchangeMasterTableDto,
    );
  }

  async remove(name: string) {
    return await this.exchangeMasterTableRepository.remove(name);
  }
}
