import { BadRequestException } from '@nestjs/common';
import { convertDate } from '../common/date';
import { readFileSync, unlinkSync } from 'fs';
import { swyftxCsv } from 'src/common/contants/order-history-import-csv-headers';
import { validateEntryRecord } from '../common/validateEntries';
// import axios from 'axios';

export const validateFileSwyftx = async (
  filePath: string,
  userID: string,
  exchange: string,
) => {
  // csvConvertor(filePath, userID, exchange);
  const csvFile = readFileSync(filePath);
  const csvData = csvFile.toString().replace(/(?:\\[rn]|[\r\n]+)+/g, '\n');

  // await axios({
  //   baseURL: 'http://127.0.0.1:5005',
  //   url: '/',
  //   method: 'post',
  //   data: { csvData, exchange: 'swyftx' },
  // });

  const dataArray = csvData.split('\n');
  const data = [];
  let count = 0;
  for (let i = 0; i < dataArray.length; i++) {
    if (
      dataArray[i] !== ',,,,,,,,,,,,,,,,,,,' &&
      !dataArray[i].includes('sub total') &&
      count < 1 &&
      !dataArray[i].includes('Fiat Transactions') &&
      !dataArray[i].includes('Date') &&
      !dataArray[i].includes('Crypto Transactions')
    ) {
      data.push(dataArray[i]);
    } else if (dataArray[i].includes('sub total')) {
      count += 1;
    }
  }
  let csvHeaders = csvData.split('\n')[1].split(',');
  csvHeaders = csvHeaders.map((field) =>
    field.toString().trim().replace(/\"/g, ''),
  );
  csvHeaders[csvHeaders.length - 1] = csvHeaders[csvHeaders.length - 1].replace(
    '\r',
    '',
  );
  let errorMsg = '';
  swyftxCsv.forEach((item) => {
    if (!csvHeaders.includes(item.key)) {
      errorMsg = errorMsg + '\n' + `[${item.key}]`;
    }
  });
  if (errorMsg !== '') {
    errorMsg = 'Following Fields Missing ' + errorMsg;
    unlinkSync(filePath);
    throw new BadRequestException(errorMsg);
  }

  const validEntryRecords: any = [];
  for (let i = 0; i <= data.length - 1; i++) {
    if (data[i] && data[i] !== '') {
      const record = data[i].split(',');
      record[0] = convertDate(record[0] + ' ' + record[1]);
      const result = validateEntryRecord(
        record[0],
        record[2],
        record[3] + '/' + record[5],
        record[4],
        (parseFloat(record[6]) / parseFloat(record[4])).toString(),
        (parseFloat(record[4]) / parseFloat(record[6])).toString(),
        record[10],
        (parseFloat(record[10]) + parseFloat(record[12])).toString(),
        record[12],
        record[9],
        parseFloat(record[6]).toString(),
      );
      if (!result) {
        unlinkSync(filePath);
        throw new BadRequestException('Data validation Failed.');
      } else validEntryRecords.push({ ...result, userID, exchange });
    }
  }
  return validEntryRecords;
};
