import React, { FC, useEffect, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import styled from 'styled-components';
import { BoldText } from '../../../../components/Para/BoldText';
import { CommonTable } from '../../../../components/Table';
import { ITransactionItem, TransactionsType } from '../../../../modal';
import { IAccountsResult } from '../../../../modal/accounts';
import moneyFormat from '../../../../utils/moneyFormat';

interface IProps {
  data: ITransactionItem[];
  allAccounts: IAccountsResult[];
}

export const TransactionItemTable: FC<IProps> = ({ data, allAccounts }) => {
  const [_data, setData] = useState(data);

  useEffect(() => {
    if (data && data.length) {
      const creditItems: any[] = data.filter(
        (trItem) => trItem.transactionType === TransactionsType.CREDIT
      );
      const debitItems: any[] = data.filter(
        (trItem) => trItem.transactionType === TransactionsType.DEBIT
      );

      const sumCredits = (creditItems.length > 0 &&
        creditItems.reduce((a, b) => {
          return { amount: a.amount + b.amount };
        })) || { amount: 0 };

      const sumDebits = (debitItems.length > 0 &&
        debitItems.reduce((a, b) => {
          return { amount: a.amount + b.amount };
        })) || { amount: 0 };

      const allData: any = [...data];
      allData.push({
        isLastIndex: true,
        totalCredits: sumCredits.amount,
        totalDebits: sumDebits.amount,
      });

      setData(allData);
    }
  }, [data]);

  const columns: ColumnsType<any> = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
      render: (itemData, row, index) => (
        <div>
          {row.isLastIndex ? (
            <BoldText>Total</BoldText>
          ) : (
            <>
              {itemData?.name} &nbsp;&nbsp; {row?.bank?.name}
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (data, row, index) => <>{data ? data : '-'}</>,
    },
    {
      title: 'Debit',
      dataIndex: 'amount',
      key: 'amount',
      render: (data, row, index) => {
        return (
          <div>
            {row.isLastIndex ? (
              <BoldText>{moneyFormat(row.totalDebits)}</BoldText>
            ) : row.transactionType === TransactionsType.DEBIT ? (
              <> {moneyFormat(data)}</>
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
    {
      title: 'Credit',
      dataIndex: 'amount',
      key: 'amount',
      render: (data, row, index) => {
        return (
          <div>
            {row.isLastIndex ? (
              <BoldText>{moneyFormat(row.totalCredits)}</BoldText>
            ) : row.transactionType === TransactionsType.CREDIT ? (
              <> {moneyFormat(data)}</>
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
  ];

  return (
    <WrapperTransactionItem>
      <CommonTable pagination={false} columns={columns} data={_data} />
    </WrapperTransactionItem>
  );
};

const WrapperTransactionItem = styled.div``;
