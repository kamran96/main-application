export class PaymentDto {
  date: string;
  contactId: string;
  paymentType: number;
  paymentMode: number;
  amount: number;
  runningPayment: boolean;
  reference: string;
  accountId: number;
  comment: string;
  remainingAmount: number;
  invoice_ids: Array<number>;
}
