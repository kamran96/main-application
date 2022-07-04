import { Button } from 'antd';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Heading } from '../../../components/Heading';
import { ISupportedRoutes } from '../../../modal/routing';
import { TransactionsList } from './TransactionsList';

export const TransactionContainer: FC = () => {
  return (
    <WrapperTransactions>
      <div className="flex alignCenter justifySpaceBetween pv-10">
        <Heading type="table">Journal Entries</Heading>

        <Link to={`/app${ISupportedRoutes.CREATE_TRANSACTION}`}>
          <Button type="primary" size="middle">
            Journal Entry
          </Button>
        </Link>
      </div>
      <TransactionsList />
    </WrapperTransactions>
  );
};

const WrapperTransactions = styled.div``;
