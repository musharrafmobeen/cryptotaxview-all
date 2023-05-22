export class CreateExchangePairDto {
  exchange: string;
  keys: string[];
  userID: string;
  lastSynced: number;
  source: string;
  name: string;

  constructor(obj) {
    this.exchange = obj.exchange;
    this.keys = obj.keys;
    this.userID = obj.userID;
    this.lastSynced = obj.lastSynced;
    this.source = obj.source;
    this.name = obj.name;
  }
}
