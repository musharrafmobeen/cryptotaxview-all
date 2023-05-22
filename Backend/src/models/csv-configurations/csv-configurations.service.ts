import { Injectable } from '@nestjs/common';
import { CreateCsvConfigurationDto } from './dto/create-csv-configuration.dto';
import { UpdateCsvConfigurationDto } from './dto/update-csv-configuration.dto';

@Injectable()
export class CsvConfigurationsService {
  create(createCsvConfigurationDto: CreateCsvConfigurationDto) {
    return 'This action adds a new csvConfiguration';
  }

  findAll() {
    return `This action returns all csvConfigurations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} csvConfiguration`;
  }

  update(id: number, updateCsvConfigurationDto: UpdateCsvConfigurationDto) {
    return `This action updates a #${id} csvConfiguration`;
  }

  remove(id: number) {
    return `This action removes a #${id} csvConfiguration`;
  }
}
