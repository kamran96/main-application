import { ButtonTag } from '@components';
import React, { FC } from 'react';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const InvoiceImports: FC = () => {
  const { setInvoices } = useGlobalContext();
  return (
    <ButtonTag
      onClick={() => {
        setInvoices(true, 'invoices');
      }}
      size="middle"
      className="mr-10"
      title="Import"
    />
  );
};
