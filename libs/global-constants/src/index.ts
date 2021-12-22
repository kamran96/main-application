export * from './lib/global-constants.module';

export enum Integrations {
  XERO = 'XE',
  QUICK_BOOK = 'QB',
}

export enum PaymentModes {
  INVOICES = 1,
  BILLS = 2,
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
  CREDIT = 1,
  COLLECTION = 2,
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
