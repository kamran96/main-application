import { ButtonTag } from '../../../../../components/ButtonTags';
import React, { FC } from 'react';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';

export const TransactionImport: FC = (props) => {
    const {setTransactionsImportConfig} = useGlobalContext();
  return (
    <ButtonTag
      onClick={(e: any) => {
        e?.preventDefault();
        setTransactionsImportConfig(true, 'transactions');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};
