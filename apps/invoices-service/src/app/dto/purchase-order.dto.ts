export class PurchaseOrderDto {
  id: number;
  reference: string;
  contactId: string;
  issueDate: string;
  dueDate: string;
  invoiceNumber: string;
  adjustment: number;
  grossTotal: number;
  currency: number;
  netTotal: number;
  date: string;
  email: string;
  invoiceType: string;
  directTax: number;
  indirectTax: number;
  isTaxIncluded: number;
  isReturn: boolean;
  isNewRecord: boolean;
  comment: string;
  status: number;
  invoice_items: Array<PurchaseOrderItemDto>;
}

class PurchaseOrderItemDto {
  id: number;
  itemId: string;
  description: string;
  quantity: number;
  purchasePrice: number;
  unitPrice: number;
  tax: string;
  total: number;
  accountId: number;
  sequence: number;
  costOfGoodAmount: number;
}
