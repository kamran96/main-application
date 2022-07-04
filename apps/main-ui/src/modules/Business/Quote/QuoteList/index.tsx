import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { TableTabs, TableTabsContent } from '../../../../components/TableTabs';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { ALLQuotesList } from './AllQuotes';
import { QuoteColumns } from './commonCol';
import { DraftQuotesList } from './DraftList';
import { ProcessedQuotations } from './Processed';

export const QuoteList = () => {
  const { routeHistory } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('processed');
  const { search } = routeHistory.history.location;

  useEffect(() => {
    if (search) {
      let filterTab = search.split('?')[1].split('&')[0].split('=')[1];
      if (filterTab !== null && filterTab !== 'id') {
        setActiveTab(filterTab);
      }
    }
  }, [search]);
  return (
    <WrapperInvoiceList>
      <TableTabs defaultkey={activeTab}>
        <>
          <TableTabsContent tab="Processed" key="processed">
            <ProcessedQuotations columns={QuoteColumns} />
          </TableTabsContent>
          <TableTabsContent tab="Approved" key="aproved">
            <ALLQuotesList columns={QuoteColumns} />
          </TableTabsContent>
          <TableTabsContent tab="Draft" key="draft">
            <DraftQuotesList columns={QuoteColumns} />
          </TableTabsContent>
          {/* <TableTabsContent tab="Awating Payment" key="awating_payment">
            <PaymentAwaitingQuotesList columns={QuoteColumns} />
          </TableTabsContent> */}
        </>
      </TableTabs>
    </WrapperInvoiceList>
  );
};

const WrapperInvoiceList = styled.div`
  .ant-tabs-nav {
    margin: 0;
  }
`;
