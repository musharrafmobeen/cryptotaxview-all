import { isDate } from 'moment';
import * as moment from 'moment';
import { CreateOrderHistoryImportDto } from '../../dto/create-order-history-import.dto';

export const validateEntryRecord = (
  transactionDate: string,
  type: string,
  market: string,
  amount: string,
  rateIncFee: string,
  rateExcFee: string,
  fee: string,
  feeAudIncGst: string,
  gstAud: string,
  totalAud: string,
  totalIncGst: string,
) => {
  let date;
  date = moment(transactionDate);
  // try {
  //   date = moment(transactionDate);
  //   console.log('date', date);
  // } catch (err) {
  //   console.log('ERROR: ', err);
  //   return null;
  // }
  if (!isDate(date))
    date = moment(transactionDate, 'DD/MM/YYYY hh:mm:ss A', true);
  if (!isDate(new Date(date.toString())) || !moment(date).isValid())
    return null;
  const trans_amount = Number(amount);
  if (Number.isNaN(trans_amount)) return null;
  const trans_rate_inc_fee = Number(rateIncFee);
  if (Number.isNaN(trans_rate_inc_fee)) return null;
  const trans_rate_exc_fee = Number(rateExcFee);
  if (Number.isNaN(trans_rate_exc_fee)) return null;
  const trans_fee_arr = fee.split(' ');
  const trans_fee = Number(trans_fee_arr[0]);
  if (Number.isNaN(trans_fee)) return null;
  const trans_fee_aud_inc_gst = Number(feeAudIncGst);
  if (Number.isNaN(trans_fee_aud_inc_gst)) return null;
  const trans_gst_aud = Number(gstAud);
  if (Number.isNaN(trans_gst_aud)) return null;
  const trans_total_aud = Number(totalAud);
  if (Number.isNaN(trans_total_aud)) return null;
  const trans_total_inc_gst_arr = totalIncGst.split(' ');
  const trans_total_inc_gst = Number(trans_total_inc_gst_arr[0]);
  if (Number.isNaN(trans_total_inc_gst)) return null;
  const createOrderHistoryImportDto = new CreateOrderHistoryImportDto();
  createOrderHistoryImportDto.transactionDate = new Date(date.toString());
  createOrderHistoryImportDto.type = type;
  createOrderHistoryImportDto.market = market;
  createOrderHistoryImportDto.amount = trans_amount;
  createOrderHistoryImportDto.rateIncFee = trans_rate_inc_fee;
  createOrderHistoryImportDto.rateExcFee = trans_rate_exc_fee;
  createOrderHistoryImportDto.fee = trans_fee;
  createOrderHistoryImportDto.feeCurrency = trans_fee_arr[1];
  createOrderHistoryImportDto.feeAudIncGst = trans_fee_aud_inc_gst;
  createOrderHistoryImportDto.gstAud = trans_gst_aud;
  createOrderHistoryImportDto.totalAud = trans_total_aud;
  createOrderHistoryImportDto.totalIncGst = trans_total_inc_gst;
  createOrderHistoryImportDto.totalIncGstCurrency = trans_total_inc_gst_arr[1];
  return createOrderHistoryImportDto;
};
