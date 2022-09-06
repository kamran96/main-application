import { Breadcrumb } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { TableCard, PurchasesView, BreadCrumbArea } from '@components';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IInvoiceType, ISupportedRoutes } from '@invyce/shared/types';

export const InvoiceView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  const invId = pathname.split('app/invoice/')[1];

  return (
    <WrapperInvoiceView>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.INVOICES}`}>Invoices</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Invoice View</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>

      <PurchasesView type={IInvoiceType.INVOICE} id={invId} />
    </WrapperInvoiceView>
  );
};

const WrapperInvoiceView = styled.div``;
