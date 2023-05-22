export class CreateReferralDto {
  referrersID: string;
  email: string;
  firstName: string;
  lastName: string;
  exchanges: string[];
  status: number;
  managedBy: string;
}
