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

export class PaymentContactDto {
  ids: Array<ContactType>;
}

export class PaymentInvoiceDto {
  type: string;
  ids: Array<string>;
}

class ContactType {
  type: number;
  id: string;
}

export class DeletePaymentDto {
  type: number;
  ids: Array<number>;
}
