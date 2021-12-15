/* eslint-disable react-hooks/exhaustive-deps */
import deleteIcon from '@iconify/icons-carbon/delete';
import editSolid from '@iconify/icons-clarity/edit-solid';
import { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { usePaginatedQuery } from '../../../hooks/usePaginatedQuery';
import { Link } from 'react-router-dom';
import {
  deleteAccountsAPI,
  getAllAccountsAPI,
  getSecondaryAccounts,
} from '../../../api/accounts';
import { ButtonTag } from '../../../components/ButtonTags';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { PDFICON } from '../../../components/Icons';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { SmartFilter } from '../../../components/SmartFilter';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IAccounts } from '../../../modal/accounts';
import { ISupportedRoutes } from '../../../modal/routing';
import moneyFormat from '../../../utils/moneyFormat';
import { useWindowSize } from '../../../utils/useWindowSize';
import { CommonTable } from './../../../components/Table';
import AccountsFilterringSchema from './AccountsFilteringSchema';
import { _csvColumnsAccount } from './exportableCols';
import { AccountsWrapper, ListWrapper } from './styles';
import { IErrorResponse } from '@invyce/shared/types';

interface IProps {
  columns: ColumnsType;
  data: any;
}

export const AccountsList: FC<IProps> = ({ data }) => {
  const queryCache = useQueryClient();
  const [accountsConfig, setAccountConfig] = useState({
    page: 1,
    query: '',
    sortid: '',
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
    if (
      routeHistory &&
      routeHistory.history &&
      routeHistory.history.location &&
      routeHistory.history.location.search
    ) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });

      setAccountConfig({ ...accountsConfig, ...obj });
    }
  }, [routeHistory]);

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

  const { isLoading, resolvedData, isFetching } = usePaginatedQuery(
    [
      `accounts?page=${page}&query=${query}sort=${sortid}`,
      page,
      sortid,
      page_size,
      query,
    ],
    getAllAccountsAPI
  );

  /*Query hook for  Fetching secondary accounts if already fetched it will pick account from cache */
  const secondaryAccounts = useQuery(
    [`secondary-accounts`],
    getSecondaryAccounts
  );

  useEffect(() => {
    if (
      secondaryAccounts.data &&
      secondaryAccounts.data.data &&
      secondaryAccounts.data.data.result
    ) {
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
    if (resolvedData && resolvedData.data) {
      const { result }: IAccounts = resolvedData.data;
      const newResult = [];
      result.forEach((accItem) => {
        newResult.push({ ...accItem, key: accItem.id });
      });

      setResponse({ ...resolvedData.data, result: newResult });
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
        dataIndex: 'type',
        key: 'type',
      },
      {
        width: 100,
        title: 'Tax Rate',
        dataIndex: 'tax_rate',
        key: 'tax_rate',
        render: (data) => <>{data ? data : '-'}</>,
      },
      {
        title: 'Total Debits',
        dataIndex: 'total_debits',
        key: 'total_debits',
        render: (data) => <>{data ? moneyFormat(data) : moneyFormat(0)}</>,
      },
      {
        title: 'Total Credits',
        dataIndex: 'total_credits',
        key: 'total_credits',
        render: (data) => <>{data ? moneyFormat(data) : moneyFormat(0)}</>,
      },
      {
        title: 'Amount',
        dataIndex: 'balance',
        key: 'balance',
        render: (data) => <>{data ? moneyFormat(data) : moneyFormat(0)}</>,
      },
    ],
    [resolvedData]
  );

  const onSelectedRow = (item) => {
    setSelectedRow(item.selectedRowKeys);
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
        <ButtonTag
          disabled
          className="mr-10"
          ghost
          title="Download PDF"
          size="middle"
          customizeIcon={<PDFICON className="flex alignCenter mr-10" />}
        />
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
    if (sorter.order === undefined) {
      history.push(
        `/app${ISupportedRoutes.ACCOUNTS}?sortid=null&page=${pagination.current}&page_size=${pagination.pageSize}&query=${query}`
      );
      setAccountConfig({
        ...accountsConfig,
        sortid: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
    } else {
      history.push(
        `/app${ISupportedRoutes.ACCOUNTS}?sortid=${
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field
        }&page=${pagination.current}&page_size=${
          pagination.pageSize
        }query=${query}`
      );
      setAccountConfig({
        ...accountsConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid:
          sorter && sorter.order === 'descend'
            ? `-${sorter.field}`
            : sorter.field,
      });
    }
  };

  const ref: any = useRef();

  return (
    <AccountsWrapper ref={ref}>
      <ListWrapper>
        <CommonTable
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
