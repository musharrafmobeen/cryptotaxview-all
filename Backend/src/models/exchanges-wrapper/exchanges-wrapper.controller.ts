import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ExchangesWrapperService } from './exchanges-wrapper.service';
import { ExchangePairsService } from '../exchange-pairs/exchange-pairs.service';
import * as fs from 'fs';
import { Response } from 'express';
import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { UserplanService } from '../userPlan/userPlan.service';
import { VouchershistoryService } from '../vouchersHistory/vouchersHistory.service';
import { LedgersService } from '../ledgers/ledgers.service';
import { UsersService } from '../users/users.service';

@Controller('exchanges-wrapper')
export class ExchangesWrapperController {
  constructor(
    private readonly exchangesWrapperService: ExchangesWrapperService,

    private readonly exchangePairService: ExchangePairsService,
    private readonly userPlanService: UserplanService,
    private readonly vouchersHistoryService: VouchershistoryService,
    private readonly ledgersService: LedgersService,
    private readonly usersService: UsersService,
  ) {}

  reports = {
    cgtExcel: this.exchangesWrapperService.getExcelSheet,
    investmentExcel: this.exchangesWrapperService.getExcelSheetHoldings,
    cgtPdf: this.exchangesWrapperService.getPDF,
    investmentPdf: this.exchangesWrapperService.getPDFHoldings,
    cgtExcelClient: this.exchangesWrapperService.getExcelSheetClient,
    investmentExcelClient:
      this.exchangesWrapperService.getExcelSheetClientHoldings,
    cgtPdfClient: this.exchangesWrapperService.getPDFClient,
    investmentPdfClient: this.exchangesWrapperService.getPDFClientHoldings,
  };

  @Get('binance/sync')
  async getTradesSync(@Body() body) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      'binance',
    );
    const exchangePairsFiltered = exchangePairs[0];

    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return JSON.parse(
        JSON.stringify(
          await this.exchangesWrapperService.getTradesSync(
            'binance',
            exchangePairsFiltered.keys,
            body.userID,
          ),
        ),
      );
    }
    throw new HttpException('Exchange Not Integrated', HttpStatus.NOT_FOUND);
  }

  @Get('sync/status/:exchange')
  async getSyncStatus(
    @Body('userID') userID: string,
    @Param('exchange') exchange: string,
  ) {
    return this.exchangesWrapperService.getSyncStatus(exchange, userID);
  }

  @Post('excel')
  async getExcel(
    @Body('userID') userID: string,
    @Body('fileName') filename: string,
    @Body('exchange') exchange: string,
    @Body('reportType') reportType: string,
    @Body('financialYear') financialYear: string,
    @Body('method') method: string,
    @Res() res: Response,
  ) {
    let fileName = '';
    if (reportType.toLowerCase() === 'cgtreport') {
      fileName = await this.exchangesWrapperService.getExcelSheet(
        exchange,
        userID,
        method,
        filename === '' ? new Date().getTime().toString() : filename,
        financialYear,
      );
    } else if (reportType.toLowerCase() === 'investmentreport') {
      fileName = await this.exchangesWrapperService.getExcelSheetHoldings(
        exchange,
        userID,
        method,
        filename === '' ? new Date().getTime().toString() : filename,
        financialYear,
      );
    } else {
      fileName = await this.exchangesWrapperService.getExcelSheetTransactions(
        exchange,
        userID,
        method,
        filename === '' ? new Date().getTime().toString() : filename,
        financialYear,
      );
    }
    const buffer = await fs.readFileSync(__dirname + `/../../../${fileName}`);
    const stream = fs.createReadStream(__dirname + `/../../../${fileName}`);
    // res.sendFile(__dirname + '../../../export.xlsx');
    res.set({
      'Content-Type': 'application/CSV',
      'Content-Length': buffer.length,
    });

    stream.pipe(res);
    return stream;
  }

  // @Post('excel/holdings')
  // async getExcelHoldings(
  //   @Body('userID') userID: string,
  //   // @Body('fileName') filename: string,
  //   @Body('exchange') exchange: string,
  //   // @Body('financialYear') financialYear: string,
  //   // @Body('method') method: string,
  //   // @Res() res: Response,
  // ) {
  //   const fileName = await this.exchangesWrapperService.getExcelSheetHoldings(
  //     exchange,
  //     userID,
  //     // method,
  //     // filename === '' ? new Date().getTime().toString() : filename,
  //     // financialYear,
  //   );
  //   return '';
  //   // const buffer = await fs.readFileSync(__dirname + `/../../../${fileName}`);
  //   // const stream = fs.createReadStream(__dirname + `/../../../${fileName}`);
  //   // // res.sendFile(__dirname + '../../../export.xlsx');
  //   // res.set({
  //   //   'Content-Type': 'application/CSV',
  //   //   'Content-Length': buffer.length,
  //   // });

  //   // stream.pipe(res);
  //   // return stream;
  // }

  @Post('pdf')
  async getPDF(
    @Body('userID') userID: string,
    @Body('fileName') filename: string,
    @Body('exchange') exchange: string,
    @Body('method') method: string,
    @Body('reportType') reportType: string,
    @Body('financialYear') financialYear: string,
    @Res() res: Response,
  ) {
    let fileName = '';
    if (reportType.toLowerCase() === 'cgtreport') {
      fileName = await this.exchangesWrapperService.getPDF(
        exchange,
        userID,
        method,
        filename === '' ? new Date().getTime().toString() : filename,
        financialYear,
      );
    } else if (reportType.toLowerCase() === 'investmentreport') {
      fileName = await this.exchangesWrapperService.getPDFHoldings(
        exchange,
        userID,
        method,
        filename === '' ? new Date().getTime().toString() : filename,
        financialYear,
      );
    } else {
      fileName = await this.exchangesWrapperService.getPDFTransactions(
        exchange,
        userID,
        method,
        filename === '' ? new Date().getTime().toString() : filename,
        financialYear,
      );
    }

    const stream = fs.createReadStream(
      path.join(__dirname, `/../../${fileName}`),
    );
    // res.sendFile(__dirname + '../../../export.xlsx');

    stream.pipe(res);
    return stream;
  }

  @Post('excel/:client')
  async getExcelForClient(
    @Body('userID') userID: string,
    @Body('fileName') filename: string,
    @Body('exchange') exchange: string,
    @Body('financialYear') financialYear: string,
    @Body('method') method: string,
    @Body('reportType') reportType: string,
    @Param('client') client: string,
    @Res() res: Response,
  ) {
    const date = new Date();
    let fiscalYear = '';
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month > 6) {
      fiscalYear = year + '-' + (year + 1);
    } else {
      fiscalYear = year - 1 + '-' + year;
    }
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );

    const userPlan = await this.userPlanService.findByUserIDAndFiscalYear(
      userID,
      fiscalYear,
    );

    if (userPlan.length > 0) {
      const voucherNumbers = userPlan[0].formula[fiscalYear];
      const voucherUsedNumbers =
        await this.vouchersHistoryService.findClientsByFiscalYear(
          userID,
          fiscalYear,
        );

      if (
        voucherNumbers < voucherUsedNumbers ||
        (await this.vouchersHistoryService.findByClientID(
          userID,
          clientData.id,
          financialYear,
          fiscalYear,
        ))
      ) {
        let fileName = '';

        if (reportType.toLowerCase() === 'cgtreport') {
          fileName = await this.exchangesWrapperService.getExcelSheetClient(
            userID,
            exchange,
            clientData.id,
            method,
            filename === '' ? new Date().getTime().toString() : filename,
            financialYear,
            fiscalYear,
          );
        } else if (reportType.toLowerCase() === 'investmentreport') {
          fileName =
            await this.exchangesWrapperService.getExcelSheetClientHoldings(
              userID,
              exchange,
              clientData.id,
              method,
              filename === '' ? new Date().getTime().toString() : filename,
              financialYear,
              fiscalYear,
            );
        } else {
          fileName =
            await this.exchangesWrapperService.getExcelSheetClientTransactions(
              userID,
              exchange,
              clientData.id,
              method,
              filename === '' ? new Date().getTime().toString() : filename,
              financialYear,
              fiscalYear,
            );
        }
        if (
          fileName &&
          !(await this.vouchersHistoryService.findByClientID(
            userID,
            clientData.id,
            financialYear,
            fiscalYear,
          ))
        ) {
          await this.vouchersHistoryService.create({
            clientID: clientData.id,
            accountantID: userID,
            fiscalYear: financialYear,
            creditYear: fiscalYear,
          });
          // let balanceAddition = 0;
          const ledgers = await this.ledgersService.findByUserAndFiscalYear(
            userID,
            fiscalYear,
          );

          let sortedLedgers = ledgers.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

          const client = await this.usersService.findOne(clientData.id);
          const ledger = await this.ledgersService.create({
            accountantID: userID,
            date: new Date().getTime().toString(),
            balance:
              (sortedLedgers.length > 0 ? sortedLedgers.at(-1).balance : 1) - 1,
            credit: null,
            fiscalYear,
            user: client,
          });
        }
        const buffer = await fs.readFileSync(
          __dirname + `/../../../${fileName}`,
        );
        const stream = fs.createReadStream(__dirname + `/../../../${fileName}`);
        // res.sendFile(__dirname + '../../../export.xlsx');
        res.set({
          'Content-Type': 'application/CSV',
          'Content-Length': buffer.length,
        });

        stream.pipe(res);
        return stream;
      } else {
        throw new HttpException(
          'All Vouchers have been used',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'You donot have a plan for this fiscal Year',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post('pdf/:client')
  async getPDFForClient(
    @Body('userID') userID: string,
    @Body('fileName') filename: string,
    @Body('exchange') exchange: string,
    @Body('method') method: string,
    @Body('reportType') reportType: string,
    @Body('financialYear') financialYear: string,
    @Param('client') client: string,
    @Res() res: Response,
  ) {
    const date = new Date();
    let fiscalYear = '';
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month > 6) {
      fiscalYear = year + '-' + (year + 1);
    } else {
      fiscalYear = year - 1 + '-' + year;
    }
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );

    const userPlan = await this.userPlanService.findByUserIDAndFiscalYear(
      userID,
      fiscalYear,
    );

    if (userPlan.length > 0) {
      const voucherNumbers = userPlan[0].formula[fiscalYear];
      const voucherUsedNumbers =
        await this.vouchersHistoryService.findClientsByFiscalYear(
          userID,
          fiscalYear,
        );

      if (
        voucherNumbers > voucherUsedNumbers ||
        (await this.vouchersHistoryService.findByClientID(
          userID,
          clientData.id,
          financialYear,
          fiscalYear,
        )) !== undefined
      ) {
        let fileName = '';
        if (reportType.toLowerCase() === 'cgtreport') {
          fileName = await this.exchangesWrapperService.getPDFClient(
            userID,
            exchange,
            clientData.id,
            method,
            filename === '' ? new Date().getTime().toString() : filename,
            financialYear,
            fiscalYear,
          );
        } else if (reportType.toLowerCase() === 'investmentreport') {
          fileName = await this.exchangesWrapperService.getPDFClientHoldings(
            userID,
            exchange,
            clientData.id,
            method,
            filename === '' ? new Date().getTime().toString() : filename,
            financialYear,
            fiscalYear,
          );
        } else {
          fileName =
            await this.exchangesWrapperService.getPDFClientTransactions(
              userID,
              exchange,
              clientData.id,
              method,
              filename === '' ? new Date().getTime().toString() : filename,
              financialYear,
              fiscalYear,
            );
        }

        if (
          fileName &&
          (await this.vouchersHistoryService.findByClientID(
            userID,
            clientData.id,
            financialYear,
            fiscalYear,
          )) === undefined
        ) {
          await this.vouchersHistoryService.create({
            clientID: clientData.id,
            accountantID: userID,
            fiscalYear: financialYear,
            creditYear: fiscalYear,
          });

          // let balanceAddition = 0;
          const ledgers = await this.ledgersService.findByUserAndFiscalYear(
            userID,
            fiscalYear,
          );

          let sortedLedgers = ledgers.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          // const indexToUpdate = Number.POSITIVE_INFINITY;
          // for (let i = 0; i < sortedLedgers.length; i++) {
          //   if (sortedLedgers[i].balance > 0) {
          //     sortedLedgers[i].balance -= 1;
          //     break;
          //   }
          // }

          // for (let i = 0; i < sortedLedgers.length; i++) {
          //   balanceAddition += sortedLedgers[i].balance;
          // }

          // if (indexToUpdate !== Number.POSITIVE_INFINITY) {
          //   await this.ledgersService.update(
          //     sortedLedgers[indexToUpdate].id,
          //     sortedLedgers[indexToUpdate],
          //   );
          // }
          const client = await this.usersService.findOne(clientData.id);
          const ledger = await this.ledgersService.create({
            accountantID: userID,
            date: new Date().getTime().toString(),
            balance:
              (sortedLedgers.length > 0 ? sortedLedgers.at(-1).balance : 1) - 1,
            credit: null,
            fiscalYear,
            user: client,
          });
        }

        const buffer = await fs.readFileSync(
          path.join(__dirname, `/../../${fileName}`),
        );
        const stream = fs.createReadStream(
          path.join(__dirname, `/../../${fileName}`),
        );
        // res.sendFile(__dirname + '../../../export.xlsx');

        stream.pipe(res);
        return stream;
      } else {
        throw new HttpException(
          'All Vouchers have been used',
          HttpStatus.CONFLICT,
        );
      }
    } else {
      throw new HttpException(
        'You do not have a plan for this fiscal Year',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('download/report/:filename')
  async getReport(
    @Body('userID') userID: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    let stream;
    // res.sendFile(__dirname + '../../../export.xlsx');

    if (filename.split('.')[1] === 'pdf') {
      const buffer = await fs.readFileSync(
        path.join(__dirname, `/../../${filename}`),
      );
      stream = fs.createReadStream(path.join(__dirname, `/../../${filename}`));
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
    } else if (filename.split('.')[1] === 'csv') {
      const buffer = await fs.readFileSync(
        path.join(__dirname, `/../../../${filename}`),
      );
      stream = fs.createReadStream(
        path.join(__dirname, `/../../../${filename}`),
      );
      res.set({
        'Content-Type': 'application/CSV',
        'Content-Length': buffer.length,
      });
    }

    stream.pipe(res);
    return stream;
  }

  @Get('download/report/:filename/:client')
  async getReportClient(
    @Body('userID') userID: string,
    @Param('filename') filename: string,
    @Res() res: Response,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    let stream;
    // res.sendFile(__dirname + '../../../export.xlsx');

    if (filename.split('.')[1] === 'pdf') {
      const buffer = await fs.readFileSync(
        path.join(__dirname, `/../../${filename}`),
      );
      stream = fs.createReadStream(path.join(__dirname, `/../../${filename}`));
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.length,
      });
    } else if (filename.split('.')[1] === 'csv') {
      const buffer = await fs.readFileSync(
        path.join(__dirname, `/../../../${filename}`),
      );
      stream = fs.createReadStream(
        path.join(__dirname, `/../../../${filename}`),
      );
      res.set({
        'Content-Type': 'application/CSV',
        'Content-Length': buffer.length,
      });
    }

    stream.pipe(res);
    return stream;
  }

  @Delete('delete/reports')
  async deleteReports(
    @Body('userID') userID: string,
    @Body('fileNames') filenames,
  ) {
    return await this.exchangesWrapperService.deleteReports(userID, filenames);
  }

  @Delete('delete/reports/:client')
  async deleteReportsClient(
    @Body('userID') userID: string,
    @Body('fileNames') filenames,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      userID,
      client,
    );
    return await this.exchangesWrapperService.deleteReports(
      clientData.id,
      filenames,
    );
  }

  // @Post('download/reports')
  // async downloadReports(
  //   @Body('userID') userID: string,
  //   @Body('fileNames') filenames,
  //   @Res() res: Response,
  // ) {
  //   let streams = [];
  //   let stream = '';
  //   filenames.forEach((filename) => {
  //     if (filename.split('.')[1] === 'pdf') {
  //       const buffer = fs.readFileSync(
  //         path.join(__dirname, `/../../${filename}`),
  //       );
  //       streams.push(
  //         fs.createReadStream(path.join(__dirname, `/../../${filename}`)),
  //       );
  //       // res.set({
  //       //   'Content-Type': 'application/pdf',
  //       //   'Content-Length': buffer.length,
  //       // });
  //     } else if (filename.split('.')[1] === 'xlsx') {
  //       const buffer = fs.readFileSync(
  //         path.join(__dirname, `/../../../${filename}`),
  //       );
  //       streams.push(
  //         fs.createReadStream(path.join(__dirname, `/../../../${filename}`)),
  //       );
  //       // res.set({
  //       //   'Content-Type':
  //       //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       //   'Content-Length': buffer.length,
  //       // });
  //     }

  //     // stream.pipe(res);
  //   });
  //   new MultiStream(streams).pipe(res);
  //   return stream;
  //   // return streams;
  // }

  // @Post('download/reports')

  // async downloadReports(
  //   @Body('userID') userID: string,
  //   @Body('fileNames') filenames,
  //   @Res() res: Response,
  // ) {
  //   const form = new FormData();
  //   filenames.forEach((filename) => {
  //     if (filename.split('.')[1] === 'pdf') {
  //       form.append(
  //         filename,
  //         fs
  //           .readFileSync(path.join(__dirname, `/../../${filename}`))
  //           .toString(),

  //         filename,
  //       );
  //     } else if (filename.split('.')[1] === 'xlsx') {
  //       form.append(
  //         filename,
  //         fs
  //           .readFileSync(path.join(__dirname, `/../../../${filename}`))
  //           .toString(),

  //         filename,
  //       );
  //     }
  //   });

  //   res.writeHead(200, {
  //     'Content-Type': `multipart/form-data;`,
  //     'Content-Length': form.getLengthSync(),
  //     'Access-Control-Allow-Credentials': 'true',
  //     'Access-Control-Allow-Origin': 'https://example.com',
  //   });
  //   res.write(form.getBuffer());
  //   res.end();
  // }

  @Post('download/reports')
  async downloadReports(
    @Body('userID') userID: string,
    @Body('fileNames') filenames,
    @Res() res: Response,
  ) {
    let streams = [];
    let files = [];
    var zip = new AdmZip();
    filenames.forEach((filename) => {
      if (filename.split('.')[1] === 'pdf') {
        const content = fs.readFileSync(
          path.join(__dirname, `/../../${filename}`),
        );
        zip.addFile(
          path.join(__dirname, `/../../${filename}`),
          Buffer.from(content.toString(), 'utf8'),
          'entry comment goes here',
        );
      } else if (filename.split('.')[1] === 'xlsx') {
        const content = fs.readFileSync(
          path.join(__dirname, `/../../../${filename}`),
        );
        zip.addFile(
          path.join(__dirname, `/../../../${filename}`),
          Buffer.from(content.toString(), 'utf8'),
          'entry comment goes here',
        );
      }
    });
    zip.writeZip(path.join(__dirname, 'reports.zip'));
    //@ts-ignore
    // res.zip(files);
    // new MultiStream(streams).pipe(res);
    return streams;
    // return streams;
  }

  @Get('sync/:exchange/:name')
  async getTradesSynchronized(
    @Body() body,
    @Param('exchange') exchange: string,
    @Param('name') name: string,
  ) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      name,
    );

    const exchangePairsFiltered =
      exchangePairs.length > 0
        ? exchangePairs.filter((exchanges) => exchanges.name === name)[0]
        : undefined;

    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return JSON.parse(
        JSON.stringify(
          await this.exchangesWrapperService.getTradesSync(
            exchange,
            exchangePairsFiltered.keys,
            body.userID,
          ),
        ),
      );
    }
    return [];
  }

  @Get('sync/:exchange/:name/:client')
  async getTradesSynchronizedForClient(
    @Body() body,
    @Param('exchange') exchange: string,
    @Param('name') name: string,
    @Param('client') client: string,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      body.userID,
      client,
    );
    const exchangePairs = await this.exchangePairService.findOne(
      clientData.id,
      name,
    );

    const exchangePairsFiltered =
      exchangePairs.length > 0
        ? exchangePairs.filter((exchanges) => exchanges.name === name)[0]
        : undefined;

    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return JSON.parse(
        JSON.stringify(
          await this.exchangesWrapperService.getTradesSync(
            exchange,
            exchangePairsFiltered.keys,
            clientData.id,
          ),
        ),
      );
    }
    return [];
  }

  @Get('trades/:exchange/:algorithm')
  async getTrades(
    @Param('exchange') exchange: string,
    @Param('algorithm') algorithm: string,
    @Body() body,
  ) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      exchange,
    );
    const exchangePairsFiltered =
      exchangePairs.length > 0
        ? exchangePairs.filter(
            (exchanges) => exchanges.exchange === exchange,
          )[0]
        : undefined;

    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return await this.exchangesWrapperService.getTrades(
        exchange,
        body.userID,
        algorithm,
      );
    }
    return [];
  }

  @Get('account/:exchange')
  async getAccount(@Param('exchange') exchange: string, @Body() body) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      exchange,
    );
    const exchangePairsFiltered = exchangePairs[0];
    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return this.exchangesWrapperService.getAccount(
        exchange,
        exchangePairsFiltered.keys,
      );
    }
    return [];
  }

  @Get('holdings/:exchange')
  async getHoldingsFromTransactions(
    @Param('exchange') exchange: string,
    @Body() body,
  ) {
    return this.exchangesWrapperService.getHoldings(body.userID, exchange);
  }

  @Get('holdings/:exchange/:client')
  async getHoldingsFromTransactionsForClient(
    @Param('exchange') exchange: string,
    @Param('client') client: string,
    @Body() body,
  ) {
    const clientData = await this.exchangePairService.checkUserValidity(
      body.userID,
      client,
    );
    return this.exchangesWrapperService.getHoldings(clientData.id, exchange);
  }

  @Get('deposits/:exchange')
  async getDeposits(@Param('exchange') exchange: string, @Body() body) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      exchange,
    );
    const exchangePairsFiltered = exchangePairs[0];
    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return this.exchangesWrapperService.getDeposits(
        exchange,
        exchangePairsFiltered.keys,
      );
    }
    return [];
  }

  @Get('withdrawals/:exchange')
  async getWithdrawals(@Param('exchange') exchange: string, @Body() body) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      exchange,
    );
    const exchangePairsFiltered = exchangePairs[0];
    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return this.exchangesWrapperService.getWithdrawals(
        exchange,
        exchangePairsFiltered.keys,
      );
    }
    return [];
  }

  @Get('assetDividends/binance')
  async getAssetDividends(@Body() body) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      'binance',
    );
    const exchangePairsFiltered = exchangePairs[0];
    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return this.exchangesWrapperService.getAssetDividend(
        exchangePairsFiltered.keys,
      );
    }
    return [];
  }

  @Get('stackingHistory/swyftx')
  async getStackingHistory(@Body() body) {
    const exchangePairs = await this.exchangePairService.findOne(
      body.userID,
      'swyftx',
    );
    const exchangePairsFiltered = exchangePairs[0];
    if (
      exchangePairsFiltered !== undefined &&
      exchangePairsFiltered.keys &&
      exchangePairsFiltered.keys.length > 0
    ) {
      return this.exchangesWrapperService.getStackingHistory(
        exchangePairsFiltered.keys,
      );
    }
    return [];
  }
}
