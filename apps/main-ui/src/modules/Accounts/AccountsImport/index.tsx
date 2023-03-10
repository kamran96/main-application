import { ButtonTag } from '@components';
import React, { FC } from 'react';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

export const AccountsImport: FC = (props) => {
  const { setAccountsImportConfig } = useGlobalContext();
  return (
    <ButtonTag
      onClick={() => {
        setAccountsImportConfig(true, 'accounts');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};
