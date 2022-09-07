import React, { FC } from 'react';
import styled from 'styled-components';
import { Heading, TableCard } from '@components';

export const Branch: FC = () => {
  return (
    <WrapperBranch>
      <TableCard>
        <Heading>Branches</Heading>
      </TableCard>
    </WrapperBranch>
  );
};

const WrapperBranch = styled.div``;
