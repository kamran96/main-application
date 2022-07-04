import React, { useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { ISupportedRoutes, TRANSACTION_MODE } from '../../../modal';
import dayjs from 'dayjs';
import moneyFormat from '../../../utils/moneyFormat';
import { useQuery } from 'react-query';
import { getAllContacts } from '../../../api';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

export const useCols = () => {
  /*Query hook for  Fetching all accounts against ID */
  const { isLoading, data } = useQuery([`all-contacts`, 'ALL'], getAllContacts);
  const [sortedInfo, setSortedInfo] = useState(null);
  const getContactbyId = (id) => {
    if (data && data.data && data.data.result) {
      const [filtered] = data.data.result.filter((flt) => flt.id === id);
      return filtered;
    }
  };
  const { routeHistory } = useGlobalContext();
  const history = useHistory();

  useEffect(() => {
    if (routeHistory?.history?.location?.search) {
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
  }, [routeHistory]);

  const columns: ColumnsType<any> = [
    {
      title: 'Contact',
      dataIndex: 'contactId',
      key: 'contactId',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'contactId' && sortedInfo?.order,
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
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'comment' && sortedInfo?.order,
      render: (data) => <div>{data ? data : '-'}</div>,
    },
    {
      title: 'Invoice',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'invoiceId' && sortedInfo?.order,
      render: (data) => <div>{data ? data : '-'}</div>,
    },
    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
      key: 'paymentMode',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'paymentMode' && sortedInfo?.order,
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
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'createdAt' && sortedInfo?.order,
      render: (data, row, index) => (
        <>{dayjs(data).format(`MM/DD/YYYY h:mm A`)}</>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'amount' && sortedInfo?.order,
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
