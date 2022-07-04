import { Breadcrumb } from 'antd';
import React from 'react';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { TableCard } from '../../../../components/TableCard';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { Link } from 'react-router-dom';
import { IInvoiceType, ISupportedRoutes } from '../../../../modal';
import { PurchasesView } from '../../../../components/PurchasesView';

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
