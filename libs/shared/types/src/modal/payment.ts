import { IBase, IBaseRequest } from "./base";
export enum PaymentMode {
  CREDIT = 1,
  CASH = 2,
  PARTIAL = 3,
}

export enum PaymentType {
  BANK = 1,
  CASH = 2,
}
export enum TRANSACTION_MODE {
  PAYABLES = 1,
  RECEIVABLES = 2,
}

export interface IPaymentResponse extends IBaseRequest {
  result: IPaymentGetResult[];
}

export interface IPaymentGetResult extends IBase {
  comment: string;
  amount: number;
  dueDate: string;
  paymentType: number;
  paymentMode: number;
  contactId: number;
  invoiceId: number;
  bankId: number;
  transactionId: number;
  date: number;
  invoices: number;
  purchaseId: number;
}
