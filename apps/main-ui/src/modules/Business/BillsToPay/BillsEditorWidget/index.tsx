import React, { FC } from "react";
import { Breadcrumb } from "antd";
import styled from "styled-components";
import { BreadCrumbArea } from "../../../../components/BreadCrumbArea";
import { Heading } from "../../../../components/Heading";
import { TableCard } from "../../../../components/TableCard";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { Link } from "react-router-dom";
import { ISupportedRoutes } from "../../../../modal/routing";
import { PurchasesWidget } from "../../../../components/PurchasesWidget";

export const BillsEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const routeArr =
    routeHistory && routeHistory.location && routeHistory.location.search
      ? routeHistory.location.search.split("po=")
      : [];
  let id = routeArr.length ? routeArr[1] : null;

  return (
    <WrapperBillsEditorWidget>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.BILLS}`}>Bills</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>New Bill</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <Heading type="table">New Bill</Heading>
        <PurchasesWidget id={id} type="BILL" />
      </TableCard>
    </WrapperBillsEditorWidget>
  );
};

const WrapperBillsEditorWidget = styled.div``;
