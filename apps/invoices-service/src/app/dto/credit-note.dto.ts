export class CreditNoteDto {
  id: number;
  reference: string;
  contactId: string;
  invoiceId: number;
  billId: number;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  invoiceType: string;
  discount: number;
  grossTotal: number;
  currency: number;
  netTotal: number;
  date: string;
  type: string;
  status: number;
  comment: string;
  invoice_items: Array<CreditNoteItemDto>;
}

class CreditNoteItemDto {
  id: number;
  itemId: string;
  description: string;
  quantity: number;
  itemDiscount: number;
  unitPrice: number;
  tax: string;
  total: number;
  sequence: number;
  accountId: number;
  costOfGoodAmount: number;
}

export class CnParamsDto {
  id: number;
}
