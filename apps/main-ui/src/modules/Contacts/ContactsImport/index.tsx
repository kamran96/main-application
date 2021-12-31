import { ButtonTag } from '../../../components/ButtonTags';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import React from 'react';

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
