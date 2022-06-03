/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FallBackLoader } from '../../../../components/FallBackLoader';

import { TableTabs, TableTabsContent } from '../../../../components/TableTabs';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../../modal/routing';
import { useCols } from './List/CommonCol';

export const PurchaseOrderList: FC = () => {
  /* Dynamic Imports */
  const ALLPurchaseOrdersList = lazy(() => import('./List/All'));
  const DraftPurchaseOrdersList = lazy(() => import('./List/Draft'));

  const [activeTab, setActiveTab] = useState('');
  const { routeHistory } = useGlobalContext();
  const { search } = routeHistory.history.location;
  const {PurchaseOrderColumns} = useCols();

  useEffect(() => {
    if (!activeTab) {
      setActiveTab('all');
    }
  }, [activeTab]);
  useEffect(() => {
    if (search) {
      let filterTab = search.split('?')[1].split('&')[0].split('=')[1];
      if (filterTab !== null && filterTab !== 'id') {
        if (activeTab !== filterTab) {
          setActiveTab(filterTab);
        }
      }
    }
  }, [search]);

  const RenderButton = () => {
    return (
      <Link to={`/app${ISupportedRoutes.CREATE_PURCHASE_ORDER}`}>
        <Button type="primary" size="middle">
          New Purchase Order
        </Button>
      </Link>
    );
  };

  return (
    <WrapperList className="pv-20">
      <TableTabs
        defaultkey={`${activeTab}`}
        tabBarExtraContent={RenderButton()}
      >
        <>
          <TableTabsContent tab="Aproved" key="all">
            <Suspense fallback={<FallBackLoader />}>
              <ALLPurchaseOrdersList
                activeTab={activeTab}
                columns={PurchaseOrderColumns}
              />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <Suspense fallback={<FallBackLoader />}>
              <DraftPurchaseOrdersList columns={PurchaseOrderColumns} />
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
