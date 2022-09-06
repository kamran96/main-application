import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { FC } from 'react';
import { ButtonTag } from '@components';

export const PaymentImport: FC = () => {
  const { setPaymentsImportConfig } = useGlobalContext();

  return (
    <ButtonTag
      onClick={() => {
        setPaymentsImportConfig(true, 'payments');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};
