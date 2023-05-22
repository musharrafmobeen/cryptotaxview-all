import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller('file')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get(':fileName')
  sendFile(@Param('fileName') fileName: string, @Res() res) {
    res.sendFile(join(__dirname, '..', 'client', fileName));
  }
}
