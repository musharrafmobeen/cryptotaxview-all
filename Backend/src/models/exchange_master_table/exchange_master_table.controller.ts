import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExchangeMasterTableService } from './exchange_master_table.service';
import { CreateExchangeMasterTableDto } from './dto/create-exchange_master_table.dto';

@Controller('exchange-master-table')
export class ExchangeMasterTableController {
  constructor(
    private readonly exchangeMasterTableService: ExchangeMasterTableService,
  ) {}

  @Post()
  create(@Body() createExchangeMasterTableDto: CreateExchangeMasterTableDto) {
    return this.exchangeMasterTableService.create(createExchangeMasterTableDto);
  }

  @Get()
  findAll() {
    return this.exchangeMasterTableService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.exchangeMasterTableService.findOne(name);
  }

  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateExchangeMasterTableDto: CreateExchangeMasterTableDto,
  ) {
    return this.exchangeMasterTableService.update(
      name,
      updateExchangeMasterTableDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeMasterTableService.remove(id);
  }
}
