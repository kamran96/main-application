import React from 'react';
import { ButtonTag } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';

const ContactsImport = () => {
  const { setContactsImportConfig } = useGlobalContext();

  return (
    <ButtonTag
      onClick={() => {
        setContactsImportConfig(true, 'contacts');
      }}
      className="mr-10"
      title="Import"
      size="middle"
    />
  );
};

export default ContactsImport;
