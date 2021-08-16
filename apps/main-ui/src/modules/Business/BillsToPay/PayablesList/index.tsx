import React, { FC, useEffect, useState } from "react";

import { useGlobalContext } from "../../../../hooks/globalContext/globalContext";
import {
  TableTabs,
  TableTabsContent,
} from "./../../../../components/TableTabs";
import { ALLBillsList } from "./AllBills";
import { AwaitingAprovalBillsList } from "./AwaitingApproval";
import { AwaitingPaymentBillsList } from "./AwaitingPayment";
import { columns } from "./CommonColumns";
import { DraftBillsList } from "./Drafts";
import { PaidBillsList } from "./Paid";
import { PayablesWrapper } from "./styles";

export const PayablesList: FC = () => {
  const { routeHistory } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const { location } = routeHistory;
    if (location && location.search) {
      const { search } = location;
      let filterTab = search.split("?")[1].split("&")[0].split("=")[1];
      setActiveTab(filterTab);
    }
  }, [routeHistory]);
  return (
    <PayablesWrapper>
      <TableTabs defaultkey={activeTab}>
        <>
          <TableTabsContent tab="All" key="all">
            <ALLBillsList columns={columns} />
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <DraftBillsList columns={columns} />
          </TableTabsContent>
          <TableTabsContent tab="Awating Aproval" key="awating_aproval">
            <AwaitingAprovalBillsList columns={columns} />
          </TableTabsContent>
          <TableTabsContent tab="Awating Payment" key="awating_payment">
            <AwaitingPaymentBillsList columns={columns} />
          </TableTabsContent>
          <TableTabsContent tab="Paid" key="paid">
            <PaidBillsList columns={columns} />
          </TableTabsContent>
        </>
      </TableTabs>
    </PayablesWrapper>
  );
};
