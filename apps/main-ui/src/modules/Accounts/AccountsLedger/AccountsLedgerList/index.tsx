/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnsType } from 'antd/es/table';
import { ITableColumns } from '../../../../components/PDFs/PDFTable';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getAccountLedger } from '../../../../api/accounts';
import { Loader } from '../../../../components/Loader';
import { BoldText } from '../../../../components/Para/BoldText';
import { SmartFilter } from '../../../../components/SmartFilter';
import { CommonTable } from '../../../../components/Table';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ISupportedRoutes, TransactionsType } from '../../../../modal';
import {
  IAccountLederResponse,
  IAccountLedgerResult,
} from '../../../../modal/accountLedger';
import moneyFormat from '../../../../utils/moneyFormat';
import FilterSchema from './AccountLedgerFilterSchema';
import { Text } from '@react-pdf/renderer';

interface IProps {
  id?: number;
  accountName?: string;
}

export const AccountsLedgerList: FC<IProps> = ({ id, accountName }) => {
  const [{ result, pagination }, setResponse] = useState<IAccountLederResponse>(
    {
      result: [],
      pagination: {},
    }
  );

  const [ledgerConfig, setLedgerConfig] = useState({
    query: '',
    page_size: 20,
    page: 1,
  });
  const { query, page, page_size } = ledgerConfig;

  const [filterBar, setFilterBar] = useState(false);
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

  /* Paginated query to fetch latest data */
  const { data, isLoading } = useQuery(
    [
      `account-ledger-${id}&page_size=${page_size}&page_no=${page}query=${query}`,
      id,
      page_size,
      page,
      query,
    ],
    getAccountLedger,
    {
      enabled: !!id,
    }
  );


  useEffect(() => {
    if (history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setLedgerConfig({ ...ledgerConfig, ...obj });
    }
  }, [history]);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const newResult = plainToClass(
        IAccountLedgerResult,
        data.data
      ).getResult();

      setResponse({ ...data.data, result: newResult });
    }
  }, [data]);

  const columns: ColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (data, row, index) => {
        return (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {!row.lastIndex ? (
              dayjs(data).format(`MMMM D, YYYY`)
            ) : (
              <BoldText>Total</BoldText>
            )}
          </>
        );
      },
    },
    {
      title: 'Particular',
      dataIndex: 'account',
      key: 'account',
      render: (data, row, index) => {
        return <>{data ? data.name : '-'}</>;
      },
    },
    {
      title: 'Narration',
      dataIndex: 'transaction',
      key: 'transaction',
      render: (data, row, index) => {
        return <>{data ? data.narration : '-'}</>;
      },
    },
    {
      title: 'Debit',
      dataIndex: 'transactionType',
      key: 'transactionType',
      render: (data, row, index) => {
        return (
          <>
            {!row.lastIndex ? (
              <>
                {(data && data === TransactionsType.CREDIT && row.amount) ||
                  '-'}
              </>
            ) : (
              <BoldText>{moneyFormat(row.totalDebits)}</BoldText>
            )}
          </>
        );
      },
    },
    {
      title: 'Credit',
      dataIndex: 'transactionType',
      key: 'transaction_type',
      render: (data, row, index) => {
        return (
          <>
            {!row.lastIndex ? (
              <>
                {(data && data === TransactionsType.DEBIT && row.amount) || '-'}
              </>
            ) : (
              <BoldText>{moneyFormat(row.totalCredits)}</BoldText>
            )}
          </>
        );
      },
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (data, row, index) => (
        <>{!row.lastIndex ? data : <BoldText>{moneyFormat(data)}</BoldText>}</>
      ),
    },
  ];

  const renderTableTopbarRight = () => {
    return (
      <div className="search flex alignCenter justifyFlexEnd pv-10 ">
        <SmartFilter
          onFilter={(encode) => {
            const route = `/app${
              ISupportedRoutes.ACCOUNTS
            }/${id}?&page=${1}&page_size=${
              pagination.page_size
            }&query=${encode}`;
            history.push(route);
            setLedgerConfig({ ...ledgerConfig, query: encode, page: 1 });
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={FilterSchema}
        />
      </div>
    );
  };

  const handleTableChange = (pagination, filters, sorter: any, extra) => {
    history.push(
      `/app${ISupportedRoutes.ACCOUNTS}/${id}?&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
    );
    setLedgerConfig({
      ...ledgerConfig,
      page: pagination.current,
      page_size: pagination.pageSize,
    });
  };

  const pageSizeOptions = [10, 20, 50, 100, 250, pagination.total]
    .sort((a, b) => {
      return a - b;
    })
    .map((item) => {
      return JSON.stringify(item);
    });

  return (
    <WrapperAccountLedger>
      {isLoading ? (
        <div className="loading-wrapper flex alignCenter justifyCenter">
          <Loader />
        </div>
      ) : (
        <CommonTable
          pdfExportable={{
            columns: pdfCols,
          }}
          printTitle={`Ledger Report: ${accountName}`}
          size="middle"
          hasPrint
          onChange={handleTableChange}
          customTopbar={<></>}
          topbarRightPannel={renderTableTopbarRight()}
          data={result}
          columns={columns}
          totalItems={pagination.total}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: [...pageSizeOptions],
            pageSize: pagination && pagination.page_size + 1,
            position: ['bottomRight'],
            current: pagination.page_no,
            total: pagination && pagination.total,
          }}
          hasfooter={true}
        />
      )}
    </WrapperAccountLedger>
  );
};

const WrapperAccountLedger = styled.div`
  min-height: 70vh;
  padding: 10px 0;
  .loading-wrapper {
    min-height: 70vh;
  }
`;

const pdfCols: ITableColumns[] = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (data, row, index) => {
      return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        !row.lastIndex ? (
          dayjs(data).format(`MMMM D, YYYY`)
        ) : (
          <Text style={{ fontWeight: 600 }}>Total</Text>
        )
      );
    },
  },
  {
    title: 'Particular',
    dataIndex: 'account',
    key: 'account',
    render: (data, row, index) => {
      return data ? data.name : '-';
    },
  },
  {
    title: 'Narration',
    dataIndex: 'owner',
    key: 'owner',
    render: (data, row, index) => {
      return data ? data.narration : '-';
    },
  },
  {
    title: 'Debit',
    dataIndex: 'transactionType',
    key: 'transactionType',
    render: (data, row, index) => {
      return !row.lastIndex ? (
        (data && data === TransactionsType.CREDIT && row.amount) || '-'
      ) : (
        <Text style={{ fontWeight: 'black' }}>
          {moneyFormat(row.totalDebits)}
        </Text>
      );
    },
  },
  {
    title: 'Credit',
    dataIndex: 'transactionType',
    key: 'transaction_type',
    render: (data, row, index) => {
      return !row.lastIndex ? (
        (data && data === TransactionsType.DEBIT && row.amount) || '-'
      ) : (
        <Text style={{ fontWeight: 'black' }}>
          {moneyFormat(row.totalCredits)}
        </Text>
      );
    },
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (data, row, index) =>
      !row.lastIndex ? (
        data
      ) : (
        <Text style={{ fontWeight: 'black' }}>{moneyFormat(data)}</Text>
      ),
  },
];
