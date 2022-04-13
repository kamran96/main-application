import React, { FC } from 'react';
import styled from 'styled-components';

import { Heading } from '../../../components/Heading';
import { PurchaseOrderList } from './PurchaseOrderList';

export const PurchaseOrderContainer: FC = () => {
  return (
    <WrapperPurchaseOrderContainer>
      <Heading type="table">Purchase Orders</Heading>
      <PurchaseOrderList />
    </WrapperPurchaseOrderContainer>
  );
};

export const WrapperPurchaseOrderContainer = styled.div``;
