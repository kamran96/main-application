import React, { FC } from 'react';
import { Heading } from '@components';
import { DashboardWrapper } from '../../Layout/DashboardStyles';

export const Dashboard: FC = () => {
  return (
    <DashboardWrapper>
      <Heading type="container">Dashboard</Heading>
    </DashboardWrapper>
  );
};
