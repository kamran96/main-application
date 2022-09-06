/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import React, { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Heading } from '../../../components/Heading';
import { TableTabs, TableTabsContent } from '../../../components/TableTabs';

import { ISupportedRoutes } from '../../../modal';
import { ContactMainWrapper } from './styles';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { FallBackLoader } from '../../../components/FallBackLoader';
import { Rbac } from '../../../components/Rbac/index';
import { PERMISSIONS } from '../../../components/Rbac/permissions';

export const ContactList: FC = () => {
  /* DYNAMIC IMPORTS */

  const Customers = lazy(() => import('./Customers'));
  const Suppliers = lazy(() => import('./Suppliers'));

  const { routeHistory } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('');
  const { search } = routeHistory.history.location;
  useEffect(() => {
    if (!activeTab) {
      setActiveTab('customers');
    }
  }, []);

  useEffect(() => {
    if (search) {
      const filterTab = search.split('?')[1].split('&')[0].split('=')[1];
      if (filterTab !== null && filterTab !== 'id') {
        if (activeTab !== filterTab) {
          setActiveTab(filterTab);
        }
      }
    }
  }, [search]);

  const RenderButton = () => {
    return (
      <Rbac permission={PERMISSIONS.CONTACTS_CREATE}>
        <Button
          style={{ background: '#1E75F1' }}
          className="ml-10"
          type="primary"
        >
          <Link
            to={{
              pathname: `/app${ISupportedRoutes.CREATE_CONTACT}`,
              state: activeTab,
            }}
          >
            Add Contact
          </Link>
        </Button>
      </Rbac>
    );
  };

  /* JSX */
  return (
    <ContactMainWrapper>
      <div className="headingWrapper flex justifySpaceBetween alignCenter">
        <Heading type="table">Contacts</Heading>
      </div>

      <TableTabs
        defaultkey={`${activeTab}`}
        tabBarExtraContent={RenderButton()}
      >
        <>
          <TableTabsContent tab="Customers" key="customers">
            <Suspense fallback={<FallBackLoader />}>
              <Customers />
            </Suspense>
          </TableTabsContent>
          <TableTabsContent tab="Suppliers" key="suppliers">
            <Suspense fallback={<FallBackLoader />}>
              <Suppliers />
            </Suspense>
          </TableTabsContent>
        </>
      </TableTabs>
    </ContactMainWrapper>
  );
};
