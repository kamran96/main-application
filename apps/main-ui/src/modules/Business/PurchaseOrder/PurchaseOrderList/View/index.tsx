import { Breadcrumb } from 'antd';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { BreadCrumbArea } from '../../../../../components/BreadCrumbArea';
import { PurchasesView } from '../../../../../components/PurchasesView';
import { TableCard } from '../../../../../components/TableCard';
import { useGlobalContext } from '../../../../../hooks/globalContext/globalContext';
import { IInvoiceType, ISupportedRoutes } from '../../../../../modal';

export const PurchaseView = () => {
  const history = useHistory();

  const { pathname } = history.location;

  // console.log
  const invId = pathname.split(
    `${ISupportedRoutes.DASHBOARD_LAYOUT}${ISupportedRoutes?.PURCHASE_ORDER}/`
  )[1];

  return (
    <>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.PURCHASE_ORDER}`}>
              Purchase Orders
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Purchase Order View</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <PurchasesView type={IInvoiceType.PURCHASE_ORDER} id={invId} />
      </TableCard>
    </>
  );
};
