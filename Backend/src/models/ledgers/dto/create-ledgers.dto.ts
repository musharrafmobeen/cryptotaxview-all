import { User } from 'src/models/users/entities/user.entity';

export class CreateLedgersDto {
  accountantID: string;
  date: string;
  credit: number;
  balance: number;
  fiscalYear: string;
  user: User;
}
