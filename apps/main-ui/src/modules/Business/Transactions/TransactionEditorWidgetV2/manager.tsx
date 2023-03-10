import { useWindowSize } from '../../../../utils/useWindowSize';
import { Form } from 'antd';
import {
  useContext,
  createContext,
  FC,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { EditableColumnsType } from '@invyce/editable-table';
import defaultState from './default';
import Icon from '@iconify/react';
import dayjs from 'dayjs';
import { convertToRem } from '@invyce/pixels-to-rem';
import deleteIcon from '@iconify/icons-carbon/delete';
import dotsGrid from '@iconify-icons/mdi/dots-grid';
import { getAllAccounts } from '../../../../api/accounts';
import { getSingleTransactionById } from '../../../../api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { Editable, EditableSelect } from '@components';
import {
  ITranactionContext,
  ITransactionEditorProps,
  ITransactionsList,
} from './types';
import {
  NOTIFICATIONTYPE,
  IServerError,
  IAccountsResult,
  ReactQueryKeys,
} from '@invyce/shared/types';

const transactionContext = createContext<Partial<ITranactionContext>>({});
export const useTransaction = () => useContext(transactionContext);

let timeout: any;

export const TransactionManager: FC<ITransactionEditorProps> = ({
  children,
  id,
}) => {
  const [form] = Form.useForm();
  const { notificationCallback, Colors } = useGlobalContext();
  const [width] = useWindowSize();
  const [transactionsList, setTransactionsList] = useState<ITransactionsList[]>(
    [{ ...defaultState }]
  );
  //state and fetch single data by Id;
  const { data: TransactionData, isLoading: isTransactionLoading } = useQuery(
    [ReactQueryKeys.TRANSACTION_KEYS, id],
    getSingleTransactionById,
    {
      enabled: !!id,
      onSuccess: (data) => {
        notificationCallback(NOTIFICATIONTYPE.SUCCESS, 'Transaction Fetched');
      },
      onError: (error: IServerError) => {
        if (
          error &&
          error?.response &&
          error?.response?.data &&
          error?.response?.data?.message
        ) {
          // const { message } = error?.response?.data;
          notificationCallback(
            NOTIFICATIONTYPE.ERROR,
            'Unabale to fetch Data!'
          );
        }
      },
    }
  );

  const { isLoading: accountsLoading, data: accountsData } = useQuery(
    [`all-accounts`, 'ALL'],
    getAllAccounts
  );

  const accounts: IAccountsResult[] =
    (accountsData && accountsData.data && accountsData.data.result) || [];

  const handleAddRow = () => {
    const trc = [...transactionsList];
    trc.push({ ...defaultState });
    setTransactionsList(trc);
  };

  const handleDelete = (index) => {
    setTransactionsList((prev) => {
      const alldata = [...prev];
      alldata.splice(index, 1);
      return alldata;
    });
  };

  const resetTransactions = () => {
    setTransactionsList([{ ...defaultState }]);
  };

  // create a function that will return filtered accounts that are not used in transactionsList state
  const getAvailableAccounts = () => {
    const usedAccounts = transactionsList.map((tr) => tr.account);
    return accounts.filter((account) => !usedAccounts.includes(account.id));
  };

  const handleChange = (index: number, key: string, value: any) => {
    setTransactionsList((prev) => {
      const list = [...prev];
      if (key === 'debit' || key === 'credit') {
        delete list[index][`debitError`];
        delete list[index][`creditError`];
      }
      list.splice(index, 1, { ...list[index], [key]: value });
      return list;
    });
  };

  const getAccountId = (id: string | number) => {
    if (accounts && accounts.length) {
      const [filtered] = accounts.filter((item) => item.id === id);

      return filtered?.name;
    } else {
      return id;
    }
  };

  useEffect(() => {
    if (TransactionData?.data?.result) {
      const { result } = TransactionData?.data;
      const { ref, date, narration, notes, status } = result;
      form.setFieldsValue({
        ref,
        date: dayjs(date),
        narration,
        notes,
      });

      const data = [];
      //rename the item name
      result.transactionItems.forEach((item, index) => {
        data.push({
          account: item?.accountId,
          description: item.description,
          debit: item.transactionType === 10 ? item.amount : 0,
          credit: item.transactionType === 20 ? item.amount : 0,
          error: false,
        });
      });
      setTransactionsList(data);
    }
  }, [TransactionData, form]);

  const columns: EditableColumnsType[] = useMemo(() => {
    return [
      {
        title: '',
        key: '',
        dataIndex: 'sort',
        width: 10,
        className: 'drag-visible textCenter',
        render: () => (
          <Icon
            style={{ cursor: 'move', color: '#999', fontSize: 17 }}
            icon={dotsGrid}
            color={'#B1B1B1'}
          />
        ),
      },
      {
        title: '#',
        width: 48,
        key: '',
        dataIndex: '',
        className: 'drag-visible textCenter',
        render: (value, record: ITransactionsList, index) => index + 1,
      },
      {
        title: 'Particular',
        dataIndex: 'account',
        key: 'account',
        width: width > 1500 ? 220 : 170,
        render: (value: number | string, row: any, index: number) => {
          return (
            <>
              <EditableSelect
                error={!!row?.accountError}
                style={{ width: '100%', minWidth: '180px', maxWidth: '180px' }}
                labelInValue={true}
                value={{
                  value: 'value',
                  label: `${getAccountId(value) || 'Select Account'}`,
                }}
                onChange={(selectedItem) => {
                  setTransactionsList((prev) => {
                    const row = [...prev];
                    delete row[index][`accountError`];
                    row.splice(index, 1, {
                      ...row[index],
                      account: selectedItem.value,
                      description: '/',
                      credit: row[index].credit || 0,
                      debit: row[index].debit || 0,
                    });

                    return row;
                  });
                }}
                size="middle"
                showSearch
                optionFilterProp="children"
                options={getAvailableAccounts()?.map((item, index) => {
                  return {
                    key: item.id,
                    value: item.id,
                    customizedRender: item.name,
                  };
                })}
              />
              {/* //added new here */}
            </>
          );
        },
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: width > 1500 ? 500 : 300,
        render: (value, row, index) => {
          return (
            <Editable
              value={value}
              size="middle"
              placeholder="description"
              onChange={(e) => {
                const val = e?.target?.value;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  handleChange(index, 'description', val);
                }, 500);
              }}
            />
          );
        },
      },
      {
        title: 'Debit',
        dataIndex: 'debit',
        key: 'debit',
        width: width > 1500 ? 220 : 170,
        render: (
          value: number,
          record: ITransactionsList | any,
          index: number
        ) => {
          return (
            <Editable
              error={!!record?.debitError}
              disabled={record?.credit > 0}
              onChange={(value) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  handleChange(index, 'debit', value);
                }, 500);
              }}
              value={value}
              type="number"
              size="middle"
              defaultValue="1"
              style={{
                width: '100%',
                // minWidth: '180px',
                // maxWidth: `${width > 1500 ? `520px` : `230px`}`,
              }}
            />
          );
        },
      },
      {
        title: 'Credit',
        dataIndex: 'credit',
        key: 'credit',
        width: width > 1500 ? 220 : 90,
        render: (
          value: number,
          record: ITransactionsList | any,
          index: number
        ) => {
          return (
            <Editable
              error={!!record?.creditError}
              value={value}
              disabled={record.debit > 0}
              type="number"
              size="middle"
              onChange={(value) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                  handleChange(index, 'credit', value);
                }, 500);
              }}
              style={{
                width: '100%',
                minWidth: '180px',
                maxWidth: `${width > 1500 ? `520px` : `90px`}`,
              }}
              defaultValue={record?.credit > 0 ? '' : 0}
            />
          );
        },
      },

      {
        title: 'Action',
        dataIndex: '',
        key: '',
        width: 40,
        render: (data, row, index) => {
          return (
            <i
              onClick={() => {
                handleDelete(index);
              }}
            >
              {' '}
              <Icon
                style={{
                  fontSize: convertToRem(20),
                  color: Colors.$GRAY,
                  cursor: 'pointer',
                }}
                icon={deleteIcon}
              />
            </i>
          );
        },
      },
    ];
  }, [getAvailableAccounts, transactionsList]);

  return (
    <transactionContext.Provider
      value={{
        columns,
        transactionsList,
        setTransactionsList,
        addRow: handleAddRow,
        resetTransactions,
        loading: accountsLoading,
        id,
        form,
      }}
    >
      <div>{children}</div>
    </transactionContext.Provider>
  );
};
