import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import dayJs from 'dayjs';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '../../../modal';
import { ITableExportFields } from 'ant-table-extensions';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useCols = () => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (history?.location?.search) {
      const filterType = history?.location?.search.split('&');
      const filterIdType = filterType[1];
      const filterOrder = filterType[4]?.split('=')[1];

      console.log(filterType);

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

  const columns: ColumnsType<any> = [
    {
      title: 'Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'invoiceNumber' && sortedInfo?.order,
      render: (data, row) => (
        <Link to={`/app${ISupportedRoutes.CREDIT_NOTES}/${row?.id}`}>
          {data}
        </Link>
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
      title: 'To',
      dataIndex: 'contact',
      key: 'contact',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'contact' && sortedInfo?.order,
      render: (data, row, index) => {
        return <>{data?.name}</>;
      },
    },
    {
      title: 'Data',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'issueDate' && sortedInfo?.order,
      render: (data) => (
        <>{data ? dayJs(data).format('MMMM D, YYYY h:mm A') : '-'}</>
      ),
    },

    {
      title: 'Amount',
      dataIndex: 'netTotal',
      key: 'netTotal',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'netTotal' && sortedInfo?.order,
    },

    {
      title: 'Items',
      dataIndex: 'creditNoteItems',
      key: 'creditNoteItems',
      render: (data) => (
        <>
          {data?.length > 1 ? `${data?.length} items` : `${data?.length} item`}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'status' && sortedInfo?.order,
      render: (data) => (data === 1 ? 'Aproved' : 'Draft'),
    },
  ];

  const csvColumns: ITableExportFields = {
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

  const pdfCols: ColumnsType<any> = [
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
      render: (data) =>
        data ? dayJs(data).format('MMMM D, YYYY h:mm A') : '-',
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

  return { pdfCols, csvColumns, columns };
};
