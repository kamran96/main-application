import { ReactNode } from 'react';

export interface ITableColumns {
  title: string;
  dataIndex: string;
  key?: string;
  render?: (data: any, row: any, index: number) => ReactNode;
  width?: number;
}

export interface ITableProps {
  columns: ITableColumns[];
  data?: unknown[];
}
