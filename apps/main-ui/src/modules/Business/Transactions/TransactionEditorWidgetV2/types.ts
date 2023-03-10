import { EditableColumnsType } from '@invyce/editable-table';
import { FormInstance } from 'antd';
import { ReactNode } from 'react';

export interface ITransactionEditorProps {
  children: ReactNode;
  id: number;
}

export interface ITranactionContext {
  columns: EditableColumnsType[];
  transactionsList: ITransactionsList[];
  setTransactionsList: (payload: ITransactionsList[]) => void;
  addRow: () => void;
  loading: boolean;
  resetTransactions: () => void;
  id: number;
  form: FormInstance<any>;
}
export interface ITransactionsList {
  account: number | string;
  debit: number;
  credit: number;
  description: string;
  key: string;
  error: boolean;
}
