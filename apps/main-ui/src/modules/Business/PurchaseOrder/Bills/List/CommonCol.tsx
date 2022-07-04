import { ITableExportFields } from 'ant-table-extensions';
import { ColumnsType } from 'antd/es/table';
import { Capitalize } from '../../../../../components/Typography';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ISupportedRoutes } from '../../../../../modal';
import { InvoiceResultClass } from '../../../../../modal/invoice';
import moneyFormat from '../../../../../utils/moneyFormat';

export const useCols = () =>{

  const [sortedInfo, setSortedInfo] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (history?.location?.search) {
      const filterType = history?.location?.search.split('&');
      const filterIdType = filterType[1];
      const filterOrder = filterType[4]?.split('=')[1];


      if (filterIdType?.includes('-')) {
        const fieldName = filterIdType?.split('=')[1].split('-')[1];
        setSortedInfo({
          order: filterOrder,
          columnKey: fieldName,
        });
      } else {
        const fieldName = filterIdType?.split('=')[1];
        setSortedInfo({
          order: filterOrder,
          columnKey: fieldName,
        });
      }
    }
  }, [history?.location?.search]);

 const PurchaseOrderColumns: ColumnsType<any> = [
  {
    title: 'Order No#',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
   sorter: true,
   sortOrder: sortedInfo?.columnKey === 'invoiceNumber' && sortedInfo?.order,
    render: (data, row, index) => (
      <Link to={`/app${ISupportedRoutes.PURCHASES}/${row.id}`}>{data}</Link>
    ),
  },

  {
    title: 'Ref',
    dataIndex: 'reference',
    key: 'reference',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'reference' && sortedInfo?.order,
  },
  {
    title: 'Supplier',
    dataIndex: 'contact',
    key: 'contact',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'contact' && sortedInfo?.order,
    render: (data, row, index) => (
      <Link
        to={`${ISupportedRoutes.DASHBOARD_LAYOUT}${ISupportedRoutes?.CONTACTS}/${data?.id}?type=supplier`}
      >
        <Capitalize>{data ? data.name : '-'}</Capitalize>
      </Link>
    ),
  },

  {
    title: 'Date Raised',
    dataIndex: 'issueDate',
    key: 'issueDate',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'issueDate' && sortedInfo?.order,
    render: (data, row, index) => (
      <>{dayjs(data).format(`	MMMM D, YYYY h:mm A`)}</>
    ),
  },
  {
    title: 'Delivery Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'dueDate' && sortedInfo?.order,
    render: (data, row, index) => (
      <>{(data && dayjs(data).format(`MMMM D, YYYY h:mm A`)) || `-`}</>
    ),
  },
  {
    title: 'Paid Amount',
    dataIndex: 'paid_amount',
    key: 'paid_amount',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'paid_amount' && sortedInfo?.order,
    render: (data) => {
      return <>{data ? moneyFormat(Math.abs(data)) : moneyFormat(0)}</>;
    },
  },
  {
    title: 'Due Amount',
    dataIndex: 'due_amount',
    key: 'due_amount',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'due_amount' && sortedInfo?.order,
    render: (data) => {
      return <>{data ? moneyFormat(Math.abs(data)) : moneyFormat(0)}</>;
    },
  },
  {
    title: 'Items',
    dataIndex: 'purchaseItems',
    key: 'purchaseItems',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'purchaseItems' && sortedInfo?.order,
    render: (data: any[]) => (
      <>{data.length === 1 ? `${data.length} Item` : `${data.length} Items`}</>
    ),
  },

  {
    title: 'Total',
    dataIndex: 'netTotal',
    key: 'netTotal',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'netTotal' && sortedInfo?.order,
    render: (data) => <>{data ? moneyFormat(data) : '-'}</>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'status' && sortedInfo?.order,
    render: (data, row, index) => {
      const rowData = plainToClass(InvoiceResultClass, row);
      return <>{row && rowData.getStatus()}</>;
    },
  },
];

 const PDFColsBills: ColumnsType<any> = [
  {
    title: 'Order No#',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
  },

  {
    title: 'Ref',
    dataIndex: 'reference',
    key: 'reference',
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
    render: (data, row, index) => dayjs(data).format(`	MMMM D, YYYY`),
  },
  {
    title: 'Delivery Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    render: (data, row, index) =>
      (data && dayjs(data).format(`MMMM D, YYYY`)) || `-`,
  },
  {
    title: 'Paid Amount',
    dataIndex: 'paid_amount',
    key: 'paid_amount',
    render: (data) => {
      return data ? moneyFormat(Math.abs(data)) : moneyFormat(0);
    },
  },
  {
    title: 'Due Amount',
    dataIndex: 'due_amount',
    key: 'due_amount',
    render: (data) => {
      return data ? moneyFormat(Math.abs(data)) : moneyFormat(0);
    },
  },

  {
    title: 'Total',
    dataIndex: 'netTotal',
    key: 'netTotal',
    render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
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

 const _csvExportable: ITableExportFields = {
  invoiceNumber: 'Order Number',
  reference: 'Reference',
  isReturn: {
    header: 'Return',
    formatter: (data) => {
      return data === true ? 'Returned' : '';
    },
  },

  contact: {
    header: 'Supplier',
    formatter: (data) => {
      return data?.name;
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
  paid_amount: 'Paid Amount',
  due_amount: 'Due Amount',

  netTotal: {
    header: 'Total',
    formatter: (data) => (data ? data : ''),
  },
};

return {_csvExportable, PDFColsBills, PurchaseOrderColumns }

}
