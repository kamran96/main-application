import { IBase, IBaseRequest } from './base';

export enum ACCOUNT_TYPES {
  SAVING_ACCOUNT = 1,
  CURRENT_ACCOUNT = 2,
  BASIC_BANKING_ACCOUNT = 3,
  FORIGN_CURR_ACCOUNT = 4,
  FIXED_DEPOSIT_ACCOUNT = 5,
  RUNNING_FINANCE_ACCOUNT = 6,
}

export enum BANK_ACCOUNTTYPES {
  CURRENT = 1,
  FIXED = 2,
}
export enum ACCOUNT_TYPES_NAMES {
  SAVING_ACCOUNT = 'Saving Account',
  CURRENT_ACCOUNT = 'Current Account',
  BASIC_BANKING_ACCOUNT = 'Basic Banking Account',
  FORIGN_CURR_ACCOUNT = 'Foreign Currency Account',
  FIXED_DEPOSIT_ACCOUNT = 'Fixed Deposit Account',
  RUNNING_FINANCE_ACCOUNT = 'Running Finance Account',
}

export interface IAccounts extends IBaseRequest {
  result: IAccountsResult[];
}

export interface IAccountsResult extends IBase {
  id?: number;
  name?: string;
  description?: string;
  secondaryAccountName?: string;
  primaryAccountName?: string;
  createdById?: number;
  updatedById?: number;
  code?: string;
  branchId?: null;
  secondaryAccountId?: number;
  secondary_account?: ISecondaryAccount;
  balance?: number;
  opening_balance?: number;
  total_credits?: number;
  total_debits?: number;
  closing_balance?: number;
  net_change?: number;
  [name: string]: any;
}

export interface ISecondaryAccount extends IBase {
  id: number;
  name: string;
  primaryAccountId: number;
  organizationId: number;
  primary_account: IPrimaryAccount;
}

export interface IPrimaryAccount extends IBase {
  id: number;
  name: string;
  organizationId: number;
}
