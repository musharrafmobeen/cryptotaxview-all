import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserFilesService } from './user-files.service';
import { CreateUserFileDto } from './dto/create-user-file.dto';
import { UpdateUserFileDto } from './dto/update-user-file.dto';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';

@Controller('user-files')
export class UserFilesController {
  constructor(
    private readonly userFilesService: UserFilesService,
    private readonly exchangePairsService: ExchangePairsService,
  ) {}

  @Post()
  async create(
    @Body() createUserFileDto: CreateUserFileDto,
    @Body('userID') userID: string,
  ) {
    return await this.userFilesService.create(createUserFileDto, userID);
  }

  @Get('files/:type')
  async findAll(@Body('userID') userID: string, @Param('type') type: string) {
    const fileType = type === '0' ? false : true;
    const data = await this.userFilesService.findAll(userID, fileType);
    return data;
  }

  @Get('files/:type/:client')
  async findAllClientFiles(
    @Body('userID') userID: string,
    @Param('type') type: string,
    @Param('client') client: string,
  ) {
    const fileType = type === '0' ? false : true;
    const clientData = await this.exchangePairsService.checkUserValidity(
      userID,
      client,
    );
    const data = await this.userFilesService.findAll(clientData.id, fileType);
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Body('userID') userID: string) {
    return this.userFilesService.findOne(id, userID);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserFileDto: UpdateUserFileDto,
  ) {
    return this.userFilesService.update(+id, updateUserFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userFilesService.remove(id);
  }

  @Delete('/delete/files')
  removeMultipleFiles(
    @Body('userID') userID: string,
    @Body('fileNames') fileNames: string[],
  ) {
    return this.userFilesService.removeMultiple(userID, fileNames);
  }

  @Delete('/delete/files/:client')
  async removeMultipleFilesForClient(
    @Body('userID') userID: string,
    @Body('fileNames') fileNames: string[],
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairsService.checkUserValidity(
      userID,
      client,
    );
    return this.userFilesService.removeMultiple(clientData.id, fileNames);
  }
}
