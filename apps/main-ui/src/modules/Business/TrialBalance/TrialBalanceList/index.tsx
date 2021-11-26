/* eslint-disable no-mixed-operators */
import { ColumnsType } from 'antd/lib/table';
import { FC, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { TrialbalanceAPI } from '../../../../api';
import { Heading } from '../../../../components/Heading';
import { BoldText } from '../../../../components/Para/BoldText';
import { SmartFilter } from '../../../../components/SmartFilter';
import { CommonTable } from '../../../../components/Table';
import { TableCard } from '../../../../components/TableCard';
import { ISupportedRoutes } from '../../../../modal';
import { IAccountsResult } from '../../../../modal/accounts';
import moneyFormat from '../../../../utils/moneyFormat';
import FilterSchema from './filterSchema';
import { _csvColumnsTrialBalance } from './exportableCols';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import dayjs from 'dayjs';
import { P } from '../../../../components/Typography';
interface IExtendedValues extends IAccountsResult {
  credit: number;
  debit: number;
}

export const TrialBalanceList: FC = () => {
  const [config, setConfig] = useState({
    query: '',
  });
  const { query } = config;
  const [result, setResult] = useState<IExtendedValues[]>([]);

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
      setConfig({ ...config, ...obj });
    }
  }, [history]);

  const { data, isLoading, isFetched } = useQuery(
    [`report-trialbalance-query=${query}`, query],
    TrialbalanceAPI
  );

  useEffect(() => {
    if (data?.data?.result) {
      const { result: newResult } = data?.data;

      setResult(newResult);
    }
  }, [data]);

  const searchedQueryItem: any = useMemo(() => {
    return query ? JSON.parse(atob(query)) : query;
  }, [query]);

  const cols: ColumnsType<any> = [
    {
      title: 'Particulars',
      dataIndex: 'name',
      key: 'name',
      render: (data, row, index) => {
        if (row.isLastIndex) {
          return <BoldText>{data}</BoldText>;
        } else {
          return data;
        }
      },
    },
    searchedQueryItem?.date && isFetched
      ? {
          title: 'Opening Balance',
          dataIndex: 'opening_balance',
          key: 'opening_balance',
          className: 'static-width',
          render: (data, row, index) => {
            if (row.isLastIndex) {
              return null;
            } else {
              return data;
            }
          },
        }
      : {},
    {
      title: 'Debit',
      dataIndex: 'debit',
      className: 'static-width',
      key: 'debit',
      render: (data, row, index) => {
        if (row.isLastIndex) {
          return <BoldText>{moneyFormat(data.toFixed(2))}</BoldText>;
        } else {
          return data ? data.toFixed(2) : '';
        }
      },
    },
    {
      title: 'Credit',
      dataIndex: 'credit',
      className: 'static-width',

      key: 'credit',
      render: (data, row, index) => {
        if (row.isLastIndex) {
          return <BoldText>{moneyFormat(data.toFixed(2))}</BoldText>;
        } else {
          return data ? data.toFixed(2) : '';
        }
      },
    },
    searchedQueryItem?.date && isFetched
      ? {
          title: 'Closing balance',
          dataIndex: 'closing_balance',
          key: 'closing_balance',
          className: 'static-width',
          render: (data, row, index) => {
            if (row.isLastIndex) {
              return null;
            } else {
              return Math.abs(data);
            }
          },
        }
      : {},
  ];

  const renderDate = () => {
    if (searchedQueryItem?.date) {
      return (
        <>
          From the month of{' '}
          <>
            {searchedQueryItem.date.value.map((item, index) => {
              return (
                <span key={index}>
                  {dayjs(item).format('MMMM D, YYYY')}&nbsp;
                  {searchedQueryItem.date.value.length - 1 !== index && 'to'}
                </span>
              );
            })}
          </>
        </>
      );
    } else if (searchedQueryItem?.dateIn) {
      return (
        <>
          From {dayjs(searchedQueryItem?.dateIn?.value).format('MMMM D, YYYY')}{' '}
          to the start of this Business
        </>
      );
    } else {
      return (
        <>
          From Today ({dayjs().format('MMMM D, YYYY')}) to the Start of Business
        </>
      );
    }
  };

  const renderTableHeaderLeft = () => {
    return (
      <div className="flex alignCenter justifySpaceBetween pv-20">
        <div>
          <Heading type="form-inner">Trial Balance</Heading>
          <P className="mr-20">{renderDate()}</P>
        </div>
      </div>
    );
  };

  return (
    <WrapperTrialBalanceList>
      <TableCard className="card-wrapper">
        <CommonTable
          loading={isLoading}
          exportableProps={{
            fields: _csvColumnsTrialBalance,
            fileName: 'trialbalance',
          }}
          customTopbar={renderTableHeaderLeft()}
          topbarRightPannel={
            <SmartFilter
              formSchema={FilterSchema}
              onFilter={(q) => {
                history.push(
                  `/app${ISupportedRoutes.TRIAL_BALANCE}?query=${q}`
                );
                setConfig({ ...config, query: q });
              }}
            />
          }
          hasPrint
          printTitle={'Trial Balance'}
          exportable
          tableType={'default'}
          pagination={false}
          columns={cols}
          dataSource={result}
        />
        {/* <table className="trialbalance-table">
          <thead>
            <tr>
              <th>Particulars</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            {result?.map((account: IExtendedValues, index: number) => {
              let title =
                result.length - 1 === index ? (
                  <BoldText>{account.name}</BoldText>
                ) : (
                  account.name
                );
              let debit =
                result.length - 1 === index ? (
                  <BoldText>{moneyFormat(account.debit.toFixed(2))}</BoldText>
                ) : (
                  account.debit.toFixed(2)
                );
              let credit =
                result.length - 1 === index ? (
                  <BoldText>{moneyFormat(account.credit.toFixed(2))}</BoldText>
                ) : (
                  account.credit.toFixed(2)
                );
              return (
                <tr className="">
                  <td>{title}</td>
                  <td className="width-fixed">{debit ? debit : ""}</td>
                  <td className="width-fixed">{credit ? credit : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
       */}
      </TableCard>
    </WrapperTrialBalanceList>
  );
};

const WrapperTrialBalanceList = styled.div`
  .card-wrapper {
    min-height: calc(100vh - 200px);
  }

  .static-width {
    width: 200px;
  }
`;
