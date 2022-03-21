import {
  IBase,
  IBaseRequest,
  IBaseRequestResponse,
  IBaseResponse,
} from './base';
import { IAddress } from './invoice';
import { PaymentMode } from './payment';

export enum IContactTypes {
  CUSTOMER = 1,
  SUPPLIER = 2,
}

export enum IEntryType {
  CREDIT = 2,
  DEBIT = 1,
}

export interface IContactType extends IBase {
  id: number;
  businessName: string;
  accountNumber: number;
  email: string;
  name: string;
  cellNumber: string;
  phoneNumber: string;
  cnic: string;
  faxNumber: string;
  skypeName: string;
  webLink: string;
  creditLimit: number;
  creditLimitBlock: number;
  salesDiscount: number;
  paymentDaysLimit: number;
  branchId: number;
  addressId: number;
  status: number;
  contactType: number;
  addresses: IAddress[];
}

export class Contact {
  id: number;
  businessName: string;
  accountNumber: number;
  email: string;
  name: string;

  getName() {
    return `${this.name} and business is ${this.businessName}`;
  }
}

export interface IContactLedgerResponse extends IBaseRequest {
  result: IContactLedger[];
  opening_balance?: IContactOpeningBalance;
}
export interface IInitialBalance {
  amount: number;
  comment: string;
  createdAt: string;
  entryType: number;
}
export class IContactLedgerResp extends IBaseRequestResponse {
  result: IContactLedger[];
  opening_balance?: IContactOpeningBalance;
  initial_balance?: IInitialBalance;
  contact: IContactType;

  getMergedResult() {
    if (this.opening_balance?.amount) {
      const generatedResult: IContactLedger[] | any[] = this.result;
      generatedResult.splice(0, 0, {
        ...this.opening_balance,
      });
      return this?.contact?.contactType === IContactTypes.SUPPLIER
        ? generatedResult?.map((item: IContactLedger, index) => {
            return {
              ...item,
              entryType:
                item?.entryType === IEntryType?.CREDIT
                  ? IEntryType?.DEBIT
                  : IEntryType?.CREDIT,
            };
          })
        : generatedResult;
    } else if (this.initial_balance && this.initial_balance.amount) {
      const generatedResult: IContactLedger | any[] = this.result;
      generatedResult.splice(0, 0, {
        ...this.initial_balance,
      });
      return this?.contact?.contactType === IContactTypes.SUPPLIER
        ? generatedResult?.map((item: IContactLedger, index) => {
            return {
              ...item,
              entryType:
                item?.entryType === IEntryType?.CREDIT
                  ? IEntryType?.DEBIT
                  : IEntryType?.CREDIT,
            };
          })
        : generatedResult;
    } else {
      return this?.contact?.contactType === IContactTypes.SUPPLIER
        ? this.result?.map((item: IContactLedger, index) => {
            return {
              ...item,
              entryType:
                item?.entryType === IEntryType?.CREDIT
                  ? IEntryType?.DEBIT
                  : IEntryType?.CREDIT,
            };
          })
        : this.result;
    }
  }

  getGeneratedResult() {
    const generatedResult = [];
    this.getMergedResult().forEach((item: IContactLedger, index) => {
      if (index === 0) {
        const balance = () => {
          if (this.contact?.contactType === IContactTypes.SUPPLIER) {
            if (item.entryType === IEntryType.DEBIT) {
              return -item.amount;
            } else {
              return item.amount;
            }
          } else {
            if (item.entryType === IEntryType.DEBIT) {
              return item.amount;
            } else {
              return -item.amount;
            }
          }
        };
        generatedResult.push({
          ...item,
          balance: balance(),
        });
      } else {
        const balance = () => {
          if (this.contact?.contactType === IContactTypes.SUPPLIER) {
            if (item.entryType === IEntryType.DEBIT) {
              return generatedResult[index - 1].balance - item.amount;
            } else {
              return generatedResult[index - 1].balance + item.amount;
            }
          } else {
            if (item.entryType === IEntryType.DEBIT) {
              return generatedResult[index - 1].balance + item.amount;
            } else {
              return generatedResult[index - 1].balance - item.amount;
            }
          }
        };
        generatedResult?.push({
          ...item,
          balance: balance(),
        });
      }
    });
    return generatedResult;
  }
}

export interface IContactOpeningBalance {
  id: number;
  comment: string;
  date: string;
  amount: number;
  entryType: number;
}

export class IContactLedger extends IBaseResponse {
  id: number;
  comment: string;
  amount: number;
  dueDate: string;
  paymentType: number;
  paymentMode: number;
  contactId: number;
  invoiceId: number;
  bankId: number;
  transactionId: number;
  invoice: any;
  balance: number;
  entryType: number;

  getDebits() {
    switch (this.paymentMode) {
      case PaymentMode.CASH:
        return this.amount;

      case PaymentMode.CREDIT:
        return 0;
      case PaymentMode.PARTIAL:
        return this.amount;

      default:
        return 0;
    }
  }

  getCredits() {
    switch (this.paymentMode) {
      case PaymentMode.CASH:
        return 0;

      case PaymentMode.CREDIT:
        return this.amount;
      case PaymentMode.PARTIAL:
        return 0;

      default:
        return 0;
    }
  }
}
export interface IContactLedgerResult {
  opening_balance?: IContactOpeningBalance;
  contact_ledger?: IContactLedger[];
}

export class ContactLedgerClass {
  opening_balance?: IContactOpeningBalance;
  contact_ledger: IContactLedger[];
}
