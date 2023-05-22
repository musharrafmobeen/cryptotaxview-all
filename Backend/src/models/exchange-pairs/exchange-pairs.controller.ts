import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ExchangePairsService } from './exchange-pairs.service';
import { CreateExchangePairDto } from './dto/create-exchange-pair.dto';
import { UpdateExchangePairDto } from './dto/update-exchange-pair.dto';
import { Request } from 'express';

@Controller('exchange-pairs')
export class ExchangePairsController {
  constructor(private readonly exchangePairsService: ExchangePairsService) {}

  @Post()
  create(
    @Body() createExchangePairDto: CreateExchangePairDto,
    @Req() req: Request,
  ) {
    return this.exchangePairsService.create(
      String(req.user),
      createExchangePairDto,
    );
  }

  @Post('professional/:client')
  async createClient(
    @Body() createExchangePairDto: CreateExchangePairDto,
    @Req() req: Request,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairsService.checkUserValidity(
      String(req.user),
      client,
    );

    return this.exchangePairsService.create(
      clientData.id,
      createExchangePairDto,
    );
  }

  @Post('retrieve')
  findAll(@Body('userID') userID: string, @Body('order') order: any) {
    return this.exchangePairsService.findAll(userID, order);
  }

  @Post('retrieve/:client')
  async findAllUsersIntegrations(
    @Body('userID') userID: string,
    @Param('client') client: string,
    @Body('order') order: any,
  ) {
    const clientData = await this.exchangePairsService.checkUserValidity(
      userID,
      client,
    );
    return this.exchangePairsService.findAll(clientData.id, order);
  }

  @Get(':id/:exchange')
  findOne(@Param('id') id: string, @Param('exchange') exchange: string) {
    return this.exchangePairsService.findOne(id, exchange);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.exchangePairsService.update(body.user, body.lastSynced);
  }

  @Delete(':exchange/:name')
  remove(
    @Param('name') name: string,
    @Param('exchange') exchange: string,
    @Body('userID') userID: string,
  ) {
    return this.exchangePairsService.remove(name, exchange, userID);
  }

  @Delete(':exchange/:name/:client')
  async removeClient(
    @Param('name') name: string,
    @Param('exchange') exchange: string,
    @Param('client') client: string,
    @Body('userID') userID: string,
  ) {
    const clientData = await this.exchangePairsService.checkUserValidity(
      userID,
      client,
    );
    return this.exchangePairsService.remove(name, exchange, clientData.id);
  }
}
