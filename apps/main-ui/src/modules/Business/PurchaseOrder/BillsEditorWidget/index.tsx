import { FC } from 'react';
import { Breadcrumb } from 'antd';
import styled from 'styled-components';
import { BreadCrumbArea } from '../../../../components/BreadCrumbArea';
import { Link } from 'react-router-dom';
import { ISupportedRoutes } from '../../../../modal';
import { Heading } from '../../../../components/Heading';
import { PurchasesWidget } from '../../../../components/PurchasesWidget';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';

export const BillsEditorWidget: FC = () => {
  const { routeHistory } = useGlobalContext();
  const { location } = routeHistory;

  const id =
    location &&
    location.pathname.split(
      `/app${ISupportedRoutes.CREATE_PURCHASE_Entry}/`
    )[1];

  const Requires = {
    itemId: {
      require: false,
      message: 'Item is Requred to Proceed invoice',
    },
    description: {
      require: false,
      message: '',
    },
    quantity: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
    unitPrice: {
      require: false,
      message: 'Item is Requred to Proceed invoice',
    },
    purchasePrice: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
    itemDiscount: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
    tax: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
    total: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
    costOfGoodAmount: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
    index: {
      require: false,
      message: 'Item is Requred to Proceed invoice',
    },
    accountId: {
      require: true,
      message: 'Item is Requred to Proceed invoice',
    },
  };

  return (
    <WrapperBillsEditor>
      <Heading type='form'>Create Bill</Heading>
      <BreadCrumbArea>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={`/app${ISupportedRoutes.PURCHASES}`}>Bills</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Create Bill</Breadcrumb.Item>
        </Breadcrumb>
      </BreadCrumbArea>
      <PurchasesWidget requires={Requires} type="POE" id={id} />
      {/* <InvoiceForm type="PO" /> */}
    </WrapperBillsEditor>
  );
};

const WrapperBillsEditor = styled.div``;
