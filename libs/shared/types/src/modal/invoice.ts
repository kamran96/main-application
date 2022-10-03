import { IItem } from '@invyce/interfaces';
import { IBranch, IOrganization, IUser } from './auth';
import { IBase, IBaseRequest, IBaseRequestResponse } from './base';
import { IContactType } from './contact';

export interface IInvoiceResponse extends IBaseRequest {
  result?: IInvoiceResult[];
}

export enum IInvoiceType {
  INVOICE = 'SI',
  PURCHASE_ENTRY = 'POE',
  PURCHASE_ORDER = 'PO',
  QUOTE = 'QO',
  CREDITNOTE = 'ACCRECCREDIT',
  DEBITNOTE = 'ACCPAYCREDIT',
  BILL = 'BILL',
}

export interface IInvoiceResult extends IBase {
  item: IItem;
  adjustment?: number;
  id: number;
  reference: string;
  contactId: number;
  issueDate: string;
  dueDate: string;
  discount: number;
  grossTotal: number | string;
  netTotal: number;
  date: string;
  directTax: number | string;
  indirectTax: number | string;
  branchId: number;
  branch: IBranch;
  status: number;
  organizationId: number;
  invoiceType:
    | `${IInvoiceType.CREDITNOTE}`
    | `${IInvoiceType.DEBITNOTE}`
    | `${IInvoiceType.QUOTE}`
    | `${IInvoiceType.INVOICE}`
    | `${IInvoiceType.PURCHASE_ENTRY}`
    | `${IInvoiceType.PURCHASE_ORDER}`
    | `${IInvoiceType.BILL}`;

  invoiceNumber: string;
  invoiceStatus: number;

  isTaxIncluded: number;
  currency: string;
  invoice_items: IInvoiceItem[];
  invoiceItems: IInvoiceItem[];
  credit_note_items?: IInvoiceItem[];
  payments: IInvoicePayment[] | any;
  contact: IContactType;
  purchase_items: IInvoiceItem[];
  paid_amount: number;
  comment: string;
  user: IUser;
  organization?: IOrganization;
  payment_status?: string;
  due_amount?: string;
  [key: string]: any;
  relation?: {
    type: 'SI' | 'PO' | 'QO' | 'CN';
    links: { id?: number; invoiceNumber?: string; balance?: number }[];
  };
}

export class IInvoiceMutatedResult extends IBaseRequestResponse {
  result?: IInvoiceResult;

  getSquenceData(accessor: string) {
    const sortedData = this.result?.[accessor]?.sort((a: any, b: any) => {
      return a.sequence - b.sequence;
    });

    return sortedData;
  }

  getConstructedResult() {
    const type = this.result?.invoiceType;

    const accessor =
      type === IInvoiceType.INVOICE
        ? 'invoiceItems'
        : type === IInvoiceType.CREDITNOTE || type === IInvoiceType.DEBITNOTE
        ? 'creditNoteItems'
        : type === IInvoiceType.PURCHASE_ORDER
        ? 'purchaseOrderItems'
        : 'purchaseItems';

    return { ...this.result, invoiceItems: this.getSquenceData(accessor) };
  }
}

export interface IAddress {
  addressType: number;
  city: string;
  contactId: number;
  country: string;
  description: string;
  id: number;
  organizationId: number;
  postalCode: number;
  status: number;
  town: string;
}

export interface IInvoiceItem extends IBase {
  id: number;
  invoiceId: number;
  itemId: number;
  description: number;
  quantity: number;
  itemDiscount: string;
  total: number;
  organizationId: number;
  tax: string;
  unitPrice: number;
  sequence?: number;
  purchasePrice?: number;
  salesPrice?: number;
  discount?: number | string;
  item?: IItem;
}

export enum ORDER_TYPE {
  SALE_INVOICE = 'SI',
  PURCAHSE_ORDER = 'PO',
  POE = 'POE',
  QUOTE = 'QO',
  BILL = 'BILL',
  CREDIT_NOTE = 'CN',
  DEBIT_NOTE = 'DN',
}

export enum INVOICETYPE {
  Approved = 1,
  DRAFT = 2,
  Payment_Awaiting = 4,
  Awaiting_Approval = 6,
  PAID = 5,
  ALL = 'ALL',
  RETURNED = 3,
  Date_Expired = 'DUE_PAYMENTS',
}

export enum INVOICE_TYPE_STRINGS {
  Approved = 'PROCESSED',
  Draft = 'DRAFT',
  Payment_Awaiting = 'AWATING_PAYMENT',
  Date_Expired = 'DUE_PAYMENTS',
  Paid = 'PAID',
  Returned = 'RETURNED',
  Awaiting_Aproval = 'AWAITING_APROVAL',
}

export interface IInvoicePayment extends IBase {
  id: number;
  comment: number;
  amount: number;
  dueDate: number;
  paymentType: number;
  paymentMode: number;
  contactId: number;
  invoiceId: number;
  bankId: number;
  transactionId: number;
  date: number;
  invoices: null;
  purchaseId: number;
}

export class InvoiceResultClass {
  id!: number;
  reference!: string;
  contactId!: number;
  issueDate!: string;
  dueDate!: string;
  discount!: string;
  grossTotal!: number | string;
  netTotal!: number;
  date!: string;
  directTax!: number | string;
  indirectTax!: number | string;
  branchId!: number;
  status!: number;
  organizationId!: number;
  invoiceType!: number;
  invoiceNumber!: string;
  invoiceStatus!: number;
  isTaxIncluded!: number;
  currency!: string;
  invoice_items!: IInvoiceItem[];
  payments!: IInvoicePayment[];
  paid_amount!: number;

  getRemaningAmount() {
    if (this.paid_amount) {
      const remainingAmount = this.netTotal - Math.abs(this.paid_amount);
      return remainingAmount;
    } else {
      return this.netTotal;
    }
  }

  getStatus() {
    let itemStatus = `Pending`;
    if (this.paid_amount && this.payments?.length) {
      const paidAmount = Math.abs(this.paid_amount);

      if (this.netTotal - paidAmount === this.netTotal) {
        itemStatus = `Pending`;
      } else if (this.netTotal === paidAmount) {
        itemStatus = `Full Payment`;
      } else if (this.netTotal > paidAmount) {
        itemStatus = 'Partial Payment';
      }
    }
    return itemStatus;
  }
}

export type IInvoiceCreatedResponse = IInvoiceResult;

export interface IInvoiceDashboardDetails {
  id: number;
  today_sale: number;
  yesterday_sale: number;
  draft_invoices: number;
  awaiting_to_approve: number;
}

export interface IInvoiceDraftsDashboard extends IBaseRequest {
  result: IInvoiceDraftsResult[];
}

export interface IInvoiceDraftsResult {
  id: number;
  contactName: string;
  paymentDate: string;
  invoiceItems: number;
  amount: number;
}
export interface ITopSuggestedInvoices extends IBaseRequest {
  result: ITopInvoicesResult[];
}
export interface ITopInvoicesResult {
  case: string;
  contactId: number;
  dueDate: string;
  id: number;
  issueDate: string;
  name: string;
  netTotal: number;
  reference: number;
  invoiceNumber: number;
}

export interface IInvoicesFlow {
  id: number;
  invoicedate: string;
  todaysale: number;
}

export enum ITaxTypes {
  TAX_INCLUSIVE = 1,
  TAX_EXCLUSIVE = 2,
  NO_TAX = 3,
}
export enum IInvoiceStatus {
  approve = 1,
  draft = 2,
  returned = 3,
}

export enum IInvoiceTypes {
  INVOICE = 'SI',
  PURCAHSE_ENTRY = 'POE',
  QUOTATION = 'QO',
  PURCHASE_ORDER = 'PO',
  BILL = 'BILL',
}

// export enum CreditNoteType {
//   CREDITNOTE = 'ACCRECCREDIT',
//   DEBITNOTE = 'ACCPAYCREDIT',
// }
