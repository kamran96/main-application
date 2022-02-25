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

export class InvoiceItemsDto {
  id: number;
  itemId: string;
  description: string;
  quantity: number;
  itemDiscount: string;
  unitPrice: number;
  tax: string;
  accountId: number;
  total: number;
  sequence: number;
  costOfGoodAmount: number;
}

export class InvoiceIdsDto {
  ids: Array<number>;
}

export class ParamsDto {
  id: string;
}
