import { IBase, IPagination } from '..';

export interface ITransaction extends IBase {
  narration: string;
  ref: string;
  amount: number;
  notes: string;
  date: Date;
  transactionItems?: ITransactionItem[] | ITransactionItem;
}

export interface ITransactionItem extends IBase {
  transactionId: number;
  amount: number;
  accountId: number;
  transactionType: number;
}

export interface ITransactionWithResponse {
  message?: string;
  status?: boolean;
  result: ITransaction[] | ITransaction | ITransactionWithResponse;
  pagination?: IPagination;
  transactionItems?: ITransactionItem[];
}
