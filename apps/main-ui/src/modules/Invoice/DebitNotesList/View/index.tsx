import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { IInvoiceType, ISupportedRoutes } from '@invyce/shared/types';
import { PurchasesView } from '../../../../components/PurchasesView';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const DebitNotesView: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  const invId = pathname.split(
    `${ISupportedRoutes?.DASHBOARD_LAYOUT}${ISupportedRoutes?.DEBIT_NOTES}/`
  )[1];


  return (
    <WrapperCreditNoteView>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.DEBIT_NOTES}`}>Debit Notes</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Debit Note View</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>

      <PurchasesView type={IInvoiceType.DEBITNOTE} id={invId} />
    </WrapperCreditNoteView>
  );
};
const WrapperCreditNoteView = styled.div``;
