import React, { FC } from 'react';
import { WrapperUser } from './styles';
import { Heading } from '@components';
import { UsersList } from './UsersList/index';
import { Button } from 'antd';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { Rbac } from '../../components/Rbac';
import { PERMISSIONS } from '../../components/Rbac/permissions';

export const UsersContainer: FC = () => {
  const { setUserInviteModal } = useGlobalContext();
  return (
    <WrapperUser>
      <div className="flex justifySpaceBetween flexWarp pv-10">
        <Heading type="table">Users</Heading>
        <Rbac permission={PERMISSIONS.USERS_CREATE}>
          <Button
            onClick={() => setUserInviteModal(true)}
            className="ml-10"
            type="primary"
          >
            Add User
          </Button>
        </Rbac>
      </div>
      <UsersList />
    </WrapperUser>
  );
};
