/* eslint-disable react-hooks/exhaustive-deps */
import { FC, lazy, Suspense, useEffect, useState } from 'react';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { TableTabs, TableTabsContent } from '../../../../components/TableTabs';
import { FallBackLoader } from '../../../../components/FallBackLoader';
import {  WrapperTransactionsList } from './styles';

export const TransactionsList: FC = () => {
  const APPROVETransactionList = lazy(() => import('./All'));
  const DRAFTTransactionList = lazy(() => import('./Drafts'));

  const [activeTab, setActiveTab] = useState('');
  const { routeHistory } = useGlobalContext();
  const { search } = routeHistory.history.location;


  useEffect(() => {
    if (!activeTab) {
      setActiveTab('approve');
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

  return (
    <WrapperTransactionsList>
      <TableTabs
        defaultkey={`${activeTab}`}
      >
        <>
          <TableTabsContent tab="Approve" key="approve">
            <Suspense fallback={<FallBackLoader />}>
              <APPROVETransactionList />
            </Suspense>
          </TableTabsContent>

          <TableTabsContent tab="Draft" key="draft">
            <Suspense fallback={<FallBackLoader />}>
              <DRAFTTransactionList />
            </Suspense>
          </TableTabsContent>
          </>
      </TableTabs>
      
    </WrapperTransactionsList>
  );
};
