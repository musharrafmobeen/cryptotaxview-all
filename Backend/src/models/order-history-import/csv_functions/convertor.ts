import { readFileSync, unlinkSync } from 'fs';
import * as csv from 'csvtojson';

export const csvConvertor = async (
  filePath: string,
  userID: string,
  exchange: string,
) => {
  const csvData = await csv().fromFile(filePath);
  if (csvData.length > 0) {
    console.log(Object.keys(csvData[0]));
    console.log(csvData);
  }
};
