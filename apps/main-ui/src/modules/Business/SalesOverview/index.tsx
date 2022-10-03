import React, { FC } from 'react';
import { WrapperSalesOverview } from './styles';
import { TableCard, Heading, Seprator } from '@components';

export const SalesOverview: FC = () => {
  return (
    <WrapperSalesOverview>
      <TableCard>
        <Heading type="table">Sales Overview</Heading>
        <Seprator />
      </TableCard>
    </WrapperSalesOverview>
  );
};
