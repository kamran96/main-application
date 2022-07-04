import { ITableExportFields } from 'ant-table-extensions';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ISupportedRoutes } from '../../../../../modal';
import moneyFormat from '../../../../../utils/moneyFormat';

export const useCols  = () => {

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
        <Link to={`/app${ISupportedRoutes.PURCHASE_ORDER}/${row.id}`}>
          {data}
        </Link>
      ),
    },
    {
      title: 'Order Type',
      dataIndex: 'invoiceType',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'invoiceType' && sortedInfo?.order,
      render: (data) => (
        <>{data === 'POE' ? 'Purchase Entry' : 'Purchase Order'}</>
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
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'comment' && sortedInfo?.order,
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
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'contact' && sortedInfo?.order,
      render: (data, row, index) => <>{data ? data.name : '-'}</>,
    },
  
    {
      title: 'Date Raised',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'issueDate' && sortedInfo?.order,
      render: (data, row, index) => (
        <>{dayjs(data).format(`MMMM D, YYYY h:mm A`)}</>
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
      title: 'Items',
      dataIndex: 'purchaseOrderItems',
      key: 'purchaseOrderItems',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'purchaseOrderItems' && sortedInfo?.order,
      render: (data: any[]) => (
        <>{data.length === 1 ? `${data.length} Item` : `${data.length} Items`}</>
      ),
    },
  ];
  
   const pdfColsPO: ColumnsType<any> = [
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
  
   const _csvColumns: ITableExportFields = {
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
    purchaseOrderItems: {
      header: 'Items Count',
      formatter: (data) => {
        return data.length;
      },
    },
  };
  
  return {PurchaseOrderColumns, _csvColumns, pdfColsPO}
}