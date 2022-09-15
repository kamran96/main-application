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
      <Heading type="form">Create Purchase Order</Heading>
      <div className='flex alignFEnd justifySpaceBetween'>
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
        <div className="flex alignFEnd justifySpaceBetween pv-13">
          <h4 className="bold m-reset">
            Already Purchased? &nbsp;
            <Link to={`/app${ISupportedRoutes.CREATE_PURCHASE_Entry}`}>
              Enter Purchases Here
            </Link>
          </h4>
        </div>
      </div>
      <PurchaseOrderForm id={id} />
    </WrapperWidget>
  );
};

const WrapperWidget = styled.div``;
