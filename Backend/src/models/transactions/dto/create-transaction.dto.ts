export class CreateTransactionDto {
  symbol: string;
  exchange: string;
  price: number;
  amount: number;
  datetime: Date;
  cost: number;
  side: string;
  fee: JSON;
  user: string;
  cgt: JSON;
  fifoCGTDetail: JSON;
  lifoCGTDetail: JSON;
  fifoRelatedTransactions: string;
  lifoRelatedTransactions: string;
  source: string;
  currentBoughtCoinBalance: number;
  currentSoldCoinBalance: number;
  priceInAud: number;
  isError: boolean;
  balance: JSON;
  previousCoinBalance: number;
  currentCoinBalance: number;
  previousCoin2Balance: number;
  currentCoin2Balance: number;
  fileName: string;
  accountAddress: string;
  taxType: string;

  constructor(obj) {
    this.symbol = obj.symbol;
    this.exchange = obj.exchange;
    this.price = obj.price;
    this.amount = obj.amount;
    this.datetime = obj.datetime;
    this.cost = obj.cost;
    this.side = obj.side;
    this.fee = obj.fee;
    this.user = obj.user;
    this.cgt = obj.CGT;
    this.fifoCGTDetail = obj.fifoCGTDetail;
    this.lifoCGTDetail = obj.lifoCGTDetail;
    this.fifoRelatedTransactions = obj.fifoRelatedTransactions;
    this.lifoRelatedTransactions = obj.lifoRelatedTransactions;
    this.source = obj.source;
    this.currentBoughtCoinBalance = obj.currentBoughtCoinBalance;
    this.currentSoldCoinBalance = obj.currentSoldCoinBalance;
    this.isError = obj.isError;
    this.priceInAud = obj.priceInAUD;
    this.balance = obj.balance;
    this.previousCoinBalance = obj.previousCoinBalance;
    this.currentCoinBalance = obj.currentCoinBalance;
    this.previousCoin2Balance = obj.previousCoin2Balance;
    this.currentCoin2Balance = obj.currentCoin2Balance;
    this.fileName = obj.fileName;
    this.accountAddress = obj.accountAddress;
    this.taxType = obj.taxType;
  }
}
