import { ButtonTag } from '@components';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import React, { FC } from 'react';

export const QuoteImport: FC = () => {
  const { setQuotes } = useGlobalContext();
  return (
    <ButtonTag
      onClick={() => {
        setQuotes(true, 'quotes');
        console.log('sadas yes');
      }}
      className="mr-10"
      size="middle"
      title="Import"
    />
  );
};
