import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { ISupportedRoutes, TRANSACTION_MODE } from '../../../modal';
import dayjs from 'dayjs';
import moneyFormat from '../../../utils/moneyFormat';
import { useQuery } from 'react-query';
import { getAllContacts } from '../../../api';
import { Link } from 'react-router-dom';
import { View } from '@react-pdf/renderer';

export const useCols = () => {
  /*Query hook for  Fetching all accounts against ID */
  const { isLoading, data } = useQuery([`all-contacts`, 'ALL'], getAllContacts);

  const getContactbyId = (id) => {
    if (data && data.data && data.data.result) {
      const [filtered] = data.data.result.filter((flt) => flt.id === id);
      return filtered;
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Contact',
      dataIndex: 'contactId',
      key: 'contactId',
      render: (data, row, index) => (
        <div>
          {data && !isLoading && getContactbyId(data) ? (
            <Link to={`/app${ISupportedRoutes.CONTACTS}/${data}`}>
              {getContactbyId(data).name}
            </Link>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (data) => <div>{data ? data : '-'}</div>,
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      render: (data) => <div>{data ? data : '-'}</div>,
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
      render: (data, row, index) => (
        <div>
          {data === TRANSACTION_MODE.PAYABLES
            ? 'Payables'
            : data === TRANSACTION_MODE.RECEIVABLES
            ? 'Receivable'
            : '-'}
        </div>
      ),
    },
    {
      title: 'date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (data, row, index) => (
        <>{dayjs(data).format(`MM/DD/YYYY h:mm A`)}</>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (data) => <div>{data ? moneyFormat(Math.abs(data)) : '-'}</div>,
    },
  ];

  // const pdfColumns: ColumnsType<any> = [
  //   {
  //     title: 'Contact',
  //     dataIndex: 'contactId',
  //     key: 'contactId',
  //     render: (data, row, index) => (
  //       <View>
  //         {data && !isLoading && getContactbyId(data) ? (
  //           <Link to={`/app${ISupportedRoutes.CONTACTS}/${data}`}>
  //             {getContactbyId(data).name}
  //           </Link>
  //         ) : (
  //           '-'
  //         )}
  //       </View>
  //     ),
  //   },
  //   {
  //     title: 'Comment',
  //     dataIndex: 'comment',
  //     key: 'comment',
  //     render: (data) => <div>{data ? data : '-'}</div>,
  //   },
  //   {
  //     title: 'Invoice',
  //     dataIndex: 'invoiceId',
  //     key: 'invoiceId',
  //     render: (data) => <div>{data ? data : '-'}</div>,
  //   },
  //   {
  //     title: 'Payment Mode',
  //     dataIndex: 'paymentMode',
  //     key: 'paymentMode',
  //     render: (data, row, index) => (
  //       <div>
  //         {data === TRANSACTION_MODE.PAYABLES
  //           ? 'Payables'
  //           : data === TRANSACTION_MODE.RECEIVABLES
  //           ? 'Receivable'
  //           : '-'}
  //       </div>
  //     ),
  //   },
  //   {
  //     title: 'date',
  //     dataIndex: 'createdAt',
  //     key: 'createdAt',
  //     render: (data, row, index) => (
  //       <>{dayjs(data).format(`MM/DD/YYYY h:mm A`)}</>
  //     ),
  //   },
  //   {ss
  //     title: 'Amount',
  //     dataIndex: 'amount',
  //     key: 'amount',
  //     render: (data) => <div>{data ? moneyFormat(Math.abs(data)) : '-'}</div>,
  //   },
  // ];

  return { columns };
};
