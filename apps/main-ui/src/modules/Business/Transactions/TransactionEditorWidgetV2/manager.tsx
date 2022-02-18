import { useWindowSize } from '../../../../utils/useWindowSize';
import {
  useContext,
  createContext,
  FC,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { Editable, EditableSelect } from '../../../../components/Editable';
import {
  ITranactionContext,
  ITransactionEditorProps,
  ITransactionsList,
} from './types';
import { EditableColumnsType } from '@invyce/editable-table';
import defaultState from './default';
import Icon from '@iconify/react';
import { convertToRem } from '@invyce/pixels-to-rem';
import { Color } from '../../../../modal/theme';
import deleteIcon from '@iconify/icons-carbon/delete';
import dotsGrid from '@iconify-icons/mdi/dots-grid';
import { useQuery } from 'react-query';
import { getAllAccounts } from '../../../../api/accounts';
import { IAccountsResult } from '@invyce/shared/types';

const transactionContext = createContext<Partial<ITranactionContext>>({});
export const useTransaction = () => useContext(transactionContext);

let timeout: any;

export const TransactionManager: FC<ITransactionEditorProps> = ({
  children,
}) => {
  const [width] = useWindowSize();
  const [transactionsList, setTransactionsList] = useState<ITransactionsList[]>(
    [{ ...defaultState }]
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

  // create a function that will return filtered accounts that are not used in transactionsList state
  const getAvailableAccounts = () => {
    const usedAccounts = transactionsList.map((tr) => tr.account);
    return accounts.filter((account) => !usedAccounts.includes(account.id));
  };

  const columns: EditableColumnsType[] = [
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
      render: (
        value: number | string,
        row: ITransactionsList,
        index: number
      ) => {
        return (
          <EditableSelect
            style={{ width: '100%', minWidth: '180px', maxWidth: '180px' }}
            value={value}
            onChange={(selectedItem) => {
              setTransactionsList((prev) => {
                prev[index] = {
                  ...prev[index],
                  account: selectedItem.value,
                  description: '/',
                  credit: 0,
                  debit: 0,
                };
                return prev;
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
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      //   width: width > 1500 ? 220 : 500,
      render: (value, row, index) => {
        return (
          <Editable
            value={value}
            size="middle"
            onChange={(e) => {
              setTransactionsList((prev) => {
                prev[index].description = e.target.value;
                return prev;
              });
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
      render: (value: number, record: ITransactionsList, index: number) => {
        return (
          <Editable
            disabled={record?.credit > 0}
            onChange={(value) => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                setTransactionsList((prev) => {
                  const recordData = prev;
                  recordData[index].debit = value;
                  return recordData;
                });
              }, 500);
            }}
            value={value}
            type="number"
            size="middle"
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
      render: (value: number, record: ITransactionsList, index: number) => {
        console.log(record, 'record');
        return (
          <Editable
            value={value}
            disabled={record.debit > 0}
            type="number"
            size="middle"
            onChange={(value) => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                setTransactionsList((prev) => {
                  const recordData = prev;
                  recordData[index].credit = value;
                  return recordData;
                });
              }, 500);
            }}
            style={{
              width: '100%',
              minWidth: '180px',
              maxWidth: `${width > 1500 ? `520px` : `90px`}`,
            }}
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
                color: Color.$GRAY,
                cursor: 'pointer',
              }}
              icon={deleteIcon}
            />
          </i>
        );
      },
    },
  ];

  return (
    <transactionContext.Provider
      value={{
        columns,
        transactionsList,
        setTransactionsList,
        addRow: handleAddRow,
        loading: accountsLoading,
      }}
    >
      <div>{children}</div>
    </transactionContext.Provider>
  );
};
