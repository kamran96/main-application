import React, { FC } from 'react';

import { Heading, TableCard } from '@components';
import { AccountsSettingsForm } from './Form/Form';
import { WrapperAccountSettings } from './styles';

export const AccountSettings: FC = () => {
  return (
    <WrapperAccountSettings>
      <TableCard>
        <Heading type="table">Account</Heading>
        <AccountsSettingsForm />
      </TableCard>
    </WrapperAccountSettings>
  );
};
