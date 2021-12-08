import { ITableExportFields } from 'ant-table-extensions';
import { ColumnsType } from 'antd/es/table';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

import { ISupportedRoutes } from '../../../../../modal';
import { InvoiceResultClass } from '../../../../../modal/invoice';
import moneyFormat from '../../../../../utils/moneyFormat';

export const PurchaseOrderColumns: ColumnsType<any> = [
  {
    title: 'Order No#',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    render: (data, row, index) => (
      <Link to={`/app${ISupportedRoutes.PURCHASES}/${row.id}`}>{data}</Link>
    ),
  },

  {
    title: 'Ref',
    dataIndex: 'reference',
    key: 'reference',
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    render: (data) => <>{data ? data : '-'}</>,
  },
  {
    title: 'Supplier',
    dataIndex: 'contact',
    key: 'contact',
    render: (data, row, index) => <>{data ? data.name : '-'}</>,
  },

  {
    title: 'Date Raised',
    dataIndex: 'issueDate',
    key: 'issueDate',
    render: (data, row, index) => (
      <>{dayjs(data).format(`	MMMM D, YYYY h:mm A`)}</>
    ),
  },
  {
    title: 'Delivery Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (data, row, index) => (
      <>{(data && dayjs(data).format(`MMMM D, YYYY h:mm A`)) || `-`}</>
    ),
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
    title: 'Items',
    dataIndex: 'purchaseItems',
    key: 'purchaseItems',
    render: (data: any[]) => (
      <>{data.length === 1 ? `${data.length} Item` : `${data.length} Items`}</>
    ),
  },

  {
    title: 'Total',
    dataIndex: 'netTotal',
    key: 'netTotal',
    render: (data) => <>{data ? moneyFormat(data) : '-'}</>,
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

export const _csvExportable: ITableExportFields = {
  invoiceNumber: 'Order Number',
  reference: 'Reference',
  isReturn: {
    header: 'Return',
    formatter: (data) => {
      return data === true ? 'Returned' : '';
    },
  },
  comment: 'Comment',
  contact: {
    header: 'Supplier',
    formatter: (data) => {
      return data.name;
    },
  },
  issueDate: {
    header: 'Date Raised',
    formatter: (data) => {
      return data ? dayjs(data).format(`MM/DD/YYYY h:mm A`) : '-';
    },
  },
  dueDate: {
    header: 'Delivery Date',
    formatter: (data) => {
      return data ? dayjs(data).format(`MM/DD/YYYY h:mm A`) : '-';
    },
  },
  purchase_items: {
    header: 'Items Count',
    formatter: (data) => {
      return data.length;
    },
  },
  netTotal: {
    header: 'Total',
    formatter: (data) => (data ? moneyFormat(data) : ''),
  },
};
