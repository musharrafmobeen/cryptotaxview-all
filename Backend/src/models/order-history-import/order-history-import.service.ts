import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateOrderHistoryImportDto } from './dto/create-order-history-import.dto';
import { UpdateOrderHistoryImportDto } from './dto/update-order-history-import.dto';
import { OrderHistoryImportRepository } from './order-history-import.repository';
import { TaxCalculationService } from '../exchanges-wrapper/algorithms/fifoAlogorithm';
import { events } from 'src/common/events/eventEmitter';
// import { TransactionsService } from '../transactions/transactions.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionsRepository } from '../transactions/transactions.repository';
import { validateFileCoinspot } from './csv_functions/exchanges/csv_upload_coinspot';
import { validateFileSwyftx } from './csv_functions/exchanges/csv_upload_swyftx';
import axios from 'axios';
import { readFileSync } from 'fs';
import { convertDate } from './csv_functions/common/date';
import { isDate } from 'moment';
import * as moment from 'moment';
import { UserFilesService } from '../user-files/user-files.service';

@Injectable()
export class OrderHistoryImportService {
  constructor(
    private readonly transactionRepository: TransactionsRepository,
    private readonly orderHistoryImportRepository: OrderHistoryImportRepository,
    private readonly userFileRepository: UserFilesService,
    private readonly taxCalculationService: TaxCalculationService,
  ) {}
  private uploadCSVExchanges = {
    coinspot: validateFileCoinspot,
    swyftx: validateFileSwyftx,
  };
  createOrderHistoryImport(
    createOrderHistoryImportDto: CreateOrderHistoryImportDto,
  ) {
    return this.orderHistoryImportRepository.createOrderHistoryImports(
      createOrderHistoryImportDto,
    );
  }

  async createCsvRecords(
    file: Express.Multer.File,
    userID: string,
    exchange: string,
    insertionType: string,
  ) {
    if (!file)
      throw new BadRequestException(
        'File Data Validation Failed. Cannot Upload file.',
      );
    // const validRecords = await this.uploadCSVExchanges[exchange](
    //   file.path,
    //   userID,
    //   exchange,
    // );
    let createdUserFile;
    try {
      const csvFile = readFileSync(file.path);
      const csvData = csvFile.toString().replace(/(?:\\[rn]|[\r\n]+)+/g, '\n');

      const result = await axios({
        baseURL: `http://${process.env.PYTHON_BACKEND_IP}:${process.env.PYTHON_BACKEND_PORT}`,
        url: '/',
        method: 'post',
        data: { csvData, exchange },
      });

      // console.log(result.data);

      const transactionData =
        typeof result.data === 'string' ? JSON.parse(result.data) : result.data;

      const transformedTransactions = [];
      for (let i = 0; i < transactionData.length; i++) {
        transformedTransactions.push({
          datetime: dateChecker(convertDate(transactionData[i].datetime)),
          side: transactionData[i].side.toLowerCase(),
          symbol: transactionData[i].symbol,
          amount: Math.abs(parseFloat(transactionData[i].amount)),
          fee: {
            cost: Math.abs(parseFloat(transactionData[i].fee)),
            currency: transactionData[i].symbol.includes('/')
              ? transactionData[i].symbol.split('/')[1]
              : transactionData[i].symbol,
          },
          cost: Math.abs(parseFloat(transactionData[i].cost)),
          price: Math.abs(parseFloat(transactionData[i].price)),
          priceInAud: Math.abs(parseFloat(transactionData[i].priceInAud)),
          exchange,
          user: userID,
          source: 'csv',
          accountAddress: transactionData[i].accountAddress
            ? transactionData[i].accountAddress.toString().toLowerCase()
            : '',
        });
      }

      const userFiles = await this.userFileRepository.findAll(userID, false);
      let fileCount = 0;
      for (let i = 0; i < userFiles.length; i++) {
        if (userFiles[i].exchange === exchange) {
          fileCount++;
        }
      }

      if (fileCount > 0) {
        fileCount = parseInt(userFiles.at(-1).fileName.split('-')[1]);
      }

      const fileName = `${exchange}-${fileCount + 1}`;

      if (insertionType === 'replace') {
        createdUserFile = await this.userFileRepository.create(
          {
            exchange,
            user: userID,
            fileName,
            createdAt: new Date().toUTCString(),
            type: false,
            originalFileName: file.filename,
          },
          userID,
        );
      } else {
        createdUserFile = await this.userFileRepository.createAppend(
          {
            exchange,
            user: userID,
            fileName,
            createdAt: new Date().toUTCString(),
            type: false,
            originalFileName: file.filename,
          },
          userID,
        );
      }

      let existingTransactions =
        await this.transactionRepository.findAllTransactions(userID, exchange);
      if (insertionType === 'replace')
        existingTransactions = existingTransactions.filter(
          (trx) => trx.source !== 'csv',
        );
      await this.transactionRepository.removeAllApiByName(userID, exchange);

      const data: any = await this.taxCalculationService.taxCalculator([
        ...transformedTransactions,
        ...existingTransactions,
      ]);

      for (let i = 0; i < data.length; i++) {
        try {
          await this.transactionRepository.create(
            new CreateTransactionDto({
              ...data[i],
              accountAddress:
                data[i].accountAddress === '0' ? '' : data[i].accountAddress,
              fifoRelatedTransactions: JSON.stringify(
                data[i].fifoRelatedTransactions,
              ),
              lifoRelatedTransactions: JSON.stringify(
                data[i].lifoRelatedTransactions,
              ),
              fileName: data[i].fileName !== '' ? data[i].fileName : fileName,
            }),
          );
        } catch (e) {}
      }

      events.eventEmit();

      return data;
    } catch (e) {
      if (createdUserFile) {
        await this.userFileRepository.remove(createdUserFile.id);
      }
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
  }

  async getCsvData(userID: string) {
    return await this.taxCalculationService.taxCalculator(
      await this.orderHistoryImportRepository.getCsvData(userID),
    );
  }

  updateOrderHistoryImport(
    orderId: string,
    updateOrderHistoryImportDto: UpdateOrderHistoryImportDto,
  ) {
    return this.orderHistoryImportRepository.updateOrderHistoryImport(
      orderId,
      updateOrderHistoryImportDto,
    );
  }

  getOrderHistoryImports() {
    return this.orderHistoryImportRepository.getOrderHistoryImports();
  }

  removeTransactions(ids: string[]) {
    return this.orderHistoryImportRepository.removeTransactions(ids);
  }

  convertDate(date: string) {
    const datetime = date.split(' ');
    if ((datetime[2] && datetime[2] === 'AM') || datetime[2] === 'PM') {
      return date;
    }
    const time = datetime[1].split(':');
    const day = datetime[0].split('/')[0];
    const dates = day.length > 1 ? datetime[0] : `0${datetime[0]}`;
    if (parseInt(time[0]) > 12) {
      const convertedTime = (parseInt(time[0]) - 12).toString();
      const zero = convertedTime.length > 1 ? ' ' : ' 0';
      return dates + `${zero}${parseInt(convertedTime)}:` + time[1] + ' PM';
    }
    const convertedTime = time[0];
    const zero = convertedTime.length > 1 ? ' ' : ' 0';
    return dates + `${zero}${parseInt(convertedTime)}:` + time[1] + ' AM';
  }
}

const dateChecker = (transactionDate) => {
  let date = moment(transactionDate);
  if (!isDate(date))
    date = moment(transactionDate, 'DD/MM/YYYY hh:mm:ss A', true);
  if (!isDate(new Date(date.toString())) || !moment(date).isValid())
    return null;
  return date;
};
