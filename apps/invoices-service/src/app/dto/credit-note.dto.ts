export class CreditNoteDto {
  id: number;
  reference: string;
  contactId: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  discount: number;
  grossTotal: number;
  currency: number;
  netTotal: number;
  date: string;
  type: string;
  comment: string;
  credit_note_items: Array<CreditNoteItemDto>;
}

class CreditNoteItemDto {
  id: number;
  itemId: string;
  description: string;
  quantity: string;
  itemDiscount: string;
  unitPrice: string;
  tax: string;
  total: number;
  sequence: number;
  costOfGoodAmount: number;
}