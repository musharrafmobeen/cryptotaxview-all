import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VouchershistoryService } from './vouchersHistory.service';
import { CreateVouchershistoryDto } from './dto/create-vouchersHistory.dto';
import { UpdateVouchershistoryDto } from './dto/update-vouchersHistory.dto';

@Controller('vouchersHistory')
export class VouchershistoryController {
  constructor(
    private readonly vouchersHistoryService: VouchershistoryService,
  ) {}

  @Post()
  create(@Body() createVouchershistoryDto: CreateVouchershistoryDto) {
    return this.vouchersHistoryService.create(createVouchershistoryDto);
  }

  @Get()
  findAll() {
    return this.vouchersHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vouchersHistoryService.findOne(id);
  }

  @Get('vouchers/:fiscalYear')
  findForFiscalYear(
    @Param('fiscalYear') fiscalYear: string,
    @Body('userID') userID: string,
  ) {
    return this.vouchersHistoryService.findForFiscalYear(userID, fiscalYear);
  }

  @Get('vouchers/all/clients')
  findForAllFiscalYear(@Body('userID') userID: string) {
    return this.vouchersHistoryService.findForAllFiscalYear(userID);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVouchershistoryDto: UpdateVouchershistoryDto,
  ) {
    return this.vouchersHistoryService.update(id, updateVouchershistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersHistoryService.remove(id);
  }
}
