/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  deleteTransactionApiById,
  getAllTransactionsAPI,
  updateTransactionDraftStatus,
} from '../../../../api';
import { SmartFilter } from '../../../../components/SmartFilter';
import { CommonTable } from '../../../../components/Table';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import {
  IResponseTransactions,
  TransactionsStatus,
} from '../../../../modal/transaction';
import { IAccountsResult } from '../../../../modal/accounts';
import { ISupportedRoutes } from '../../../../modal/routing';
import moneyFormat from '../../../../utils/moneyFormat';
import { WrapperTransactionCustomBar, WrapperTransactionsList } from './styles';
import { TransactionItemTable } from './TransactionItemsTable';
import transactionsFilterSchema from './transactionsFilterSchema';
import { ConfirmModal } from '../../../../components/ConfirmModal';
import { PurchaseListTopbar } from '../../../../components/PurchasesListTopbar';
import { NOTIFICATIONTYPE, IServerError } from '../../../../modal';
import { Form } from 'antd';

const DRAFTTransactionsList: FC = () => {
  const queryCache = useQueryClient();
  const [filterBar, setFilterbar] = useState<boolean>(false);
  const [userId, setUserId] = useState([]);
  const [{ result, pagination }, setResponse] = useState<IResponseTransactions>(
    {
      result: [],
    }
  );
  const [filterSchema, setFilterSchema] = useState(transactionsFilterSchema);
  const [confirmModal, setConfirmModal] = useState(false);

  const { routeHistory, notificationCallback } = useGlobalContext();
  const { history } = routeHistory;

  const [transactionConfig, setTransactionsConfig] = useState({
    page: 1,
    query: '',
    sortid: 'id',
    page_size: 20,
    status: TransactionsStatus.DRAFT,
  });

  const { mutate: mutateDeleteTrasaction, isLoading: isDeletingTransactions } =
    useMutation(deleteTransactionApiById);
  const { mutate: updateTransactionStatus, isLoading: isTransactionStatus } =
    useMutation(updateTransactionDraftStatus);

  const { page, query, page_size, status } = transactionConfig;

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
  }, [history]);

  const { isLoading, data: resolvedData } = useQuery(
    [
      `transactions?page=${page}&query=${query}&page_size=${page_size}&status=${status}`,
      page,
      page_size,
      query,
      status,
    ],
    getAllTransactionsAPI,
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (resolvedData && resolvedData.data && resolvedData.data.result) {
      const { result } = resolvedData.data;
      const newResult = [];

      result.forEach((res) => {
        newResult.push({ ...res, key: res.id });
      });

      setResponse({ ...resolvedData.data, result: newResult });
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

  const handleDelete = async () => {
    const payload = {
      ids: [userId],
    };
    // console.log(payload, "payload");
    await mutateDeleteTrasaction(payload, {
      onSuccess: () => {
        ['transactions, transactions?page'].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) =>
            q.queryKey[0].toString().startsWith(key)
          );
        });

        setConfirmModal(false);
      },
      onError: (error: IServerError) => {
        if (
          error &&
          error?.response &&
          error?.response?.data &&
          error?.response?.data?.message
        ) {
          const { message } = error?.response?.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        }
      },
    });
    setConfirmModal(false);
  };

  const ApprovedDraftStatus = async (userId: number) => {
     await updateTransactionStatus(userId, {
      onSuccess: () => {
        [
          'transactions, transactions?page',
          'accounts',
          `report-trialbalance`,
          `report-balance-sheet`,
        ].forEach((key) => {
          (queryCache.invalidateQueries as any)((q) =>
            q.queryKey[0].toString().startsWith(key)
          );
        });
      },
      onError: (error: IServerError) => {
        if (
          error &&
          error?.response &&
          error?.response?.data &&
          error?.response?.data?.message
        ) {
          const { message } = error?.response?.data;
          notificationCallback(NOTIFICATIONTYPE.ERROR, message);
        }
      },
    });
  };

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
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (data) => {
        return <>{dayjs(data).format(`MMMM D, YYYY h:mm A`)}</>;
      },
    },

    {
      title: 'Narration',
      dataIndex: 'narration',
      key: 'narration',
      render: (data, row, index) => <>{data ? data : '-'}</>,
    },
    {
      title: 'Note',
      dataIndex: 'notes',
      key: 'notes',
      render: (data, row, index) => <>{data ? data : '-'}</>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (data, row, index) => <>{data ? moneyFormat(data) : '-'}</>,
    },
  ];

  const renderCustomTopbar = () => {
    return (
      <WrapperTransactionCustomBar>
        <SmartFilter
          onFilter={(encode) => {
            setTransactionsConfig({
              ...transactionConfig,
              query: encode,
              page_size: 20,
              page: 1,
            });
            const route = `/app${ISupportedRoutes.TRANSACTIONS}?tabIndex=draft&sortid=null&page=1&page_size=20&query=${encode}`;
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
    if (sorter.order === undefined) {
      setTransactionsConfig({
        ...transactionConfig,
        sortid: null,
        page: pagination.current,
        page_size: pagination.pageSize,
      });
      const route = `/app${ISupportedRoutes.TRANSACTIONS}?tabIndex=draft&sortid=null&page=${pagination.current}&page_size=${pagination.pageSize}`;
      history.push(route);
    } else {
      setTransactionsConfig({
        ...transactionConfig,
        page: pagination.current,
        page_size: pagination.pageSize,
        sortid:
          sorter?.order === 'descend' ? `-${sorter?.field}` : sorter?.field,
      });
      const route = `/app${
        ISupportedRoutes.TRANSACTIONS
      }?tabIndex=draft&sortid=${
        sorter?.order === 'descend' ? -sorter?.field : sorter?.field
      }&page=${pagination.current}&page_size=${pagination.pageSize}`;
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
        expandable={{
          expandedRowRender: (record, index) => {
            return (
              <>
                <PurchaseListTopbar
                  // hideDeleteButton={!rbac.can(PERMISSIONS.INVOICES_DELETE)}
                  disabled={false}
                  isEditable={true}
                  hasApproveButton={true}
                  loading={isTransactionStatus}
                  onEdit={() => {
                    history.push(
                      `/app${ISupportedRoutes.CREATE_TRANSACTION}/${record.id}`
                    );
                  }}
                  onDelete={() => {
                    setUserId(record?.id);
                    setConfirmModal(true);
                  }}
                  onApprove={() =>{
                    ApprovedDraftStatus(record?.id)
                  }}
                />
                <TransactionItemTable
                  allAccounts={accountsResponse}
                  data={record.transactionItems}
                />
              </>
            );
          },
        }}
        customTopbar={renderCustomTopbar()}
        data={result}
        columns={columns}
        loading={isLoading}
        onChange={onChangePagination}
        totalItems={pagination?.total}
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

      <ConfirmModal
        loading={false}
        visible={confirmModal}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleDelete}
        type="delete"
        text="Are you sure want to delete selected Category?"
      />
    </WrapperTransactionsList>
  );
};
export default DRAFTTransactionsList;
