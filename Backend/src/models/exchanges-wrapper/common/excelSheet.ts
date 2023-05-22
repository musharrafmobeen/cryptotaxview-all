import * as ExcelJS from 'exceljs';
import { object } from 'joi';

export const createExcelFile = async (excelData, filename, method) => {
  excelData = excelData.sort((a, b) => b.timestamp - a.timestamp);

  // write to a file

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Orders');

  sheet.columns = [
    { header: 'Exchange', key: 'exchange' },
    { header: 'DateTime(UTC)', key: 'datetime' },
    { header: 'OrderNo', key: 'orderNo' },
    { header: 'Symbol', key: 'pair' },
    { header: 'Type', key: 'type' },
    { header: 'Order Price', key: 'orderPrice' },
    { header: 'Order Amount', key: 'orderAmount' },
    { header: 'Trading total', key: 'tradingTotal' },
    { header: 'Fee', key: 'fee' },
    { header: 'CGT', key: 'cgt' },
    { header: 'Bought For', key: 'boughtFor' },
    { header: 'Sold For', key: 'soldFor' },
  ];

  const rows = excelData.map((obj) => ({
    exchange: obj.exchange,
    datetime: obj.datetime,
    orderNo: obj.id,
    pair: obj.symbol,
    type: obj.side,
    orderPrice: obj.price,
    orderAmount: obj.amount,
    tradingTotal: obj.cost,
    cgt: method === 'fifo' ? obj.cgt.fifo : obj.cgt.lifo,
    fee: obj.fee.cost,
    boughtFor:
      method === 'fifo'
        ? obj.fifoCGTDetail.boughtFor
        : obj.lifoCGTDetail.boughtFor,
    soldFor:
      method === 'fifo' ? obj.fifoCGTDetail.soldFor : obj.lifoCGTDetail.soldFor,
  }));

  sheet.addRows(rows);

  const excelSheetName = `${filename}.csv`;
  await workbook.xlsx.writeFile(excelSheetName);

  return excelSheetName;
};
export const createExcelFileTransactions = async (
  excelData,
  filename,
  method,
) => {
  excelData = excelData.sort((a, b) => b.timestamp - a.timestamp);

  // write to a file

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('transactions');

  sheet.columns = [
    { header: 'Exchange', key: 'exchange' },
    { header: 'DateTime(UTC)', key: 'datetime' },
    { header: 'OrderNo', key: 'orderNo' },
    { header: 'Symbol', key: 'pair' },
    { header: 'Type', key: 'type' },
    { header: 'Order Price', key: 'orderPrice' },
    { header: 'Order Amount', key: 'orderAmount' },
    { header: 'Trading total', key: 'tradingTotal' },
    { header: 'Fee', key: 'fee' },
    // { header: 'CGT', key: 'cgt' },
    // { header: 'Bought For', key: 'boughtFor' },
    // { header: 'Sold For', key: 'soldFor' },
  ];

  const rows = excelData.map((obj) => ({
    exchange: obj.exchange,
    datetime: obj.datetime,
    orderNo: obj.id,
    pair: obj.symbol,
    type: obj.side,
    orderPrice: obj.price,
    orderAmount: obj.amount,
    tradingTotal: obj.cost,
    // cgt: method === 'fifo' ? obj.cgt.fifo : obj.cgt.lifo,
    fee: obj.fee.cost,
    //   boughtFor:
    //     method === 'fifo'
    //       ? obj.fifoCGTDetail.boughtFor
    //       : obj.lifoCGTDetail.boughtFor,
    //   soldFor:
    //     method === 'fifo' ? obj.fifoCGTDetail.soldFor : obj.lifoCGTDetail.soldFor,
  }));

  sheet.addRows(rows);

  const excelSheetName = `${filename}.csv`;
  await workbook.xlsx.writeFile(excelSheetName);

  return excelSheetName;
};

export const createExcelFileInvestment = async (
  excelData,
  filename,
  method,
) => {
  // excelData = excelData.sort((a, b) => b.timestamp - a.timestamp);

  // write to a file

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Holdings');

  sheet.columns = [
    // { header: 'Exchange', key: 'exchange' },
    { header: 'Currency', key: 'currency' },
    { header: 'Op Bal QT', key: 'opBalQT' },
    { header: 'Op Cost Base', key: 'opCostBase' },
    { header: 'Purchases QTY', key: 'purchasesQTY' },
    { header: 'Purchase Price', key: 'purchasePrice' },
    { header: 'Sale QTY', key: 'saleQTY' },
    { header: 'Cost of Sold Qty', key: 'costOfSoldQty' },
    { header: 'Closing Bal QT', key: 'closingBalQT' },
    { header: 'Closing Cost Base', key: 'closingCostBase' },
    { header: 'Market Value', key: 'marketValue' },
    { header: 'Unrealized Gain/Loss', key: 'unrealized' },
  ];

  const rows = excelData.map((obj) => ({
    // exchange: obj.exchange,
    currency: obj.currency,
    opBalQT: obj.opBalQT,
    opCostBase: obj.opCostBase,
    purchasesQTY: obj.purchasesQTY,
    purchasePrice: obj.purchasePrice,
    saleQTY: obj.saleQTY,
    costOfSoldQty: obj.costOfSoldQty,
    closingBalQT: obj.closingBalQT,
    closingCostBase: obj.closingCostBase,
    marketValue: obj.marketValue,
    unrealized: obj.unrealized,
  }));

  sheet.addRows(rows);

  const excelSheetName = `${filename}.csv`;
  await workbook.xlsx.writeFile(excelSheetName);

  return excelSheetName;
};
