import { IBase, IPagination } from '..';

export interface IBill extends IBase {
  reference: string;
  contactId: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  adjustment: number;
  grossTotal: number;
  netTotal: number;
  date: string;
  invoiceType: string;
  directTax: number;
  indirectTax: number;
  isTaxIncluded: number;
  currency: string;
  paid_amount?: number;
  due_amount?: number;
  comment: string;
  importedFrom: string;
  importedBillId: string;
}

export interface IBillItem extends IBase {
  billId: number;
  itemId: string;
  description: string;
  quantity: number;
  purchasePrice: number;
  tax: string;
  sequence: number;
  costOfGoodAmount: number;
  accountId: number;
}

export interface IBillWithResponse {
  message?: string;
  status?: boolean;
  result?: IBill | IBill[];
  pagination?: IPagination;
}
