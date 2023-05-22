import { User } from 'src/models/users/entities/user.entity';

export class CreateInvoiceDto {
  dateOfInvoice: Date;
  invoiceAmount: number;
  expiryDate: Date;
  chargedOn: Date;
  mode: string;
  status: number;
  user: User;
  pId: string;
}
