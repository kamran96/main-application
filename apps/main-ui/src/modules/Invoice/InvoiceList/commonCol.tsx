import { ITableExportFields } from 'ant-table-extensions';
import { ColumnsType } from 'antd/es/table';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

import { InvoiceResultClass } from '../../../modal/invoice';
import { ISupportedRoutes } from '../../../modal/routing';
import moneyFormat from '../../../utils/moneyFormat';

export const InvoiceColumns: ColumnsType<any> = [
  {
    title: 'Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    render: (data, row, index) => (
      <Link to={`/app${ISupportedRoutes.INVOICES_VIEW}/${row.id}`}>{data}</Link>
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
    render: (contact, row, index) => {
      return <>{contact ? contact.name : '-'}</>;
    },
  },

  {
    title: 'Date',
    dataIndex: 'issueDate',
    key: 'issueDate',
    render: (data, row, index) => {
      return <>{data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-'}</>;
    },
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (data, row, index) => {
      return <>{data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-'}</>;
    },
  },
  {
    title: 'Paid Amount',
    dataIndex: 'paid_amount',
    key: 'paid_amount',
    render: (data) => {
      return <>{data ? moneyFormat(Math.abs(data)) : '-'}</>;
    },
  },
  {
    title: 'Due',
    dataIndex: 'due',
    key: '',
    render: (data, row: InvoiceResultClass, index) => {
      const rowData = plainToClass(InvoiceResultClass, row);
      return <>{row ? moneyFormat(rowData.getRemaningAmount()) : '-'}</>;
    },
  },
  {
    title: 'Items',
    dataIndex: 'invoiceItems',
    key: 'invoiceItems',
    render: (data: any[]) => (
      <>{data.length === 1 ? `${data.length} Item` : `${data.length} Items`}</>
    ),
  },
  {
    title: 'Status',
    dataIndex: '',
    key: '',
    render: (data, row, index) => {
      const rowData = plainToClass(InvoiceResultClass, row);
      return <>{row && rowData.getStatus()}</>;
    },
  },
];

export const _exportableCols: ITableExportFields = {
  invoiceNumber: 'Invoice Number',
  reference: 'Reference',
  contact: {
    header: 'To',
    formatter: (_data) => {
      return _data.name;
    },
  },
  issueDate: {
    header: 'Date',
    formatter: (data) => {
      return data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-';
    },
  },
  dueDate: {
    header: 'Due Date',
    formatter: (data) => {
      return data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-';
    },
  },
  paid_amount: {
    header: 'Paid Amount',
    formatter: (data, record) => {
      return data ? moneyFormat(Math.abs(data)) : '-';
    },
  },
  due: {
    header: 'Due',
    formatter: (data, record) => {
      const rowData = plainToClass(InvoiceResultClass, record);
      return record ? moneyFormat(rowData.getRemaningAmount()) : '-';
    },
  },
  status: {
    header: 'Status',
    formatter: (data, record) => {
      const rowData = plainToClass(InvoiceResultClass, record);
      return record && rowData.getStatus();
    },
  },
};

export const PdfCols: ColumnsType<any> = [
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
    render: (contact, row, index) => {
      return contact ? contact.name : '-';
    },
  },

  {
    title: 'Date',
    dataIndex: 'issueDate',
    key: 'issueDate',
    render: (data, row, index) =>
      data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-',
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (data, row, index) => {
      return data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-';
    },
  },
  {
    title: 'Paid Amount',
    dataIndex: 'paid_amount',
    key: 'paid_amount',
    render: (data) => {
      return data ? moneyFormat(Math.abs(data)) : '-';
    },
  },
  {
    title: 'Due',
    dataIndex: 'due',
    key: '',
    render: (data, row: InvoiceResultClass, index) => {
      const rowData = plainToClass(InvoiceResultClass, row);
      return row ? moneyFormat(rowData.getRemaningAmount()) : '-';
    },
  },

  {
    title: 'Status',
    dataIndex: '',
    key: '',
    render: (data, row, index) => {
      const rowData = plainToClass(InvoiceResultClass, row);
      return row && rowData.getStatus();
    },
  },
];
