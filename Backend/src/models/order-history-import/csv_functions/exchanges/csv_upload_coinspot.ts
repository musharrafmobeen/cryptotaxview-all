import { BadRequestException } from '@nestjs/common';
import { convertDate } from '../common/date';
import { readFileSync, unlinkSync } from 'fs';
import { coinSpotCsv } from 'src/common/contants/order-history-import-csv-headers';
import { validateEntryRecord } from '../common/validateEntries';
// import { csvConvertor } from '../convertor';
// import axios from 'axios';

export const validateFileCoinspot = async (
  filePath: string,
  userID: string,
  exchange: string,
) => {
  // csvConvertor(filePath, userID, exchange);
  const csvFile = readFileSync(filePath);
  const csvData = csvFile.toString().replace(/(?:\\[rn]|[\r\n]+)+/g, '\n');

  // const dt = await axios({
  //   baseURL: 'http://127.0.0.1:5005',
  //   url: '/',
  //   method: 'post',
  //   data: { csvData, exchange },
  // });

  // console.log(dt.data);

  let csvHeaders = csvData.split('\n')[0].split(',');
  csvHeaders = csvHeaders.map((field) =>
    field.toString().trim().replace(/\"/g, ''),
  );
  csvHeaders[csvHeaders.length - 1] = csvHeaders[csvHeaders.length - 1].replace(
    '\r',
    '',
  );
  let errorMsg = '';
  coinSpotCsv.forEach((item) => {
    if (!csvHeaders.includes(item.key)) {
      errorMsg = errorMsg + '\n' + `[${item.key}]`;
    }
  });
  if (errorMsg !== '') {
    errorMsg = 'Following Fields Missing ' + errorMsg;
    unlinkSync(filePath);
    throw new BadRequestException(errorMsg);
  }
  let parsedCsvData = csvData.split('\n');
  parsedCsvData = parsedCsvData.slice(1, parsedCsvData.length);
  const validEntryRecords: any = [];
  for (let i = 0; i <= parsedCsvData.length - 1; i++) {
    if (parsedCsvData[i] && parsedCsvData[i] !== '') {
      const record = parsedCsvData[i].split(',');
      record[0] = convertDate(record[0]);
      console.log(record[0]);
      const result = validateEntryRecord(
        record[0],
        record[1],
        record[2],
        record[3],
        record[4],
        record[5],
        record[6],
        record[7],
        record[8],
        record[9],
        record[10],
      );
      if (!result) {
        unlinkSync(filePath);
        throw new BadRequestException('Data validation Failed.');
      } else validEntryRecords.push({ ...result, userID, exchange });
    }
  }
  return validEntryRecords;
};
