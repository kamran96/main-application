import { Button } from 'antd';
import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { FallBackLoader, TableTabs, TableTabsContent } from '@components';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '@invyce/shared/types';
import { useCols } from './commonCol';
import OverDueInvoices from './Overdue';

export const InvoiceList: FC = () => {
  /* Dynamic Imports */
  const ALLInvoiceList = lazy(() => import('./All'));
  const AwaitingtInvoiceList = lazy(() => import('./AwaitingPayment'));
  const DraftInvoiceList = lazy(() => import('./Drafts'));
  const PaidtInvoiceList = lazy(() => import('./Paid'));

  const { routeHistory } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('');
  const { search } = routeHistory.history.location;
  const { InvoiceColumns } = useCols();
  useEffect(() => {
    if (!activeTab) {
      setActiveTab('all');
    }
  }, [activeTab]);

  useEffect(() => {
    if (search) {
      const filterTab = search.split('?')[1].split('&')[0].split('=')[1];
      if (filterTab !== null && filterTab !== 'id' && filterTab !== activeTab) {
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
            <ALLInvoiceList columns={InvoiceColumns} />
            {/* <Suspense fallback={<FallBackLoader />}>
            </Suspense> */}
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <DraftInvoiceList columns={InvoiceColumns} />
            {/* <Suspense fallback={<FallBackLoader />}>
            </Suspense> */}
          </TableTabsContent>
          <TableTabsContent tab="Awating Payment" key="awating_payment">
            <AwaitingtInvoiceList columns={InvoiceColumns} />
            {/* <Suspense fallback={<FallBackLoader />}>
            </Suspense> */}
          </TableTabsContent>
          <TableTabsContent tab="Paid" key="paid">
            <PaidtInvoiceList columns={InvoiceColumns} />
            {/* <Suspense fallback={<FallBackLoader />}>
            </Suspense> */}
          </TableTabsContent>
          <TableTabsContent tab="Overdue" key="due_expired">
            <OverDueInvoices columns={InvoiceColumns} />
            {/* <Suspense fallback={<FallBackLoader />}>
            </Suspense> */}
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
