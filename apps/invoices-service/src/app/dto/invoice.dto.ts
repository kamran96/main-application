export class InvoiceDto {
  id: number;
  isNewRecord: boolean;
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
  invoiceType: string;
  directTax: number;
  indirectTax: number;
  isTaxIncluded: number;
  status: number;
  isReturn: boolean;
  comment: string;
  invoice_items: Array<InvoiceItemsDto>;
}

class InvoiceItemsDto {
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

export class InvoiceDeleteIdsDto {
  ids: Array<number>;
}
