import { Button } from 'antd';
import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import fileInvoice from '@iconify-icons/la/file-invoice';
import { Icon } from '@iconify/react';
import { Heading } from '../../../components/Heading';

import { FallBackLoader } from '../../../components/FallBackLoader';
import { Rbac } from '../../../components/Rbac';
import { PERMISSIONS } from '../../../components/Rbac/permissions';
import { TableTabs, TableTabsContent } from '../../../components/TableTabs';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '../../../modal';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';

export const CreditNoteList: FC = () => {
  /* Dynamic Imports */
  const AprovedCreditNotes = lazy(() => import('./AprovedCreditNotes'));
  const DraftCreditNotes = lazy(() => import('./DraftCreditNotes'));

  const { routeHistory } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('');
  const { search } = routeHistory.history.location;

  useEffect(() => {
    if (!activeTab) {
      setActiveTab('aproved');
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
        <Link to={`/app${ISupportedRoutes.ADD_CREDIT_NOTE}`}>
          <Button type="primary" size="middle">
            New Credit Note
          </Button>
        </Link>
      </Rbac>
    );
  };

  return (
    <MainWrapperCreditNotes>
      <div className="flex alignCenter mb-10">
        <Icon
          className="mr-5 title-icon"
          style={{ fontSize: '28px' }}
          icon={fileInvoice}
        />
        <Heading type="table">Credit Notes</Heading>
      </div>
      <TableTabs
        defaultkey={`${activeTab}`}
        tabBarExtraContent={RenderButton()}
      >
        <>
          <TableTabsContent tab="Aproved" key="aproved">
            <Suspense fallback={<FallBackLoader />}>
              <AprovedCreditNotes />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <Suspense fallback={<FallBackLoader />}>
              <DraftCreditNotes />
            </Suspense>
          </TableTabsContent>
        </>
      </TableTabs>
    </MainWrapperCreditNotes>
  );
};

const MainWrapperCreditNotes = styled.div`
  .ant-tabs-nav {
    margin-bottom: 0 !important;
  }

  .title-icon {
    color: ${(props: IThemeProps) => props?.theme?.colors?.$LIGHT_BLACK};
  }
`;
