import { IBase, IPagination } from '..';

export interface IInvoice extends IBase {
  reference: string;
  contactId: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  discount: number;
  grossTotal: number;
  netTotal: number;
  date: string;
  invoiceType: string;
  directTax: number;
  indirectTax: number;
  isTaxIncluded: number;
  currency: string;
  comment: string;
  importedFrom: string;
  importedInvoiceId: string;
}

export interface IInvoiceItem extends IBase {
  invoiceId: number;
  item: string;
  description: string;
  quantity: number;
  itemDiscount: number;
  unitPrice: number;
  tax: string;
  sequnece: number;
  costOfGoodAmount: number;
  accountId: number;
}

export interface IInvoiceWithResponse {
  result?: IInvoice | IInvoice[] | string;
  pagination?: IPagination;
  message?: string;
  status?: boolean;
}
