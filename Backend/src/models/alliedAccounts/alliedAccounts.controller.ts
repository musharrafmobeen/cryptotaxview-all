import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';
import { AlliedaccountsService } from './alliedAccounts.service';
import { CreateAlliedaccountsDto } from './dto/create-alliedAccounts.dto';
import { UpdateAlliedaccountsDto } from './dto/update-alliedAccounts.dto';

@Controller('alliedAccounts')
export class AlliedaccountsController {
  constructor(
    private readonly alliedAccountsService: AlliedaccountsService,
    private readonly exchangePairService: ExchangePairsService,
  ) {}

  @Post()
  create(@Body() createAlliedaccountsDto: CreateAlliedaccountsDto) {
    return this.alliedAccountsService.create(createAlliedaccountsDto);
  }

  @Post(':client')
  async createForClient(
    @Body()
    createAlliedaccountsDto: {
      accountAddress: string;
      active: boolean;
    },
    @Param('client') client: string,
    @Body('userID') userID: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    return this.alliedAccountsService.create({
      ...createAlliedaccountsDto,
      userID: clientData.id,
    });
  }

  @Get()
  findAll(@Body('userID') userID: string) {
    return this.alliedAccountsService.findAll(userID);
  }

  @Get('clients/:client')
  async findAllClients(
    @Body('userID') userID: string,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    return this.alliedAccountsService.findAll(clientData.id);
  }

  @Get(':id')
  findOne(@Body('userID') userID: string, @Param('id') id: string) {
    return this.alliedAccountsService.findOne(userID, id);
  }

  @Patch(':id')
  update(
    @Body('userID') userID: string,
    @Param('id') id: string,
    @Body() updateAlliedaccountsDto: UpdateAlliedaccountsDto,
  ) {
    return this.alliedAccountsService.update(
      userID,
      id,
      updateAlliedaccountsDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alliedAccountsService.remove(id);
  }

  @Delete('clients/:client')
  async removeForClient(
    @Param('client') client: string,
    @Body('userID') userID: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    return this.alliedAccountsService.remove(clientData.id);
  }
}
