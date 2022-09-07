import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import { Heading } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { BanksList } from './BanksList';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
export const BankAccounts = () => {
  const { setBanksModalConfig } = useGlobalContext();
  return (
    <WrapperBankAccounts>
      <div className="flex alignCenter justifySpaceBetween pv-20">
        <Heading type="table">Bank Accounts</Heading>
        <Rbac permission={PERMISSIONS.BANKS_CREATE}>
          <Button
            onClick={() => setBanksModalConfig(true)}
            type="primary"
            size="middle"
          >
            Add Bank
          </Button>
        </Rbac>
      </div>
      <BanksList />
    </WrapperBankAccounts>
  );
};

const WrapperBankAccounts = styled.div``;
