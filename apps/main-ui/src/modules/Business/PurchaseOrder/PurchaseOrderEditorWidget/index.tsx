import React, { FC } from 'react';
import { Breadcrumb } from 'antd';
import styled from 'styled-components';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { Heading } from '../../../../components/Heading';
import { PurchaseOrderForm } from './Form';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '../../../../modal/routing';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const PurchaseOrderEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location && location.pathname.split('/app/create-order/')[1];

  return (
    <WrapperWidget>
      <Heading>Create Purchase Order</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.PURCHASE_ORDER}`}>
              Purchase Order
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Purchase Order</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <PurchaseOrderForm id={id} />
    </WrapperWidget>
  );
};

const WrapperWidget = styled.div``;
