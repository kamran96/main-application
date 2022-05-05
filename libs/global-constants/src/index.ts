export * from './lib/global-constants.module';

export enum Integrations {
  XERO = 'XE',
  QUICK_BOOK = 'QB',
}

export enum PaymentModes {
  INVOICES = 1,
  BILLS = 2,
}

export enum PaymentStatuses {
  PAID = 1,
  PENDING = 2,
  DUE_EXPIRED = 3,
}

export enum XeroTypes {
  BILL = 'ACCPAY',
  INVOICE = 'ACCREC',
}

export enum Statuses {
  DRAFT = 2,
  SUBMITTED = 1,
  DELETED = 0,
  AUTHORISED = 1,
  PAID = 1,
  VOIDED = 'VOIDED',
}

export enum Entries {
  DEBITS = 10,
  CREDITS = 20,
}

export enum EntryType {
  FULLPAYMENT = 3,
  CREDIT = 1,
  COLLECTION = 2,
  CREDITNOTE = 4,
  DEBITNOTE = 5,
}

export enum UserStatuses {
  ACTIVE = 1,
  DELETED = 0,
  HOLD = 2,
}

export enum CreditNoteType {
  ACCRECCREDIT = 'ACCRECCREDIT',
  ACCPAYCREDIT = 'ACCPAYCREDIT',
}

export enum PdfType {
  INVOICE = 'invoice',
  CREDIT_NOTE = 'credit-note',
  DEBIT_NOTE = 'debit-note',
  BILL = 'bill',
}

export enum InvTypes {
  INVOICE = 'SI',
  BILL = 'BILL',
  CREDIT_NOTE = 'CN',
  PURCHASE_ORDER = 'PO',
  QUOTATION = 'Q0',
}

export const Host = (service: string, route: string): string => {
  return process.env['NODE' + '_ENV'] === 'production'
    ? `http://${service}.default.svc.cluster.local/${route}`
    : `https://localhost/${route}`;
};
