import React, { FC, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { plainToClass } from 'class-transformer';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { getContactLedger } from '../../../api';
import { Loader } from '../../../components/Loader';
import { BoldText } from '../../../components/Para/BoldText';
import { SmartFilter } from '../../../components/SmartFilter';
import { CommonTable } from '../../../components/Table';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IContactLedgerResp,
  IContactLedgerResponse,
  IContactTypes,
  IEntryType,
} from '../../../modal';
import { ISupportedRoutes } from '../../../modal/routing';
import moneyFormat from '../../../utils/moneyFormat';
import FilterSchema from './ledgerFilterSchema';
import { Link } from 'react-router-dom';

interface IProps {
  id?: number;
  type?: IContactTypes;
}

export const LedgerList: FC<IProps> = ({ id, type }) => {
  const accessor = type === IContactTypes.SUPPLIER ? 'bill' : 'invoice';

  const [{ pagination, result, contact }, setResponse] =
    useState<IContactLedgerResponse>({
      pagination: {},
      result: [],
      opening_balance: null,
      contact: null,
    });

  const [filterBar, setFilterbar] = useState<boolean>(false);
  const [ledgerConfig, setLedgerConfig] = useState({
    query: '',
    page: 1,
    page_size: 20,
    sortid: 'id',
  });

  const { query, page, page_size, sortid } = ledgerConfig;

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

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

  const { isLoading, data: resolvedData } = useQuery(
    [
      `ledger-contact-${id}?type=${type}&page=${page}&pageSize=${page_size}&query=${query}`,
      id,
      type,
      query,
      page_size,
      page,
    ],

    getContactLedger,
    {
      enabled: !!id,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const resolvedResult = plainToClass(
        IContactLedgerResp,
        resolvedData.data
      );

      const contact_ledger: any =
        (resolvedResult.result && resolvedResult.getGeneratedResult()) || [];
      setResponse({
        ...resolvedResult,
        result: contact_ledger,
        contact: resolvedData?.data?.contact,
      });
    }
  }, [resolvedData]);

  const columns: ColumnsType<any> = [
    {
      title: 'Invoice Number',
      dataIndex: `${type === IContactTypes.CUSTOMER ? `invoice` : 'bill'}`,
      key: 'invoice',
      render: (data, row, index) => {
        return (
          <Link
            to={`/app${
              ISupportedRoutes[
                type === IContactTypes.CUSTOMER ? 'INVOICES_VIEW' : 'PURCHASES'
              ]
            }/${data?.id}`}
          >
            {data?.invoiceNumber}
          </Link>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: `${type === IContactTypes.CUSTOMER ? `invoice` : 'bill'}`,
      key: 'date',
      render: (data, row, index) => {
        return <>{dayjs(data?.issueDate).format(`MMMM D, YYYY h:mm A`)}</>;
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (data) => {
        return <>{data ? data : '-'}</>;
      },
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (data) => (
        <>{data ? dayjs(data).format(`MMMM D, YYYY h:mm A`) : '-'}</>
      ),
    },
    {
      title: 'Debit',
      dataIndex: 'entryType',
      key: 'entryType',
      render: (data, row, index) => {
        console.log(row, data, index, 'debit');
        const renderDebit = () => {
          return data === IEntryType.DEBIT || data === IEntryType?.DEBIT_NOTE
            ? moneyFormat(row.amount)
            : '-';
        };

        return <>{renderDebit()}</>;
      },
    },
    {
      title: 'Credits',
      dataIndex: 'entryType',
      key: 'entryType',
      render: (data, row) => {
        const renderCredits = () => {
          return data === IEntryType.CREDIT || data === IEntryType?.CREDIT_NOTE
            ? moneyFormat(row.amount)
            : '-';
        };
        return <>{renderCredits()}</>;
      },
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (data) => {
        return <BoldText>{moneyFormat(data)}</BoldText>;
      },
    },
  ];

  const handleContactsConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter.order === undefined) {
      history.push(
        `/app${ISupportedRoutes.CONTACTS}/${id}?type=${
          type === 1 ? 'customer' : 'supplier'
        }&sortid=${sortid}&page=${pagination.current}&page_size=${
          pagination.pageSize
        }&query=${query}`
      );
      setLedgerConfig({
        ...ledgerConfig,
        sortid: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
    } else {
      history.push(
        `/app${ISupportedRoutes.CONTACTS}?type=${
          type === 1 ? 'customer' : 'supplier'
        }&sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${
          pagination.pageSize
        }&query=${query}`
      );
      setLedgerConfig({
        ...ledgerConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field,
      });
    }
  };

  const renderCustomTopbar = () => {
    return (
      <div className="search flex alignCenter justifyFlexEnd pv-10 ">
        <SmartFilter
          onFilter={(encode) => {
            const route = `/app${ISupportedRoutes.CONTACTS}/${id}?sortid=${sortid}&page=1&page_size=20&query=${encode}`;
            history.push(route);
            setLedgerConfig({ ...ledgerConfig, query: encode });
          }}
          onClose={() => setFilterbar(false)}
          visible={filterBar}
          formSchema={FilterSchema}
        />
      </div>
    );
  };

  const sorterOptins = [10, 20, 50, 100, 250, pagination?.total]
    .sort((a, b) => {
      return a - b;
    })
    .map((i) => JSON.stringify(i));

  return (
    <WrapperContactLedger>
      {isLoading ? (
        <div className="flex alignCenter justifyCenter wrapper-loader">
          <Loader />
        </div>
      ) : (
        <CommonTable
          printTitle={`${contact?.name.toLocaleUpperCase()} Ledger`}
          size="middle"
          customTopbar={<></>}
          hasPrint
          topbarRightPannel={renderCustomTopbar()}
          columns={columns}
          data={result}
          onChange={handleContactsConfig}
          totalItems={pagination?.total}
          pagination={{
            pageSize: pagination.page_size,
            position: ['bottomRight'],

            current: pagination?.page_no,
            total: pagination?.total,
            showSizeChanger: true,
            pageSizeOptions: [...sorterOptins],
          }}
          hasfooter={true}
        />
      )}
    </WrapperContactLedger>
  );
};

const WrapperContactLedger = styled.div`
  .wrapper-loader {
    min-height: 70vh;
  }

  .ant-table-cell {
    padding: 12px 16px !important;
  }
`;
