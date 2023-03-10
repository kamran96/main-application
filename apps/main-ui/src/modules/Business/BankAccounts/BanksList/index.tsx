import React, { FC, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { getBankAccountsList } from '../../../../api';
import { CommonTable, TableCard } from '@components';
import {
  ACCOUNT_TYPES,
  ACCOUNT_TYPES_NAMES,
  IBaseAPIError,
  ISupportedRoutes,
  NOTIFICATIONTYPE,
  ReactQueryKeys,
} from '@invyce/shared/types';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { useHistory } from 'react-router-dom';
import { BanksImport } from '../BanksImport';
import { QueryCache } from 'apps/main-ui/src/hooks/usePaginatedQuery';

const defaultSortedId = 'id';
export const BanksList: FC = () => {
  const [responseBanks, setResponseBanks] = useState([]);
  const [sortedInfo, setSortedInfo] = useState(null);
  const [bankConfig, setBankConfig] = useState({
    sortid: defaultSortedId,
  });
  const queryCache = useQueryClient();

  const { sortid } = bankConfig;
  //    `bank-list  `

  const { notificationCallback } = useGlobalContext();
  const { isLoading, data } = useQuery(
    [ReactQueryKeys.BANK_KEYS, sortid],
    getBankAccountsList,
    {
      onError: (error: IBaseAPIError) => {
        if (error?.response?.data?.message) {
          const { message } = error.response.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        }
      },
    }
  );

  const history = useHistory();

  // useEffect(() => {
  //   if (history && history.location && history.location.search) {
  //     const filterType = history.location.search.split('&');
  //     const filterIdType = filterType[0];
  //     const filterOrder = filterType[1]?.split('=')[1];

  //     if (filterIdType?.includes('-')) {
  //       const fieldName = filterIdType?.split('=')[1].split('-')[1];
  //       setSortedInfo({
  //         order: filterOrder,
  //         columnKey: fieldName,
  //       });
  //     } else {
  //       const fieldName = filterIdType?.split('=')[1];
  //       setSortedInfo({
  //         order: filterOrder,
  //         columnKey: fieldName,
  //       });
  //     }
  //   }
  // }, [history?.location?.search]);

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;
      setResponseBanks(result);

      // if (pagination?.next === page + 1) {
      //   queryCache?.prefetchQuery([ReactQueryKeys.BANK_KEYS, sortid], getBankAccountsList );
      // }
    }
  }, [data]);

  const renderAccountTypeName = (type) => {
    switch (type) {
      case ACCOUNT_TYPES.BASIC_BANKING_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.BASIC_BANKING_ACCOUNT;
      case ACCOUNT_TYPES.CURRENT_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.CURRENT_ACCOUNT;
      case ACCOUNT_TYPES.FIXED_DEPOSIT_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.FIXED_DEPOSIT_ACCOUNT;
      case ACCOUNT_TYPES.FORIGN_CURR_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.FORIGN_CURR_ACCOUNT;
      case ACCOUNT_TYPES.RUNNING_FINANCE_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.RUNNING_FINANCE_ACCOUNT;
      case ACCOUNT_TYPES.SAVING_ACCOUNT:
        return ACCOUNT_TYPES_NAMES.SAVING_ACCOUNT;

      default:
        return '';
    }
  };

  const handleBankConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        history.push(`/app${ISupportedRoutes.BANK_ACCOUNTS}?sortid="id"`);
        setBankConfig({
          sortid: defaultSortedId,
        });
      } else {
        history.push(
          `/app${ISupportedRoutes.BANK_ACCOUNTS}?sortid=${
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field
          }&filter=${sorter.order}`
        );
        setBankConfig({
          ...bankConfig,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field,
        });
      }
    } else {
      history.push(
        `/app${ISupportedRoutes.BANK_ACCOUNTS}?sortid=${defaultSortedId}&filter=${sorter.order}`
      );
      setBankConfig({
        sortid: defaultSortedId,
      });
    }
  };

  const renderCustomTopbar = () => {
    return <div></div>;
  };

  const topbarRightPannel = () => {
    return <div className="flex alignCenter mb-3">{/* <BanksImport/> */}</div>;
  };

  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: '',
      key: '',
      render: (data, row, index) => <>{index + 1}</>,
    },
    {
      title: 'Bank Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'name' && sortedInfo?.order,
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'accountNumber' && sortedInfo?.order,
    },
    {
      title: 'Type',
      dataIndex: 'accountType',
      key: 'accountType',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'accountType' && sortedInfo?.order,
      render: (data, row, index) => {
        return <>{renderAccountTypeName(data)}</>;
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
      sortOrder: sortedInfo?.columnKey === 'updatedAt' && sortedInfo?.order,
      render: (data, row, index) => {
        return <>{dayjs(data).format('MMMM D, YYYY')}</>;
      },
    },
  ];

  return (
    <WrapperBanksList>
      <TableCard>
        <CommonTable
          data={responseBanks}
          columns={columns}
          loading={isLoading}
          pagination={false}
          onChange={handleBankConfig}
          customTopbar={renderCustomTopbar()}
          exportable
          topbarRightPannel={topbarRightPannel()}
          //  onChange={
          //    handleContactsConfig
          //  }
          //  pagination={{
          //    pageSize: page_size,
          //    position: ["bottomRight"],
          //    current: paginationData.page_no,
          //    total: paginationData.total,
          //  }}
          //  hasfooter={true}
          //  onSelectRow={onSelectedRow}
          //  enableRowSelection
        />
      </TableCard>
    </WrapperBanksList>
  );
};

const WrapperBanksList = styled.div``;
