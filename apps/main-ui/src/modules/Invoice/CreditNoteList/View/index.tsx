import React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { IInvoiceType, ISupportedRoutes } from '../../../../modal';
import { PurchasesView } from '../../../../components/PurchasesView';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const CreditNoteView: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { pathname } = routeHistory.location;
  let invId = pathname.split('app/credit-notes/')[1];
  return (
    <WrapperCreditNoteView>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.CREDIT_NOTES}`}>
              Credit Notes
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Credit Note View</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>

      <PurchasesView type={IInvoiceType.CREDITNOTE} id={invId} />
    </WrapperCreditNoteView>
  );
};
const WrapperCreditNoteView = styled.div``;
