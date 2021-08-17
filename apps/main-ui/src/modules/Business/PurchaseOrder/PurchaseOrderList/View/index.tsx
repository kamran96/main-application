import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import { BreadCrumbArea } from "../../../../../components/BreadCrumbArea";
import { PurchasesView } from "../../../../../components/PurchasesView";
import { TableCard } from "../../../../../components/TableCard";
import { useGlobalContext } from "../../../../../hooks/globalContext/globalContext";
import { ISupportedRoutes } from "../../../../../modal";

export const PurchaseView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  let invId = pathname.split("app/purchase-orders/")[1];

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
        <PurchasesView type="PO" id={invId} />
      </TableCard>
    </>
  );
};
