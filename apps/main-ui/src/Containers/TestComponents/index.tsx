import { invycePersist } from '@invyce/invyce-persist';
import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';
import { CsvImportAPi } from '../../api';
import { InvoiceImportManager } from '../../modules/Invoice/InvoiceImportManager';

export const TestComponents: FC = () => {
  const [mutateCsv, resMutateCsv] = useMutation(CsvImportAPi);

  const handleLoad = async (payload) => {
    await mutateCsv(payload, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  return <InvoiceImportManager onLoad={handleLoad} />;
};
