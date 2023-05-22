export class CreatePaymentDto {
  userID: string;
  paymentPlan: string;
  date: Date;
  token: string;
  type: string;
}
