import { Breadcrumb } from "antd";
import React from "react";
import styled from "styled-components";
import { TableCard } from "../../../components/TableCard";
import { Link } from "react-router-dom";
import { PurchasesView } from "../../../components/PurchasesView";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { BreadCrumbArea } from "../../../components/BreadCrumbArea";
import { ISupportedRoutes } from "../../../modal";

export const InvoiceView = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  let invId = pathname.split("app/invoice/")[1];

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

      <PurchasesView type="SI" id={invId} />
    </WrapperInvoiceView>
  );
};

const WrapperInvoiceView = styled.div``;
