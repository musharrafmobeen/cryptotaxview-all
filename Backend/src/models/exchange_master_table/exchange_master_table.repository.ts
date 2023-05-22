import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateExchangeMasterTableDto } from './dto/create-exchange_master_table.dto';
import { UpdateExchangeMasterTableDto } from './dto/update-exchange_master_table.dto';
import { ExchangeMasterTable } from './entities/exchange_master_table.entity';

@Injectable()
export class ExchangeMasterTableRepository {
  constructor(
    @Inject('EXCHANGE_Master_Table_REPOSITORY')
    private exchangeMasterTableRepository: Repository<ExchangeMasterTable>,
  ) {}

  async create(createExchangeMasterTableDto: CreateExchangeMasterTableDto) {
    const data = await this.exchangeMasterTableRepository.find({
      where: { name: createExchangeMasterTableDto.name },
    });
    if (data.length > 0) {
      throw new HttpException('Already Exists', 409);
    }
    return await this.exchangeMasterTableRepository.save(
      createExchangeMasterTableDto,
    );
  }

  async findAll() {
    return await this.exchangeMasterTableRepository.find();
  }

  async findOne(name: string) {
    return await this.exchangeMasterTableRepository.find({ where: { name } });
  }

  async update(
    name: string,
    updateExchangeMasterTableDto: CreateExchangeMasterTableDto,
  ) {
    const data = await this.exchangeMasterTableRepository.find({
      where: { name },
    });

    if (data.length > 0) {
      return await this.exchangeMasterTableRepository.save({
        ...data[0],
        ...updateExchangeMasterTableDto,
      });
    }
    throw new HttpException(
      'No data found for given exchange',
      HttpStatus.NOT_FOUND,
    );
  }

  async remove(id: string) {
    return await this.exchangeMasterTableRepository.delete({ id });
  }
}
