import React, { FC } from 'react';

import { ContactList } from './ContactList';
import { WrapperContacts } from './styles';

export const ContactsContainer: FC = () => {
  return (
    <WrapperContacts>
      <ContactList />
    </WrapperContacts>
  );
};
