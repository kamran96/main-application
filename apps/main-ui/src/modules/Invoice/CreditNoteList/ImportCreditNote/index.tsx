import { ButtonTag } from '@components';
import React, { FC } from 'react';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const ImportCreditNote: FC = (props) => {
  const { setCreditNote } = useGlobalContext();
  return (
    <ButtonTag
      onClick={() => {
        setCreditNote(true, 'creditNotes');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};
