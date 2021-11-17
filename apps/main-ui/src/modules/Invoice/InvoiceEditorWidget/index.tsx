import { Breadcrumb } from 'antd';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BreadCrumbArea } from '../../../components/BreadCrumbArea';
import { Heading } from '../../../components/Heading';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../modal/routing';
import { InvoiceEditor } from './Editor';

export const InvoiceEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location && location.pathname.split('/app/invoice-create/')[1];

  return (
    <WrapperInvoiceWidget>
      <Heading>New Invoice</Heading>
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
