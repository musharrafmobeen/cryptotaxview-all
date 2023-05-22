import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import {
  createOrderHistoryImportSchema,
  updateOrderHistoryImportSchema,
} from '../../common/contants/joi-validation-schemas';
import { coinSpotCsv } from '../../common/contants/order-history-import-csv-headers';
import { JoiValidationPipe } from '../../common/pipes/validation.pipe';
import {
  checkFileType,
  storage,
  upload,
} from 'src/config/multer/multer.config';
import { CreateOrderHistoryImportDto } from './dto/create-order-history-import.dto';
import { UpdateOrderHistoryImportDto } from './dto/update-order-history-import.dto';
import { OrderHistoryImportService } from './order-history-import.service';
import { Request } from 'express';
import { events } from 'src/common/events/eventEmitter';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';

@Controller('order-history-import')
export class OrderHistoryImportController {
  constructor(
    private readonly orderHistoryImportsService: OrderHistoryImportService,
    private readonly exchangePairsService: ExchangePairsService,
  ) {}

  @Post()
  createOrderHistoryImport(
    @Body(new JoiValidationPipe(createOrderHistoryImportSchema))
    createOrderHistoryImportDto: CreateOrderHistoryImportDto,
  ) {
    return this.orderHistoryImportsService.createOrderHistoryImport(
      createOrderHistoryImportDto,
    );
  }

  @Post('upload/:exchange/:insertionType')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
      limits: { fileSize: 1200000 },
      fileFilter: (_req, file, cb) => {
        checkFileType(file, cb);
      },
    }),
  )
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param('exchange') exchange: string,
    @Param('insertionType') insertionType: string,
  ) {
    events.startEventEmit();
    const data: any = await this.orderHistoryImportsService.createCsvRecords(
      file,
      String(req.user),
      exchange,
      insertionType,
    );

    return data && data.length > 0
      ? data.sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime(),
        )
      : [];
  }

  @Post('upload/:exchange/:insertionType/:client')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage,
      limits: { fileSize: 1200000 },
      fileFilter: (_req, file, cb) => {
        checkFileType(file, cb);
      },
    }),
  )
  async uploadCsvForClient(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param('exchange') exchange: string,
    @Param('insertionType') insertionType: string,
    @Param('client') client: string,
  ) {
    events.startEventEmit();
    const clientData = await this.exchangePairsService.checkUserValidity(
      String(req.user),
      client,
    );

    const data: any = await this.orderHistoryImportsService.createCsvRecords(
      file,
      clientData.id,
      exchange,
      insertionType,
    );

    return data.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime(),
    );
  }

  @Get('CSV-Data')
  async getCSVData(@Body('userID') userID: string) {
    return this.orderHistoryImportsService.getCsvData(userID);
  }

  @Get('upload')
  async validateFile() {
    const csvFile = readFileSync(
      'uploads/order-history-imports/file1645619058819.csv',
    );
    const csvData = csvFile.toString().replace(/(?:\\[rn]|[\r\n]+)+/g, '\n');
    let csvHeaders = csvData.split('\n')[0].split(',');
    csvHeaders = csvHeaders.map((field) =>
      field.toString().trim().replace(/\"/g, ''),
    );
    csvHeaders[csvHeaders.length - 1] = csvHeaders[
      csvHeaders.length - 1
    ].replace('\r', '');
    let errorMsg = '';
    coinSpotCsv.forEach((item) => {
      if (!csvHeaders.includes(item.key)) {
        errorMsg = errorMsg + '\n' + `[${item.key}]`;
      }
    });
    if (errorMsg !== '') {
      errorMsg = 'Following Fields Missing ' + errorMsg;
      throw new BadRequestException(errorMsg);
    }
    let parsedCsvData = csvData.split('\n');
    parsedCsvData = parsedCsvData.slice(1, parsedCsvData.length - 1);
    const csvData0 = parsedCsvData[0].split(',');
  }

  @Patch(':id')
  updateOrderHistoryImport(
    @Param('id') orderId: string,
    @Body(new JoiValidationPipe(updateOrderHistoryImportSchema))
    updateOrderHistoryImportDto: UpdateOrderHistoryImportDto,
  ) {
    return this.orderHistoryImportsService.updateOrderHistoryImport(
      orderId,
      updateOrderHistoryImportDto,
    );
  }

  @Get()
  getOrderHistoryImports() {
    return this.orderHistoryImportsService.getOrderHistoryImports();
  }
}
