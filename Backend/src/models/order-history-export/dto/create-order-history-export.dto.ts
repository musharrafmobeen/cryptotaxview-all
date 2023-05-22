export class CreateOrderHistoryExportDto {
  transactionDate: Date;
  orderNo: string;
  pair: string;
  type: string;
  side: string;
  orderPrice: number;
  orderAmount: number;
  time: Date;
  executed: number;
  averagePrice: number;
  tradingTotal: number;
  status: string;
}
