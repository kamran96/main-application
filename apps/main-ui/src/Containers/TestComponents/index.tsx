import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';

import { CsvImportAPi } from '../../api';
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

  return (
    <InvoiceImportManager
      headers={[
        '*Code',
        '*Name',
        '*Type',
        '*Tax',
        'Code',
        'Description',
        'Dashboard',
        'Expense',
        'Claims',
        'Enable',
        'Payments',
        'Balance',
      ]}
      onLoad={handleLoad}
    />
  );
};
