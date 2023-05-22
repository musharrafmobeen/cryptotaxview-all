import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { CreateBitcoinDto } from './dto/create-bitcoin.dto';
import { UpdateBitcoinDto } from './dto/update-bitcoin.dto';

@Controller('bitcoin')
export class BitcoinController {
  constructor(private readonly bitcoinService: BitcoinService) {}

  @Post()
  create(@Body() createBitcoinDto: CreateBitcoinDto) {
    return this.bitcoinService.create(createBitcoinDto);
  }

  @Get()
  findAll(@Body('userID') userID: string) {
    return this.bitcoinService.findAll(userID);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bitcoinService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBitcoinDto: UpdateBitcoinDto) {
    return this.bitcoinService.update(+id, updateBitcoinDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bitcoinService.remove(+id);
  }
}
