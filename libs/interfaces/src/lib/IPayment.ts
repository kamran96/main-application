import { IBase, IPagination } from '..';

export interface IPayment extends IBase {
  comment: string;
  reference: string;
  amount: number;
  dueDate: string;
  paymentType: string;
  paymentMode: string;
  contactId: string;
  invoiceId: number;
  billId: number;
  date: string;
  entryType: number;
  runningPayment: boolean;
  importedPaymentId: string;
  importedFrom: string;
}

export interface IPaymentWithResponse {
  message?: string;
  status?: boolean;
  result: IPayment | IPayment[];
  pagination?: IPagination;
}
