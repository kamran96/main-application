import { IBase, IPagination, ITransaction } from '..';

export interface IAccount extends IBase {
  name: string;
  description: string;
  code: number | string;
  secondaryAccountId: number;
  primaryAccountId: number;
  importedFrom: string;
  taxRate: number;
  isSystemAccount: boolean;
  importedAccountId: string;
}

export interface IAccountWithResponse {
  message?: string;
  status?: boolean | number;
  pagination?: IPagination;
  result?: IAccount[] | IAccount | IAccountWithResponse | ITransaction[];
  opening_balance?: IOpeningBalance;
  transaction_items?: ITransaction[];
}

export interface IOpeningBalance {
  comment: string;
  date: string;
  amount: number;
}

export interface ISecondaryAccount extends IBase {
  name: string;
  code: string;
  primaryAccountId: number;
  primaryAccount: IPrimaryAccount;
}

export interface ISecondaryAccountWithResponse {
  message: string;
  result: ISecondaryAccount[];
}

export interface IPrimaryAccount extends IBase {
  name: string;
}

export interface ICodes {
  codes: Array<string>;
}
