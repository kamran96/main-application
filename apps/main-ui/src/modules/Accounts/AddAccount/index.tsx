import React, { FC } from 'react';
import { CommonModal } from '../../../components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { AccountsForm } from './Form';

export const AddAccount: FC = () => {
  const { accountsModalConfig, setAccountsModalConfig } = useGlobalContext();

  return (
    <CommonModal
      width={580}
      title="Add New Account"
      footer={false}
      visible={accountsModalConfig.visibility}
      onCancel={() => setAccountsModalConfig({ visibility: false, id: null })}
    >
      <AccountsForm />
    </CommonModal>
  );
};

export default AddAccount;
