import { Button } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Heading } from '../../components/Heading';
import { Rbac } from '../../components/Rbac';
import { PERMISSIONS } from '../../components/Rbac/permissions';
import { TableTabs, TableTabsContent } from '../../components/TableTabs';
import { useGlobalContext } from '../../hooks/globalContext/globalContext';
import { PaymentPaidList } from './PaymentsList/Payables';
import { PaymentRecievedList } from './PaymentsList/Recieveables';

export const PaymentContainer: FC = () => {
  const { routeHistory, setPaymentsModalConfig } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('paid');
  const { history } = routeHistory;
  const { search } = history.location;

  useEffect(() => {
    if (search) {
      let filterTab = search.split('?')[1].split('&')[0].split('=')[1];
      if (filterTab !== null && filterTab !== 'id') {
        setActiveTab(filterTab);
      }
    }
  }, [search]);
  return (
    <WrapperPaymentContainer>
      <Heading type="table">Payments</Heading>
      <div className="pv-10">
        <TableTabs
          defaultkey={`${activeTab}`}
          tabBarExtraContent={
            <Rbac permission={PERMISSIONS.PAYMENTS_CREATE}>
              <Button
                onClick={() => setPaymentsModalConfig(true)}
                type="primary"
                size="middle"
              >
                Add Payment
              </Button>
            </Rbac>
          }
        >
          <>
            <TableTabsContent tab="Paid" key="paid">
              <PaymentPaidList />
            </TableTabsContent>
            <TableTabsContent tab="Received" key="received">
              <PaymentRecievedList />
            </TableTabsContent>
          </>
        </TableTabs>
      </div>
      {/* <div className="flex alignCenter justifySpaceBetween pv-10">
        <Button
          onClick={() => setPaymentsModalConfig(true)}
          type="primary"
          size="middle"
        >
          Add Payment
        </Button>
      </div>
      <PaymentsList /> */}
    </WrapperPaymentContainer>
  );
};

const WrapperPaymentContainer = styled.div``;
