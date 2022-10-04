import React, { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { draftInvoicesSuggestAPI } from '../../../api';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import { IInvoiceDraftsDashboard } from '@invyce/shared/types';
import Data from './var';

export const DraftInvoices: FC = () => {
  const [{ result }, setDraftInvoiceResponse] =
    useState<IInvoiceDraftsDashboard>({
      result: [],
    });
  const { data: draftInvoicesData, isLoading: draftInvoicesFetching } =
    useQuery(['draft-invoices-to-process'], draftInvoicesSuggestAPI);

  useEffect(() => {
    if (draftInvoicesData?.data?.result) {
      setDraftInvoiceResponse(draftInvoicesData.data);
    }
  }, [draftInvoicesData]);

  return (
    <WrapperDraftInvoices>
      <table>
        <thead>
          <tr>
            {['#', 'To', 'Payment Date', 'Amount', 'Invoice Items'].map(
              (head, index) => {
                return <th key={index}>{head}</th>;
              }
            )}
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.contactName}</td>
                <td>{item.paymentDate}</td>
                <td>{item.amount}</td>
                <td>{item.invoiceItems}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </WrapperDraftInvoices>
  );
};

const WrapperDraftInvoices = styled.div`
  table {
    width: 100%;
    thead > tr > th {
      color: ${(props: IThemeProps) =>
        props?.theme?.theme === 'dark'
          ? props?.theme?.colors?.$BLACK
          : props?.theme?.colors?.$Primary2};
    }
    tbody > tr > td {
      padding-top: 20px;
      padding-right: 50px;
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
  }
`;
