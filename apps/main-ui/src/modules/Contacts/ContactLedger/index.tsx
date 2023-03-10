import React, { useEffect, useState } from 'react';
import { Breadcrumb } from 'antd';
import styled from 'styled-components';
import { BreadCrumbArea, Heading, TableCard } from '@components';
import { LedgerList } from './LedgerList';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { useQuery } from 'react-query';
import { getAllContacts } from '../../../api';
import { IContactType, ISupportedRoutes } from '@invyce/shared/types';
import { Capitalize } from '../../../components/Typography';

export const ContactLedger = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory?.history;
  const [id, setId] = useState(null);
  const [type, setType] = useState(1);
  useEffect(() => {
    if (location?.search.includes('type=supplier')) {
      setType(2);
    } else {
      setType(1);
    }

    setId(location.pathname.split('/app/contacts/')[1]);
  }, [location]);

  const { data } = useQuery([`all-contacts`, 'ALL'], getAllContacts);
  const result: IContactType[] = (data && data.data && data.data.result) || [];

  const getContactById = (id: number) => {
    if (result && result.length > 0) {
      const [filtered] = result.filter((item) => item.id === id);
      return filtered;
    } else {
      return null;
    }
  };

  return (
    <WrapperContactLedger>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.CONTACTS}`}>Contacts</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Contact Ledger</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <TableCard>
        <div>
          <Heading type="table">
            <Capitalize>
              {result.length > 0
                ? ` ${getContactById(id) && getContactById(id).name}   Ledger`
                : ''}
            </Capitalize>
          </Heading>
        </div>
        <LedgerList type={type} id={id} />
      </TableCard>
    </WrapperContactLedger>
  );
};

const WrapperContactLedger = styled.div``;
