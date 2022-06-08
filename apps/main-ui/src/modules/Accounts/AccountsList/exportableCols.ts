import { ITableExportFields } from 'ant-table-extensions';
import moneyFormat from '../../../utils/moneyFormat';
import { ITableColumns } from '../../../components/PDFs/PDFTable';

export const _csvColumnsAccount: ITableExportFields = {
  code: 'Code',
  name: 'Account Head',
  secondary_account: {
    header: 'Type',
    formatter: (data) => (data ? data.name : '-'),
  },
  tax_rate: 'Tax Rate',
  total_debits: {
    header: 'Total Debits',
    formatter: (data) => (data ? data : 0),
  },
  total_credits: {
    header: 'Total Credits',
    formatter: (data) => (data ? data : 0),
  },
  balance: {
    header: 'Amount',
    formatter: (data) => (data ? data : 0),
  },
};

export const pdfColsAccounts: ITableColumns[] = [
  {
    title: '#',
    dataIndex: '',
    key: 'key',
    width: 30,
    render: (data, row, index) => index + 1,
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Account Head',
    dataIndex: 'name',
    key: 'name',
    width: 600,
  },
  {
    title: 'Type',
    dataIndex: 'secondaryName',
    key: 'secondaryName',
  },
  {
    title: 'Tax Rate',
    dataIndex: 'tax_rate',
    key: 'tax_rate',
    render: (data) => (data ? data : '-'),
  },
  {
    title: 'Total Debits',
    dataIndex: 'total_debits',
    key: 'total_debits',
    sorter: true,
    render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
  },
  {
    title: 'Total Credits',
    dataIndex: 'total_credits',
    key: 'total_credits',
    sorter: true,
    render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
  },
  {
    title: 'Amount',
    dataIndex: 'balance',
    key: 'balance',
    render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
  },
];
