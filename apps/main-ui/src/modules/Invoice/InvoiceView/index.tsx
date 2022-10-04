import { Breadcrumb } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { TableCard, PurchasesView, BreadCrumbArea } from '@components';
import { Icon } from '@iconify/react';
import NextPage from '@iconify/icons-carbon/next-outline';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { IInvoiceType, ISupportedRoutes } from '@invyce/shared/types';

export const InvoiceView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  const invId = pathname.split('app/invoice/')[1];

  const nextId = parseInt(invId) + 1;

  return (
    <WrapperInvoiceView>
      <BreadCrumbArea className="flex justifySpaceBetween mr-28">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.INVOICES}`}>Invoices</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Invoice View</Breadcrumb.Item>
        </Breadcrumb>
        {/* <Link
          to={`/app/invoice/${nextId}`}
          className="flex alignCenter justifySpaceBetween pointer"
        >
          <span className="mh-10">next</span>
          <Icon className="Icon" icon={NextPage} width="20" color="#1890ff" />
        </Link> */}
      </BreadCrumbArea>
      <PurchasesView type={IInvoiceType.INVOICE} id={invId} />
    </WrapperInvoiceView>
  );
};

const WrapperInvoiceView = styled.div``;
