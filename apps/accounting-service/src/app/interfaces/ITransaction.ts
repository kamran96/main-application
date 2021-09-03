import { IBase } from './IBase';

export interface ITransaction extends IBase {
  narration: string;
  ref: string;
  amount: number;
  store_id: number;
  date: Date;
}

export interface ITransactionItem extends IBase {
  transaction_id: number;
  amount: number;
  account_id: number;
  transaction_type: number;
  store_id;
}
