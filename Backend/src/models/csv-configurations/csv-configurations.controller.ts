import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CsvConfigurationsService } from './csv-configurations.service';
import { CreateCsvConfigurationDto } from './dto/create-csv-configuration.dto';
import { UpdateCsvConfigurationDto } from './dto/update-csv-configuration.dto';

@Controller('csv-configurations')
export class CsvConfigurationsController {
  constructor(private readonly csvConfigurationsService: CsvConfigurationsService) {}

  @Post()
  create(@Body() createCsvConfigurationDto: CreateCsvConfigurationDto) {
    return this.csvConfigurationsService.create(createCsvConfigurationDto);
  }

  @Get()
  findAll() {
    return this.csvConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.csvConfigurationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCsvConfigurationDto: UpdateCsvConfigurationDto) {
    return this.csvConfigurationsService.update(+id, updateCsvConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.csvConfigurationsService.remove(+id);
  }
}
