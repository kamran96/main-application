import React, { FC, useState } from "react";
import styled from "styled-components";
import { Heading } from "../../../components/Heading";
import { TableCard } from "../../../components/TableCard";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { ISupportedRoutes } from "../../../modal/routing";
import { BreadCrumbArea } from "../../../components/BreadCrumbArea";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { PurchasesWidget } from "../../../components/PurchasesWidget";
import { InvoiceEditor } from "./Editor";
import { CommonTable } from "../../../components/Table";
import { Editable } from "../../../components/Editable";

export const InvoiceEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  const id = location && location.pathname.split("/app/invoice-create/")[1];
  const [state, setState] = useState([
    {
      id: 1,
    },
  ]);

  const cols = [{ title: "id", dataIndex: "id" }];

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
