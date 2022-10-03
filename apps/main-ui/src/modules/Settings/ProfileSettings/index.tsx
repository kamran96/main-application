import React from 'react';
import { Heading, Seprator, TableCard } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ProfileForm } from './ProfileForm';
import { WrapperSettings } from './styles';

export const ProfileSettings = () => {
  const { userDetails } = useGlobalContext();
  return (
    <WrapperSettings>
      <TableCard>
        <Heading type="table">Profile</Heading>
        <Seprator />
        <ProfileForm id={userDetails ? userDetails.id : null} />
      </TableCard>
    </WrapperSettings>
  );
};
