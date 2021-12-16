import React, { FC } from 'react';
import { Breadcrumb } from 'antd';
import styled from 'styled-components';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '../../../../modal';
import { Heading } from '../../../../components/Heading';
import { TableCard } from '../../../../components/TableCard';
import { PurchasesWidget } from '../../../../components/PurchasesWidget';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const BillsEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;
  console.log(
    location,
    `/app/${ISupportedRoutes.CREATE_PURCHASE_Entry}/`,
    'location'
  );
  const id =
    location &&
    location.pathname.split(
      `/app${ISupportedRoutes.CREATE_PURCHASE_Entry}/`
    )[1];

  return (
    <WrapperBillsEditor>
      <Heading>Create Bill</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.PURCHASES}`}>Bills</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create Bill</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <PurchasesWidget type="POE" id={id} />
      {/* <InvoiceForm type="PO" /> */}
    </WrapperBillsEditor>
  );
};

const WrapperBillsEditor = styled.div``;
