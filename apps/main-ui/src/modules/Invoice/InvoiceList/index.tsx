import { Button } from "antd";
import React, { FC, lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { FallBackLoader } from "../../../components/FallBackLoader";
import { Rbac } from "../../../components/Rbac";
import { PERMISSIONS } from "../../../components/Rbac/permissions";
import { TableTabs, TableTabsContent } from "../../../components/TableTabs";
import { useGlobalContext } from "../../../hooks/globalContext/globalContext";
import { ISupportedRoutes } from "../../../modal";
import { InvoiceColumns } from "./commonCol";
import OverDueInvoices from "./Overdue";

export const InvoiceList: FC = () => {
  /* Dynamic Imports */
  const ALLInvoiceList = lazy(() => import("./All"));
  const AwaitingtInvoiceList = lazy(() => import("./AwaitingPayment"));
  const DraftInvoiceList = lazy(() => import("./Drafts"));
  const PaidtInvoiceList = lazy(() => import("./Paid"));

  const { routeHistory } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("");
  const { search } = routeHistory.history.location;

  useEffect(() => {
    if (!activeTab) {
      setActiveTab("all");
    }
  }, [activeTab]);

  useEffect(() => {
    if (search) {
      let filterTab = search.split("?")[1].split("&")[0].split("=")[1];
      if (filterTab !== null && filterTab !== "id" && filterTab !== activeTab) {
        setActiveTab(filterTab);
      }
    }
  }, [search, activeTab]);

  const RenderButton = () => {
    return (
      <Rbac permission={PERMISSIONS.INVOICES_CREATE}>
        <Link to={`/app${ISupportedRoutes.CREATE_INVOICE}`}>
          <Button type="primary" size="middle">
            New Invoice
          </Button>
        </Link>
      </Rbac>
    );
  };

  return (
    <WrapperInvoiceList>
      <TableTabs
        defaultkey={`${activeTab}`}
        tabBarExtraContent={RenderButton()}
      >
        <>
          <TableTabsContent tab="All" key="all">
            <Suspense fallback={<FallBackLoader />}>
              <ALLInvoiceList columns={InvoiceColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <Suspense fallback={<FallBackLoader />}>
              <DraftInvoiceList columns={InvoiceColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Awating Payment" key="awating_payment">
            <Suspense fallback={<FallBackLoader />}>
              <AwaitingtInvoiceList columns={InvoiceColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Paid" key="paid">
            <Suspense fallback={<FallBackLoader />}>
              <PaidtInvoiceList columns={InvoiceColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Overdue" key="due_expired">
            <Suspense fallback={<FallBackLoader />}>
              <OverDueInvoices columns={InvoiceColumns} />
            </Suspense>
          </TableTabsContent>
        </>
      </TableTabs>
    </WrapperInvoiceList>
  );
};

const WrapperInvoiceList = styled.div`
  .ant-tabs-nav {
    margin-bottom: 0 !important;
  }
`;
