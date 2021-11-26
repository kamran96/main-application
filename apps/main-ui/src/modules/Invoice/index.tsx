import React, { FC } from 'react';
import fileInvoice from '@iconify-icons/la/file-invoice';
import { Icon } from '@iconify/react';
import styled from 'styled-components';

import { Heading } from '../../components/Heading';
import { InvoiceList } from './InvoiceList';

export const InvoiceContainer: FC = () => {
  return (
    <WrapperInvoice>
      <div className="invoice_header">
        <div className="flex alignCenter mb-10">
          <Icon
            className="mr-5"
            style={{ fontSize: '28px' }}
            icon={fileInvoice}
          />
          <Heading type="table">Invoice</Heading>
        </div>
      </div>
      <InvoiceList />
    </WrapperInvoice>
  );
};

export const WrapperInvoice = styled.div`
  .invoice_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
