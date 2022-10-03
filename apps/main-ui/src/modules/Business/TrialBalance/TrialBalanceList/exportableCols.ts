import { ITableExportFields } from 'ant-table-extensions';

export const _csvColumnsTrialBalance: ITableExportFields = {
  name: 'Particulars',
  debit: {
    header: 'Debit',
    formatter: (data, row) => (data ? data : ''),
  },
  credit: {
    header: 'Credit',
    formatter: (data, row) => (data ? data : ''),
  },
};
