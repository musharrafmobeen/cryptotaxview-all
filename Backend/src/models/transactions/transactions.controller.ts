import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateNewTransactionDto } from './dto/create-new-transaction.dto';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly exchangePairService: ExchangePairsService,
  ) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Body('userID') userID: string,
  ) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Post('/create')
  createNewTransaction(
    @Body() createTransactionDto: CreateNewTransactionDto,
    @Body('userID') userID: string,
  ) {
    return this.transactionsService.createNewTransaction(
      createTransactionDto,
      userID,
    );
  }

  @Post('/create/:client')
  async createNewTransactionForClient(
    @Body() createTransactionDto: CreateNewTransactionDto,
    @Body('userID') userID: string,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    return this.transactionsService.createNewTransaction(
      createTransactionDto,
      clientData.id,
    );
  }

  @Get()
  findAll(@Body() body: any) {
    return this.transactionsService.findAll(body.userID, body.exchange);
  }

  @Post('amount/:exchange')
  getTransactionData(@Body() body: any, @Param('exchange') exchange: string) {
    return this.transactionsService.getTransactionsData(body.userID, exchange);
  }

  @Post(':take/:skip')
  getTransactions(
    @Body() body: any,
    @Param('take') take: string,
    @Param('skip') skip: string,
  ) {
    return this.transactionsService.getTransactions(
      body.userID,
      +take,
      +skip,
      body.filters,
    );
  }

  @Post(':take/:skip/:client')
  async getTransactionsClient(
    @Body() body: any,
    @Param('take') take: string,
    @Param('skip') skip: string,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      body.userID,
      client,
    );
    return this.transactionsService.getTransactions(
      clientData.id,
      +take,
      +skip,
      body.filters,
    );
  }

  @Get('reset')
  resetData(@Body('userID') userID: string) {
    return this.transactionsService.resetData(userID);
  }

  @Get('reset/:client')
  async resetDataClient(
    @Body('userID') userID: string,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    return this.transactionsService.resetData(clientData.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch()
  update(@Body() body: { ids: string[]; updates: any; userID: string }) {
    return this.transactionsService.update(body.ids, body.updates, body.userID);
  }

  @Patch('/:client')
  async updateClient(
    @Body() body: { ids: string[]; updates: any; userID: string },
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      body.userID,
      client,
    );
    return this.transactionsService.update(
      body.ids,
      body.updates,
      clientData.id,
    );
  }

  @Delete(':id/:exchange/:source')
  remove(
    @Param('id') id: string,
    @Param('exchange') exchange: string,
    @Param('source') source: string,
  ) {
    return this.transactionsService.remove(id, exchange, source);
  }

  @Delete('remove-all')
  removeAll(@Body('userID') userId: string) {
    return this.transactionsService.removeAll(userId);
  }

  @Delete('remove-some')
  removeTransaction(@Body() body: any) {
    return this.transactionsService.removeTransactions(body.txnIDs);
  }

  @Delete('remove-some/:client')
  async removeTransactionClient(
    @Body() body: any,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      body.userID,
      client,
    );
    return this.transactionsService.removeTransactions(body.txnIDs);
  }
}
