/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { FC, useEffect, useState, lazy, Suspense } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getAllTransactionsAPI } from '../../../../api';
import {
  SmartFilter,
  CommonTable,
  TransactionApprovePdf,
  PDFICON,
} from '@components';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  IResponseTransactions,
  TransactionsStatus,
  IAccountsResult,
  ISupportedRoutes,
  ReactQueryKeys,
} from '@invyce/shared/types';
import moneyFormat from '../../../../utils/moneyFormat';
import { WrapperTransactionCustomBar, WrapperTransactionsList } from './styles';
import transactionsFilterSchema from './transactionsFilterSchema';
import { PDFDownloadLink } from '@react-pdf/renderer';
import DUMMYLOGO from '../../../../assets/quickbook.png';
import styled from 'styled-components';
import { Drawer } from 'antd';
import { TransactionDetail } from './Details';

const defaultSorterId = 'id';

const APPROVETransactionList: FC = () => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const [filterBar, setFilterbar] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [{ result, pagination }, setResponse] = useState<IResponseTransactions>(
    {
      result: [],
      pagination: null,
    }
  );
  const queryCache = useQueryClient();
  const [filterSchema, setFilterSchema] = useState(transactionsFilterSchema);
  const { routeHistory, userDetails } = useGlobalContext();
  const { history } = routeHistory;
  const { organization } = userDetails;
  const {
    address: organizationAddress,
    email: organizationEmail,
    phoneNumber: organizationContact,
    name: organizationName,
    website,
  } = organization;

  const { city, country, postalCode } = organizationAddress;

  const headerprops = {
    organizationName,
    city,
    country,
    title: 'Journal Entries',
    organizationContact,
    organizationEmail,
    address: '',
    code: postalCode,
    logo: DUMMYLOGO,
    website,
  };

  const [transactionConfig, setTransactionsConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 20,
    status: TransactionsStatus.APPROVE,
  });

  const { page, query, sortid, page_size, status } = transactionConfig;

  const [accountsResponse, setAccountsResponse] = useState<IAccountsResult[]>(
    []
  );

  useEffect(() => {
    if (history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setTransactionsConfig({ ...transactionConfig, ...obj });
    }
  }, []);

  // `transactions?page=${page}&query=${query}&page_size=${page_size}&status=${status}`,
  const { isLoading, data: resolvedData } = useQuery(
    [ReactQueryKeys.TRANSACTION_KEYS, page, page_size, query, status, sortid],
    getAllTransactionsAPI,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (resolvedData?.data?.result) {
      const { result, pagination } = resolvedData?.data;
      const newResult = [];

      result.forEach((res) => {
        newResult.push({ ...res, key: res.id });
      });

      setResponse({ ...resolvedData.data, result: newResult });

      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [
            ReactQueryKeys.TRANSACTION_KEYS,
            page + 1,
            page_size,
            query,
            status,
            sortid,
          ],
          getAllTransactionsAPI
        );
      }
    }
  }, [resolvedData]);

  /*Query hook for  Fetching all accounts against ID */
  // const allAccounts = useQuery([`all-accounts`, "ALL"], getAllAccounts);

  // useEffect(() => {
  //   if (
  //     allAccounts.data &&
  //     allAccounts.data.data &&
  //     allAccounts.data.data.result
  //   ) {
  //     const { result } = allAccounts.data.data;
  //     setAccountsResponse(result);
  //     let schema = { ...transactionsFilterSchema };
  //     schema.accountId.value = [...result];
  //     setFilterSchema(schema);
  //   }
  // }, [allAccounts.data]);

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 20,
    },
    {
      title: 'Ref',
      dataIndex: 'ref',
      key: 'ref',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'ref' && sortedInfo?.order,
      render: (data, row, index) => data,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'date' && sortedInfo?.order,
      render: (data) => {
        return <>{dayjs(data).format(`MMMM D, YYYY h:mm A`)}</>;
      },
    },

    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'narration' && sortedInfo?.order,
      render: (data, row, index) => <>{data ? data : '-'}</>,
    },
    {
      title: 'Note',
      dataIndex: 'notes',
      key: 'notes',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'notes' && sortedInfo?.order,
      render: (data, row, index) => <>{data ? data : '-'}</>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'amount' && sortedInfo?.order,
      render: (data, row, index) => <>{data ? moneyFormat(data) : '-'}</>,
    },
  ];

  const renderCustomTopbar = () => {
    return (
      <WrapperTransactionCustomBar>
        {result.length > 0 && (
          <PDFDownloadLinkWrapper
            document={
              <TransactionApprovePdf
                resultData={result as any}
                header={headerprops}
              />
            }
          >
            <div className="flex alignCenter">
              <PDFICON className="flex alignCenter mr-5" />

              <span> Download PDF</span>
            </div>
          </PDFDownloadLinkWrapper>
        )}

        {/* <TransactionImport/> */}

        <SmartFilter
          onFilter={(encode) => {
            setTransactionsConfig({
              ...transactionConfig,
              query: encode,
              page_size: 20,
              page: 1,
            });
            const route = `/app${ISupportedRoutes.TRANSACTIONS}?tabIndex=approve&sortid=null&page=1&page_size=20&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterbar(false)}
          visible={filterBar}
          formSchema={filterSchema}
        />
      </WrapperTransactionCustomBar>
    );
  };

  const onChangePagination = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter?.order === false) {
        setTransactionsConfig({
          ...transactionConfig,
          sortid: defaultSorterId,
          page: pagination.current,
          page_size: pagination.pageSize,
        });

        const route = `/app${ISupportedRoutes.TRANSACTIONS}?tabIndex=approve&sortid=${sortid}&page=${pagination.current}&page_size=${pagination.pageSize}`;
        history.push(route);
      } else {
        setTransactionsConfig({
          ...transactionConfig,
          page: pagination.current,
          page_size: pagination.pageSize,
          sortid:
            sorter.order === 'descend' ? `-${sorter.field}` : sorter.field,
        });
        setSortedInfo({
          order: sorter.order,
          columnKey: sorter.columnKey,
        });
        const route = `/app${
          ISupportedRoutes.TRANSACTIONS
        }?tabIndex=approve&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${pagination.pageSize}`;
        history.push(route);
      }
    } else {
      setTransactionsConfig({
        ...transactionConfig,
        sortid: defaultSorterId,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      setSortedInfo(null);
      const route = `/app${ISupportedRoutes.TRANSACTIONS}?tabIndex=approve&sortid=${defaultSorterId}&page=${pagination.current}&page_size=${pagination.pageSize}`;
      history.push(route);
    }
  };

  const pageSizeOptions = [
    10,
    20,
    50,
    100,
    250,
    pagination?.total ? pagination.total : 0,
  ].sort((a, b) => {
    return a - b;
  });

  return (
    <WrapperTransactionsList>
      <CommonTable
        onRow={(data) => {
          return {
            onClick: () => {
              setSelectedRow(data);
            },
          };
        }}
        // expandable={{
        //   expandedRowRender: (record, index) => {
        //     return (
        //       <>
        //         <PDFDownloadLink
        //           document={
        //             <TransactionItem header={headerprops} resultData={record} />
        //           }
        //         >
        //           <div className="flex alignCenter">
        //             <PDFICON className="flex alignCenter mr-5" />

        //             <span> Download PDF</span>
        //           </div>
        //         </PDFDownloadLink>
        //         <br />
        //         <TransactionItemTable
        //           allAccounts={accountsResponse}
        //           data={record.transactionItems}
        //         />
        //       </>
        //     );
        //   },
        // }}
        customTopbar={renderCustomTopbar()}
        data={result}
        columns={columns}
        loading={isLoading}
        onChange={onChangePagination}
        totalItems={pagination?.total}
        enableRowSelection
        pagination={{
          pageSize: pagination?.page_size,
          position: ['bottomRight'],
          current: pagination?.page_no,
          total: pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: [
            ...pageSizeOptions.map((item) => {
              return JSON.stringify(item);
            }),
          ],
        }}
        hasfooter={true}
      />
      <TransactionDetail
        onClose={() => setSelectedRow(null)}
        visible={!!selectedRow}
        data={selectedRow}
      />
    </WrapperTransactionsList>
  );
};
export default APPROVETransactionList;

const PDFDownloadLinkWrapper = styled(PDFDownloadLink)`
  background: #e4e4e4;
  padding: 5px 5px;
  border-radius: 2px;
  margin-right: 8px;
  color: #333333;
  border: none;
  outline: none;
  transition: 0.4s all ease-in-out;
  &:hover {
    background: #143c69;
    color: #ffff;
  }
`;
