/* eslint-disable react-hooks/exhaustive-deps */
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  deleteAccountsAPI,
  getAccountLedger,
  getAllAccountsAPI,
  getSecondaryAccounts,
} from '../../../api';
import { ButtonTag, ConfirmModal, SmartFilter } from '@components';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import {
  IAccounts,
  ISupportedRoutes,
  IErrorResponse,
  ReactQueryKeys,
} from '@invyce/shared/types';
import moneyFormat from '../../../utils/moneyFormat';
import { useWindowSize } from '../../../utils/useWindowSize';
import { CommonTable } from './../../../components/Table';
import AccountsFilterringSchema from './AccountsFilteringSchema';
import { pdfColsAccounts, _csvColumnsAccount } from './exportableCols';
import { AccountsWrapper, ListWrapper } from './styles';
import { AccountsImport } from '../AccountsImport';

interface IProps {
  columns: ColumnsType;
  data: any;
}

const defaultSortedId = 'id';

export const AccountsList: FC<IProps> = ({ data }) => {
  const queryCache = useQueryClient();
  const [sortedInfo, setSortedInfo] = useState(null);
  const [accountsConfig, setAccountConfig] = useState({
    page: 1,
    query: '',
    sortid: defaultSortedId,
    page_size: 20,
  });
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [filterBar, setFilterBar] = useState<boolean>(false);
  const [scrollConfig, setScrollConfig] = useState({
    y: '100vh',
  });

  const [width] = useWindowSize();

  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

  useEffect(() => {
    if (routeHistory?.history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAccountConfig({ ...accountsConfig, ...obj });
    }
  }, []);

  /* Mutations */
  /* this mutation is used for deleting contacts against bunch of ids */
  const { isLoading: isDeleting, mutate: mutateDeleteAccounts } =
    useMutation(deleteAccountsAPI);

  const { page, query, sortid, page_size } = accountsConfig;

  const [{ result, pagination }, setResponse] = useState<IAccounts>({
    result: [],
    pagination: null,
  });

  const [filterSchema, setFilterSchema] = useState(AccountsFilterringSchema);

  const [selectedRow, setSelectedRow] = useState([]);

  const { setAccountsModalConfig } = useGlobalContext();

  // `accounts?page=${page}&query=${query}sort=${sortid}`,
  const {
    isLoading,
    data: resolvedData,
    isFetching,
  } = useQuery(
    [ReactQueryKeys.ACCOUNTS_KEYS, page, sortid, page_size, query],
    getAllAccountsAPI,
    {
      keepPreviousData: true,
    }
  );

  /*Query hook for  Fetching secondary accounts if already fetched it will pick account from cache */
  const secondaryAccounts = useQuery(
    [`secondary-accounts`],
    getSecondaryAccounts
  );

  useEffect(() => {
    if (secondaryAccounts?.data?.data?.result) {
      const { result } = secondaryAccounts.data.data;
      const schema = { ...filterSchema };
      schema.secondaryAccountId.value = [...result];
      setFilterSchema(schema);
    }
  }, [secondaryAccounts.data]);

  /* this Async function is responsible for delete contacts */
  const onHandleDelete = async () => {
    const payload = {
      ids: [...selectedRow],
    };

    await mutateDeleteAccounts(payload, {
      onSuccess: () => {
        queryCache.invalidateQueries(
          `accounts?page=${page}&query=${query}sort=${sortid}`
        );
        setConfirmModal(false);
      },
      onError: (error: IErrorResponse) => {
        console.log(error);
      },
    });
  };
  useEffect(() => {
    if (resolvedData && resolvedData?.data) {
      const { result, pagination }: IAccounts = resolvedData?.data;
      const newResult = [];
      result.forEach((accItem) => {
        newResult.push({ ...accItem, key: accItem.id });
      });

      setResponse({ ...resolvedData.data, result: newResult });

      if (pagination?.page_no < pagination?.total_pages) {
        queryCache?.prefetchQuery(
          [ReactQueryKeys.ACCOUNTS_KEYS, page + 1, sortid, page_size, query],
          getAllAccountsAPI
        );
      }
    }
  }, [resolvedData]);

  useEffect(() => {
    if (width < 1300) {
      setScrollConfig((prev) => {
        return { ...prev, x: true };
      });
    } else {
      setScrollConfig({ y: '100vh' });
    }
  }, [width]);

  const columns: ColumnsType<any> = useMemo(
    () => [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Account Head',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        sortOrder: sortedInfo?.columnKey === 'name' && sortedInfo?.order,
        render: (data, row, index) => {
          return (
            <Link
              className="account_name"
              to={`/app${ISupportedRoutes.ACCOUNTS}/${row.id}`}
            >
              {data}
            </Link>
          );
        },
      },
      {
        title: 'Type',
        dataIndex: 'secondaryName',
        key: 'secondaryName',
        sorter: true,
        sortOrder:
          sortedInfo?.columnKey === 'secondaryName' && sortedInfo?.order,
      },
      {
        width: 100,
        title: 'Tax Rate',
        dataIndex: 'tax_rate',
        key: 'tax_rate',
        sorter: true,
        sortOrder: sortedInfo?.columnKey === 'tax_rate' && sortedInfo?.order,
        render: (data) => (data ? data : '-'),
      },
      {
        title: 'Total Debits',
        dataIndex: 'total_debits',
        key: 'total_debits',
        sorter: true,
        sortOrder:
          sortedInfo?.columnKey === 'total_debits' && sortedInfo?.order,
        render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
      },
      {
        title: 'Total Credits',
        dataIndex: 'total_credits',
        key: 'total_credits',
        sorter: true,
        sortOrder:
          sortedInfo?.columnKey === 'total_credits' && sortedInfo?.order,
        render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        sorter: true,
        sortOrder: sortedInfo?.columnKey === 'balance' && sortedInfo?.order,
        render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
      },
    ],
    [resolvedData]
  );

  const onSelectedRow = (item) => {
    setSelectedRow(item?.selectedRowKeys);
  };

  const renderCustomTopbar = () => {
    return (
      <div className="custom_topbar">
        <div className="edit">
          <div className="flex alignCenter">
            <Rbac permission={PERMISSIONS.ACCOUNTS_CREATE}>
              <ButtonTag
                className="mr-10"
                disabled={!selectedRow.length || selectedRow.length > 1}
                onClick={() =>
                  setAccountsModalConfig({
                    visibility: true,
                    id: selectedRow[0],
                  })
                }
                title={'Edit'}
                icon={editSolid}
                size="middle"
              />
            </Rbac>
            <Rbac permission={PERMISSIONS.ACCOUNTS_DELETE}>
              <ButtonTag
                disabled={true}
                onClick={() => setConfirmModal(true)}
                title={'Delete'}
                icon={deleteIcon}
                size="middle"
              />
            </Rbac>
          </div>
        </div>
      </div>
    );
  };

  const topbarRightPannel = () => {
    return (
      <div className="flex alignCenter">
        {/* <AccountsImport /> */}
        <SmartFilter
          onFilter={(encode) => {
            setAccountConfig({ ...accountsConfig, query: encode });
            const route = `/app${ISupportedRoutes.ACCOUNTS}?sortid=null&page=1&page_size=20&query=${encode}`;
            history.push(route);
          }}
          onClose={() => setFilterBar(false)}
          visible={filterBar}
          formSchema={filterSchema}
        />
      </div>
    );
  };

  const handleAccountsConfig = (pagination, filters, sorter: any, extra) => {
    if (sorter?.column) {
      if (sorter.order === 'false') {
        history.push(
          `/app${ISupportedRoutes.ACCOUNTS}?sortid="id"&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
        );
        setAccountConfig({
          ...accountsConfig,
          sortid: defaultSortedId,
          page: pagination.current,
          page_size: pagination.pageSize,
        });
      } else {
        setAccountConfig({
          ...accountsConfig,
          page: pagination.current,
          page_size: pagination.pageSize,
          sortid:
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field,
        });
        setSortedInfo({
          order: sorter?.order,
          columnKey: sorter?.columnKey,
        });
        history.push(
          `/app${ISupportedRoutes.ACCOUNTS}?sortid=${
            sorter && sorter.order === 'descend'
              ? `-${sorter.field}`
              : sorter.field
          }&page=${pagination.current}&page_size=${
            pagination.pageSize
          }&filterOrder=${sorter?.order}&query=${query}`
        );
      }
    } else {
      setAccountConfig({
        ...accountsConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid: defaultSortedId,
      });
      setSortedInfo(null);
      history.push(
        `/app${ISupportedRoutes.ACCOUNTS}?sortid=${defaultSortedId}&page=${pagination.current}&page_size=${pagination.pageSize}&filterOrder=${sorter?.order}&query=${query}`
      );
    }
  };

  const ref: any = useRef();

  return (
    <AccountsWrapper ref={ref}>
      <ListWrapper>
        <CommonTable
          onRow={(record) => {
            return {
              onMouseEnter: () => {
                queryCache.prefetchQuery(
                  [ReactQueryKeys.ACCOUNT_VIEW, record?.id, 20, 1, ''],
                  getAccountLedger
                );
              },
            };
          }}
          pdfExportable={{
            columns: pdfColsAccounts,
          }}
          themeScroll
          printTitle={'Chart of Accounts List'}
          exportable
          exportableProps={{
            fields: _csvColumnsAccount,
            fileName: 'accounts-list',
          }}
          hasPrint
          topbarRightPannel={topbarRightPannel()}
          customTopbar={renderCustomTopbar()}
          data={result}
          columns={columns}
          loading={isLoading}
          onChange={handleAccountsConfig}
          totalItems={pagination && pagination.total}
          pagination={{
            pageSize: page_size,
            position: ['bottomRight'],
            current: pagination && pagination.page_no,
            total: pagination && pagination.total,
            showSizeChanger: true,
          }}
          hasfooter={true}
          onSelectRow={onSelectedRow}
          enableRowSelection
        />
      </ListWrapper>
      <ConfirmModal
        loading={isDeleting}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={onHandleDelete}
        type="delete"
        text="Are you sure want to delete selected Account ?"
      />
    </AccountsWrapper>
  );
};
