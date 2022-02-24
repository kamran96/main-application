import { ITableExportFields } from 'ant-table-extensions';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React from 'react';
import { Link } from 'react-router-dom';

import { ISupportedRoutes } from '../../../../../modal';
import moneyFormat from '../../../../../utils/moneyFormat';

export const PurchaseOrderColumns: ColumnsType<any> = [
  {
    title: 'Order No#',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    render: (data, row, index) => (
      <Link to={`/app${ISupportedRoutes.PURCHASE_ORDER}/${row.id}`}>
        {data}
      </Link>
    ),
  },
  {
    title: 'Order Type',
    dataIndex: 'invoiceType',
    render: (data) => (
      <>{data === 'POE' ? 'Purchase Entry' : 'Purchase Order'}</>
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
    width: 200,
    render: (data) => (
      <p
        style={{ maxWidth: '300px' }}
        className="white-space-wrap elipses ovf-hidden margin-reset "
      >
        {data ? data : '-'}
      </p>
    ),
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
      <>{dayjs(data).format(`MMMM D, YYYY h:mm A`)}</>
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
    title: 'Items',
    dataIndex: 'purchase_items',
    key: 'purchase_items',
    render: (data: any[]) => (
      <>{data.length === 1 ? `${data.length} Item` : `${data.length} Items`}</>
    ),
  },
];

export const pdfColsPO: ColumnsType<any> = [
  {
    title: 'Order No#',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
  },
  {
    title: 'Order Type',
    dataIndex: 'invoiceType',
    render: (data) => (data === 'POE' ? 'Purchase Entry' : 'Purchase Order'),
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
    width: 200,
    render: (data) => (data ? data : '-'),
  },
  {
    title: 'Supplier',
    dataIndex: 'contact',
    key: 'contact',
    render: (data, row, index) => (data ? data.name : '-'),
  },

  {
    title: 'Date Raised',
    dataIndex: 'issueDate',
    key: 'issueDate',
    render: (data, row, index) => dayjs(data).format(`MMMM D, YYYY h:mm A`),
  },
  {
    title: 'Delivery Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (data, row, index) =>
      (data && dayjs(data).format(`MMMM D, YYYY h:mm A`)) || `-`,
  },
  // {
  //   title: 'Items',
  //   dataIndex: 'purchaseItems',
  //   key: 'purchaseItems',
  //   render: (data: any[]) =>
  //     data?.length === 1 ? `${data?.length} Item` : `${data?.length} Items`,
  // },
];

export const _csvColumns: ITableExportFields = {
  invoiceNumber: 'Order Number',
  reference: 'Reference',
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
};
