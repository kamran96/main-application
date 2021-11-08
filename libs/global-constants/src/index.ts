export * from './lib/global-constants.module';

export enum Integrations {
  XERO = 'XE',
  QUICK_BOOK = 'QB',
}

export enum PaymentModes {
  INVOICES = 2,
  BILLS = 1,
}

export enum XeroTypes {
  BILL = 'ACCPAY',
  INVOICE = 'ACCREC',
}

export enum XeroStatuses {
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
