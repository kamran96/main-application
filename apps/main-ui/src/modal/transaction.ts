import { IBase, IBaseRequest } from './base';

export enum TransactionsType {
  CREDIT = 20,
  DEBIT = 10,
}

export enum TransactionsStatus{
  APPROVE = 1,
  DRAFT = 2
}

export interface IResponseTransactions extends IBaseRequest {
  result: ITransactionResult[];
}

export interface ITransactionResult extends IBase {
  id: number;
  amount: number;
  ref: string;
  narration: string;
  date: string;
  branchId: number;
  organizationId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdById: null;
  updatedById: null;
  transactionItems: ITransactionItem[];
}

export interface ITransactionItem extends IBase {
  id: number;
  amount: number;
  accountId: number;
  transactionId: number;
  branchId: number;
  organizationId: number;
  transactionType: number;
}
