import { Breadcrumb } from 'antd';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BreadCrumbArea, Heading } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '@invyce/shared/types';
import { InvoiceEditor } from './Editor';

export const InvoiceEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location && location.pathname.split('/app/invoice-create/')[1];

  return (
    <WrapperInvoiceWidget>
      <Heading type="form">New Invoice</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.INVOICES}`}>Invoices</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Invoice</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>

      <InvoiceEditor type="SI" id={id} />
    </WrapperInvoiceWidget>
  );
};

const WrapperInvoiceWidget = styled.div``;
