import { Breadcrumb } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getAllAccounts } from '../../../api/accounts';
import { BreadCrumbArea, Heading } from '@components';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes } from '@invyce/shared/types';
import { IAccountsResult } from '../../../modal/accounts';
import { AccountsLedgerList } from './AccountsLedgerList';
import { Link } from 'react-router-dom';

export const AccountsLedger: FC = () => {
  const [id, setId] = useState<number>(null);

  const { routeHistory } = useGlobalContext();
  useEffect(() => {
    if (routeHistory && routeHistory.location) {
      const { pathname } = routeHistory.location;
      const i = pathname.split('/app/accounts/')[1];
      setId(parseInt(i));
    }
  }, [routeHistory]);

  const { data } = useQuery([`all-accounts`, 'ALL'], getAllAccounts);
  const result: IAccountsResult[] =
    (data && data.data && data.data.result) || [];

  const getAccountById = (id: number | string) => {
    if (result) {
      const [filtered] = result.filter((item) => item.id === id);
      return filtered;
    } else {
      return null;
    }
  };

  return (
    <>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.ACCOUNTS}`}>Accounts</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Account Ledger</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <div className="pv-10">
        <Heading type="table">
          {result?.length > 0 ? getAccountById(id)?.name : ''}
        </Heading>
      </div>
      <AccountsLedgerList
        id={id}
        accountName={result?.length > 0 ? getAccountById(id)?.name : ''}
      />
    </>
  );
};
