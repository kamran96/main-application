import { Breadcrumb } from 'antd';
import React from 'react';
import { BreadCrumbArea, PurchasesView, TableCard } from '@components';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { Link } from 'react-router-dom';
import { IInvoiceType, ISupportedRoutes } from '@invyce/shared/types';

export const QuoteView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  const invId = pathname.split('app/quotes/')[1];

  return (
    <>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.QUOTE}`}>Quotes</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Quote View</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <PurchasesView type={IInvoiceType.INVOICE} id={invId} />
      </TableCard>
    </>
  );
};
