import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import { topSuggestInvoicesAPI } from '../../../api';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import { ITopSuggestedInvoices } from '@invyce/shared/types';

export const AllInvoices: FC = () => {
  const [{ result }, setTopSuggestedInvoices] = useState<ITopSuggestedInvoices>(
    {
      result: [],
    }
  );

  const { data: topInvoicesData, isLoading: topInvoicesFetching } = useQuery(
    ['top-suggest-invoices'],
    topSuggestInvoicesAPI
  );

  useEffect(() => {
    if (topInvoicesData?.data?.result) {
      setTopSuggestedInvoices(topInvoicesData.data);
    }
  }, [topInvoicesData]);

  return (
    <WrapperAlltInvoices>
      <table>
        <thead>
          <tr>
            {[
              '#',
              'To',
              'Ref',
              'Invoice Number',
              'Date',
              'Due Date',
              'Paid Amount',
              'Status',
            ].map((head, index) => {
              return <th key={index}>{head}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {result.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.reference}</td>
                <td>{item.invoiceNumber}</td>
                <td>
                  {item.issueDate
                    ? dayjs(item.issueDate).format('DD/MM/YYYY h:mm A')
                    : '-'}
                </td>
                <td>
                  {item.dueDate
                    ? dayjs(item.dueDate).format('DD/MM/YYYY h:mm A')
                    : '-'}
                </td>
                <td>{item.netTotal}</td>
                <td>{item.case}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </WrapperAlltInvoices>
  );
};

const WrapperAlltInvoices = styled.div`
  overflow-y: auto;
  height: 220px;
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
