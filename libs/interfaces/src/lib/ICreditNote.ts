import { IBase, IPagination } from '..';

export interface ICreditNote extends IBase {
  reference: string;
  contactId: string;
  invoiceId: number;
  billId: number;
  issueDate: string;
  dueDate: string;
  invoiceType: string;
  invoiceNumber: string;
  discount: number;
  grossTotal: number;
  netTotal: number;
  // date: string;
  currency: string;
  importedFrom: string;
  importedCreditNoteId: string;
  creditNoteItems?: ICreditNoteItem[];
}

export interface ICreditNoteItem {
  creditNoteId: number;
  itemId: string;
  description: string;
  quantity: number;
  itemDiscount: string;
  unitPrice: string;
  tax: string;
  sequence: number;
  costOfGoodAmount: number;
  accountId: number;
}

export interface ICreditNoteWithResponse {
  message?: string;
  status?: boolean;
  result?: ICreditNote | ICreditNote[];
  pagination?: IPagination;
}
