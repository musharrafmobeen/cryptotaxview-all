export class CreateNewTransactionDto {
  symbol: string;
  exchange: string;
  price: number;
  amount: number;
  datetime: Date;
  cost: number;
  side: string;
  fileName: string;
  fee: JSON;
  userID: string;
  previousCoinBalance: number;
  currentCoinBalance: number;
  previousCoin2Balance: number;
  currentCoin2Balance: number;
  accountAddress: string;
  taxType: string;
}
