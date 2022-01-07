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
  invoiceType: string;
  directTax: number;
  indirectTax: number;
  isTaxIncluded: number;
  isReturn: boolean;
  isNewRecord: boolean;
  comment: string;
  status: number;
  invoice_items: Array<BillItemsDto>;
}

class BillItemsDto {
  id: number;
  itemId: string;
  description: string;
  quantity: string;
  itemDiscount: string;
  purchasePrice: number;
  unitPrice: string;
  tax: string;
  total: number;
  accountId: number;
  sequence: number;
  costOfGoodAmount: number;
}

export class BillIdsDto {
  ids: Array<number>;
}

export class BillParamsDto {
  id: number;
}

export class BillContactIdDto {
  id: string;
}
