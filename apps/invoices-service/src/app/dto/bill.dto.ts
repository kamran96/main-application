export class BillDto {
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
  directTax: number;
  indirectTax: number;
  isTaxIncluded: number;
  isReturn: boolean;
  comment: string;
  invoice_items: Array<BillItemsDto>;
}

class BillItemsDto {
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