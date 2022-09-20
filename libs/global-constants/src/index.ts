export * from './lib/global-constants.module';
import axios from 'axios';

export enum Integrations {
  XERO = 'XE',
  QUICK_BOOK = 'QB',
  CSV_IMPORT = 'CSV',
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
  PO = 'PO',
}

export enum InvTypes {
  INVOICE = 'SI',
  BILL = 'BILL',
  CREDIT_NOTE = 'CN',
  PURCHASE_ORDER = 'PO',
  QUOTATION = 'Q0',
}

export const Host = (service: string, route: string): string => {
  if (process.env['NODE' + '_ENV'] === 'production') {
    return `http://prod-${service}.prod.svc.cluster.local/${route}`;
  } else if (process.env['NODE' + '_ENV'] === 'staging') {
    return `http://staging-${service}.staging.svc.cluster.local/${route}`;
  } else {
    return `https://localhost/${route}`;
  }
};

export const MQ_HOST = () => {
  return process.env['NODE' + '_ENV'] === 'production' ||
    process.env['NODE' + '_ENV'] === 'staging'
    ? `amqp://${process.env.RABBIT_USERNAME}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`
    : 'amqp://localhost:5672';
};

export const ARANGO_DB_CONNECTION = () => {
  if (process.env['NODE' + '_ENV'] === 'production') {
    return {};
  } else if (process.env['NODE' + '_ENV'] === 'staging') {
    return {
      url: 'https://167.172.4.40:8529',
      databaseName: 'staging-reports',
      auth: { username: 'root', password: '' },
    };
  } else {
    return {
      url: 'http://127.0.0.1:8529',
      databaseName: 'reports',
      auth: { username: 'root', password: 'asdf' },
    };
  }
};

export const useApiCallback = (route: string) => {
  const service = route.split('/')[0];
  const baseURL =
    process.env['NODE' + '_ENV'] === 'production'
      ? `http://prod-${service}.prod.svc.cluster.local/${route}`
      : process.env['NODE' + '_ENV'] === 'staging'
      ? `http://staging-${service}.staging.svc.cluster.local/${route}`
      : `https://localhost/${route}`;

  const http = axios.create({
    baseURL,
  });
  return http;
};

export const ToTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const GetBase64 = async (url) => {
  if (!url) {
    return url;
  } else {
    return axios
      .get(url, {
        responseType: 'arraybuffer',
      })
      .then((response) =>
        Buffer.from(response.data, 'binary').toString('base64')
      );
  }
};
