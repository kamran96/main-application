import React, { FC } from "react";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { BreadCrumbArea } from "../../../../components/BreadCrumbArea";
import { Link } from "react-router-dom";
import { ISupportedRoutes } from "../../../../modal/routing";
import { Heading } from "../../../../components/Heading";
import { TableCard } from "../../../../components/TableCard";
import { PurchasesWidget } from "../../../../components/PurchasesWidget";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";

export const PurchaseEntryEditor: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location && location.pathname.split("/app/purchase-entry/")[1];

  return (
    <WrapperPurchaseEntry>
      <Heading>Create Bill</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.PURCHASES}`}>Bills</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create Bill</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <PurchasesWidget type="POE" id={id} />
        {/* <InvoiceForm type="PO" /> */}
      </TableCard>
    </WrapperPurchaseEntry>
  );
};

const WrapperPurchaseEntry = styled.div``;
