export class CreateOrderHistoryImportDto {
  transactionDate: Date;
  userID: string;
  type: string;
  market: string;
  amount: number;
  rateIncFee: number;
  rateExcFee: number;
  fee: number;
  feeCurrency: string;
  feeAudIncGst: number;
  gstAud: number;
  totalAud: number;
  totalIncGst: number;
  totalIncGstCurrency: string;
  exchange: string;
}
