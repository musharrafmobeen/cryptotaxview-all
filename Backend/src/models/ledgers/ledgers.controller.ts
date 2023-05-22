import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LedgersService } from './ledgers.service';
import { CreateLedgersDto } from './dto/create-ledgers.dto';
import { UpdateLedgersDto } from './dto/update-ledgers.dto';

@Controller('ledgers')
export class LedgersController {
  constructor(private readonly ledgersService: LedgersService) {}

  @Post()
  create(@Body() createLedgersDto: CreateLedgersDto) {
    return this.ledgersService.create(createLedgersDto);
  }

  @Get()
  findAll(@Body('userID') userID: string) {
    return this.ledgersService.findAll(userID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ledgersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLedgersDto: UpdateLedgersDto) {
    return this.ledgersService.update(id, updateLedgersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ledgersService.remove(id);
  }
}
