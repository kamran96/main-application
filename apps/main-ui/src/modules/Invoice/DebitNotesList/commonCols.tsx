import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import dayJs from 'dayjs';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '../../../modal';
import { ITableExportFields } from 'ant-table-extensions';

export const columns: ColumnsType<any> = [
  {
    title: 'Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    render: (data, row) => (
      <Link to={`/app${ISupportedRoutes.DEBIT_NOTES}/${row?.id}`}>{data}</Link>
    ),
  },
  {
    title: 'Ref',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'To',
    dataIndex: 'contact',
    key: 'contact',
    render: (data, row, index) => {
      return <>{data?.name}</>;
    },
  },
  {
    title: 'Data',
    dataIndex: 'issueDate',
    key: 'issueDate',
    render: (data) => (
      <>{data ? dayJs(data).format('MMMM D, YYYY h:mm A') : '-'}</>
    ),
  },

  {
    title: 'Amount',
    dataIndex: 'netTotal',
    key: 'netTotal',
  },

  {
    title: 'Items',
    dataIndex: 'creditNoteItems',
    key: 'creditNoteItems',
    render: (data) => (
      <>{data?.length > 1 ? `${data?.length} items` : `${data?.length} item`}</>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (data) => (data === 1 ? 'Aproved' : 'Draft'),
  },
];

export const csvColumns: ITableExportFields = {
  invoiceNumber: 'Invoice Numbber',
  reference: 'Reference',
  contact: {
    header: 'Contact',
    formatter: (data) => {
      return data?.name;
    },
  },
  issueDate: {
    header: 'Issue Date',
    formatter: (data) => {
      return data ? dayJs(data).format('MMMM D, YYYY h:mm A') : '-';
    },
  },
  netTotal: 'Amount',
  status: {
    header: 'Status',
    formatter: (data) => {
      return data === 1 ? 'Aproved' : 'Draft';
    },
  },
};

export const pdfCols: ColumnsType<any> = [
  {
    title: 'Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
  },
  {
    title: 'Ref',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'To',
    dataIndex: 'contact',
    key: 'contact',
    render: (data, row, index) => {
      return data?.name;
    },
  },
  {
    title: 'Data',
    dataIndex: 'issueDate',
    key: 'issueDate',
    render: (data) => (data ? dayJs(data).format('MMMM D, YYYY h:mm A') : '-'),
  },

  {
    title: 'Amount',
    dataIndex: 'netTotal',
    key: 'netTotal',
  },

  {
    title: 'Items',
    dataIndex: 'credit_note_items',
    key: 'credit_note_items',
    render: (data) =>
      data?.length > 1 ? `${data?.length} items` : `${data?.length} item`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (data) => (data === 1 ? 'Aproved' : 'Draft'),
  },
];

export default columns;
