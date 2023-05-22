export class CreateUserFileDto {
  exchange: string;
  user: string;
  fileName: string;
  createdAt: string;
  type: boolean;
  originalFileName: string;

  constructor(obj: any) {
    this.exchange = obj.exchange;
    this.user = obj.user;
    this.fileName = obj.fileName;
    this.createdAt = obj.createdAt;
    this.type = obj.type;
    this.originalFileName = obj.originalFileName;
  }
}
