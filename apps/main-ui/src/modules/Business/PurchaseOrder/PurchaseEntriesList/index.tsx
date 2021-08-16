/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "antd";
import React, { FC, lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FallBackLoader } from "../../../../components/FallBackLoader";
import { Heading } from "../../../../components/Heading";

import { TableTabs, TableTabsContent } from "../../../../components/TableTabs";
import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import { ISupportedRoutes } from "../../../../modal/routing";
import AwaitingPurchaseList from "./List/AwaitingPayment";
import { PurchaseOrderColumns } from "./List/CommonCol";
import DueExpiredPurchases from "./List/DueExpired";
import PaidPurchaseEntries from "./List/Paid";

export const PurchasesList: FC = () => {
  /* Dynamic Imports */
  const AllPurchases = lazy(() => import("./List/All"));
  const DraftPurchases = lazy(() => import("./List/Draft"));

  const [activeTab, setActiveTab] = useState("");
  const { routeHistory } = useGlobalContext();
  const { search } = routeHistory.history.location;
  useEffect(() => {
    if (!activeTab) {
      setActiveTab("all");
    }
  }, [activeTab]);

  useEffect(() => {
    if (search) {
      let filterTab = search.split("?")[1].split("&")[0].split("=")[1];
      if (filterTab !== null && filterTab !== "id") {
        if (activeTab !== filterTab) {
          setActiveTab(filterTab);
        }
      }
    }
  }, [search]);

  const RenderButton = () => {
    return (
      <Link to={`/app${ISupportedRoutes.CREATE_PURCHASE_Entry}`}>
        <Button type="primary" size="middle">
          New Purchase Entry
        </Button>
      </Link>
    );
  };

  return (
    <WrapperList>
      <div className="pb-20">
        <Heading type="table">Purchases</Heading>
      </div>
      <TableTabs
        defaultkey={`${activeTab}`}
        tabBarExtraContent={RenderButton()}
      >
        <>
          <TableTabsContent tab="All" key="all">
            <Suspense fallback={<FallBackLoader />}>
              <AllPurchases
                activeTab={activeTab}
                columns={PurchaseOrderColumns}
              />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <Suspense fallback={<FallBackLoader />}>
              <DraftPurchases columns={PurchaseOrderColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Payables" key="awating_payment">
            <Suspense fallback={<FallBackLoader />}>
              <AwaitingPurchaseList columns={PurchaseOrderColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Paid" key="paid">
            <Suspense fallback={<FallBackLoader />}>
              <PaidPurchaseEntries columns={PurchaseOrderColumns} />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Over Due" key="due_expired">
            <Suspense fallback={<FallBackLoader />}>
              <DueExpiredPurchases columns={PurchaseOrderColumns} />
            </Suspense>
          </TableTabsContent>
        </>
      </TableTabs>
    </WrapperList>
  );
};

const WrapperList = styled.div`
  .ant-tabs-nav {
    margin-bottom: 0 !important;
  }
  .action-add {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
  }
`;
