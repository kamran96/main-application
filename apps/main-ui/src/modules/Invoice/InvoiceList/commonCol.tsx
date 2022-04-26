import { ITableExportFields } from 'ant-table-extensions';
import { ColumnsType } from 'antd/es/table';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { InvoiceResultClass } from '../../../modal/invoice';
import { ISupportedRoutes } from '../../../modal/routing';
import moneyFormat from '../../../utils/moneyFormat';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useCols = () => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (history?.location?.search) {
      const filterType = history.location.search.split('&');
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


 const InvoiceColumns: ColumnsType<any> = [
  {
    title: 'Number',
    dataIndex: 'invoiceNumber',
    key: 'invoiceNumber',
    sorter: true,
   sortOrder: sortedInfo?.columnKey === 'invoiceNumber' && sortedInfo?.order,
    render: (data, row, index) => (
      <Link to={`/app${ISupportedRoutes.INVOICES_VIEW}/${row.id}`}>{data}</Link>
    ),
  },
  {
    title: 'Ref',
    dataIndex: 'reference',
    key: 'reference',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'reference' && sortedInfo?.order
  },
  {
    title: 'To',
    dataIndex: 'contact',
    key: 'contact',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'contact' && sortedInfo?.order,
    render: (contact, row, index) => {
      return contact ? (
        <Link
          to={`${ISupportedRoutes.DASHBOARD_LAYOUT}${ISupportedRoutes.CONTACTS}/${row?.id}?type="customer"`}
        >
          {contact.name}
        </Link>
      ) : (
        '-'
      );
    },
  },

  {
    title: 'Date',
    dataIndex: 'issueDate',
    key: 'issueDate',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'issueDate' && sortedInfo?.order,
    render: (data, row, index) => {
      return data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-';
    },
  },
  {
    title: 'Due Date',
    dataIndex: 'dueDate',
    key: 'dueDate',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'dueDate' && sortedInfo?.order,
    render: (data, row, index) => {
      return data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-';
    },
  },
  {
    title: 'Paid Amount',
    dataIndex: 'paid_amount',
    key: 'paid_amount',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'paid_amount' && sortedInfo?.order,
    render: (data) => {
      return data ? moneyFormat(Math.abs(data)) : '-';
    },
  },
  {
    title: 'Due',
    dataIndex: 'due_amount',
    key: '',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'due_amount' && sortedInfo?.order,
    render: (data) => {
      return data ? moneyFormat(Math.abs(data)) : '-';
    },
  },
  {
    title: 'Items',
    dataIndex: 'invoiceItems',
    key: 'invoiceItems',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'invoiceItems' && sortedInfo?.order,
    render: (data: any[]) =>
      data.length === 1 ? `${data.length} Item` : `${data.length} Items`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'status' && sortedInfo?.order,
    render: (data, row, index) => {
      const rowData = plainToClass(InvoiceResultClass, row);
      return row && rowData.getStatus();
    },
  },
  {
    title: 'Created By',
    dataIndex: 'created_by',
    key: 'created_by',
    sorter: true,
    sortOrder: sortedInfo?.columnKey === 'created_by' && sortedInfo?.order,
    render: (data, row, index) => {
      return data?.owner?.profile?.fullName;
    },
  },
];

const _exportableCols: ITableExportFields = {
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
    formatter: (data: number) => {
      return data ? Math.abs(data).toString() : '-';
    },
  },
  due_amount: {
    header: 'Due',
    formatter: (data, record) => {
      return data ? Math.abs(data).toString() : '-';
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

const PdfCols: ColumnsType<any> = [
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
    dataIndex: 'due_amount',
    key: '',
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
  return {PdfCols, _exportableCols, InvoiceColumns}
}