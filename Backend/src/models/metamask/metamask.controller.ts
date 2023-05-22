import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetamaskService } from './metamask.service';
import { CreateMetamaskDto } from './dto/create-metamask.dto';
import { UpdateMetamaskDto } from './dto/update-metamask.dto';

@Controller('metamask')
export class MetamaskController {
  constructor(private readonly metamaskService: MetamaskService) {}

  @Post()
  create(@Body() createMetamaskDto: CreateMetamaskDto) {
    return this.metamaskService.create(createMetamaskDto);
  }

  @Get()
  findAll() {
    return this.metamaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metamaskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetamaskDto: UpdateMetamaskDto) {
    return this.metamaskService.update(+id, updateMetamaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metamaskService.remove(+id);
  }
}
