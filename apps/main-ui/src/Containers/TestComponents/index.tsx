import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';

import { CsvImportAPi } from '../../api';
import { Inconvinience } from '../../components/ErrorBoundries/Inconvinience';
import { InvoiceImportManager } from '../../modules/Invoice/InvoiceImportManager';

export const TestComponents: FC = () => {
  const { mutate: mutateCsv } = useMutation(CsvImportAPi);

  const handleLoad = async (payload) => {
    console.log(payload, 'payload');
    await mutateCsv(payload, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  return <Inconvinience />;
};
