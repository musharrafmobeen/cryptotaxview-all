import { Role } from 'src/models/roles/entities/role.entity';

export class CreateUserDto {
  email: string;
  password: string;
  reEnterPassword: string;
  // status: number;
  lastLogIn: string;
  firstName: string;
  lastName: string;
  username: string;
  contact: string;
  role: Role;
  referredBy: string;
  referralCode: string;
}
