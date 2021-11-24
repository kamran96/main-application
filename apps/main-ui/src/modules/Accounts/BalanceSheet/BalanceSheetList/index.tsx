/* eslint-disable react-hooks/exhaustive-deps */
import printIcon from '@iconify-icons/bytesize/print';
import { Card } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { BalanceSheetAPI } from '../../../../api';
import { ButtonTag } from '../../../../components/ButtonTags';
import { Heading } from '../../../../components/Heading';
import { BoldText, BOLDTEXT } from '../../../../components/Para/BoldText';
import { PrintFormat } from '../../../../components/PrintFormat';
import {
  PrintHeaderFormat,
  TableDivisions,
} from '../../../../components/PrintHeader';
import {
  Addressbar,
  TopbarLogoWithDetails,
} from '../../../../components/PrintHeader/Formats';
import { SmartFilter } from '../../../../components/SmartFilter';
import { TableCard } from '../../../../components/TableCard';
import { Capitalize, P } from '../../../../components/Typography';
import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { IThemeProps } from '../../../../hooks/useTheme/themeColors';
import { DivProps, ISupportedRoutes } from '../../../../modal';
import { IAccountsResult } from '../../../../modal/accounts';
import moneyFormat from '../../../../utils/moneyFormat';
import printDiv from '../../../../utils/Print';
import FilterSchema from './filterSchema';

interface IBalanceSheetConfig {
  columns: ColumnsType<any>;
  data: any[];
}

enum ITransactionType {
  DEBIT = 1,
  CREDIT = 2,
}

interface IBalanceSheetData {
  balance: number;
  name: string;
  accounts: IAccountsResult[];
  type: ITransactionType;
}

export const BalanceSheetList: FC = () => {
  const [balanceSheetData, setBalanceSheet] = useState<IBalanceSheetData[]>([]);
  const [{ totalCredits, totalDebits }, setTotals] = useState({
    totalCredits: 0,
    totalDebits: 0,
  });
  const { routeHistory } = useGlobalContext();
  const { history } = routeHistory;

  const [config, setConfig] = useState({
    query: '',
  });

  const { query } = config;

  useEffect(() => {
    if (history?.location?.search) {
      let obj = {};
      const queryArr = history.location.search.split('?')[1].split('&');
      queryArr.forEach((item, index) => {
        const split = item.split('=');
        obj = { ...obj, [split[0]]: split[1] };
      });
      setConfig({ ...config, ...obj });
    }
  }, [history]);

  /*Query hook for  Fetching all accounts against ID */
  const { data, isLoading } = useQuery(
    [`report-balance-sheet-${config.query}`, config.query],
    BalanceSheetAPI
  );

  useEffect(() => {
    if (data && data.data && data.data.result) {
      const { result } = data.data;

      // let newResult: IBalanceSheetData[] | any[] = [
      //   "Fixed Assets",
      //   "Current Assets",
      //   "Fixed Liability",
      //   `Current Liability`,
      //   "Equity",
      // ]
      //   .map((item, index) => {
      //     const filtered: IAccountsResult[] = result.filter(
      //       (fItem: IAccountsResult) => fItem.secondary_account.name === item
      //     );

      //     let { balance } = filtered.length
      //       ? filtered.reduce((a, b) => {
      //           return { balance: a.balance + b.balance };
      //         })
      //       : { balance: 0 };
      //     if (filtered?.length) {
      //       return {
      //         name: item,
      //         balance,
      //         type: ["Fixed Assets", "Current Assets"].includes(item)
      //           ? ITransactionType.DEBIT
      //           : ITransactionType.CREDIT,
      //         accounts: filtered,
      //       };
      //     } else {
      //       return null;
      //     }
      //   })
      //   .filter((item) => item !== null);

      // let debit = newResult.filter(
      //   (item) => item.type === ITransactionType.DEBIT
      // );
      // let credits = newResult.filter(
      //   (item) => item.type === ITransactionType.CREDIT
      // );

      // const { balance: totalDebits } = (debit?.length &&
      //   debit.reduce((a, b) => {
      //     return {
      //       balance: a?.balance ? a.balance : 0 + b?.balance ? b.balance : 0,
      //     };
      //   })) || { balance: 0 };

      // const { balance: totalCredits } = (credits?.length &&
      //   credits.reduce((a, b) => {
      //     return {
      //       balance: a?.balance ? a.balance : 0 + b?.balance ? b.balance : 0,
      //     };
      //   })) || { balance: 0 };

      // setTotals({ totalDebits, totalCredits });

      setBalanceSheet(result);
    }
  }, [data]);

  const printRef = useRef();

  const onPrint = () => {
    const printItem = printRef.current;

    printDiv(printItem);
  };

  const searchedQueryItem: any = useMemo(() => {
    return query ? JSON.parse(atob(query)) : query;
  }, [query]);

  return (
    <WrapperBalanceSheetList
      adjustedWidth={searchedQueryItem?.date ? '106%' : `109%`}
    >
      <Card loading={isLoading} className="balancesheet-card">
        <div className="flex alignCenter justifySpaceBetween pb-20">
          <div>
            <Heading type="form-inner">Balance Sheet</Heading>
            <P className="dark-text"></P>
          </div>
          <div className="_disable_print flex alignCenter">
            <ButtonTag
              className="mr-10"
              onClick={onPrint}
              title="Print"
              size="middle"
              icon={printIcon}
            />
            <SmartFilter
              formSchema={FilterSchema}
              onFilter={(query) => {
                setConfig({ query: query });
                history.push(
                  `/app${ISupportedRoutes.BALANCE_SHEET}?query=${query}`
                );
              }}
            />
          </div>
        </div>
        <PrintFormat>
          <>
            <div className="mb-30 _visibleOnPrint">
              <PrintHeaderFormat hasbackgroundColor={true}>
                <TableDivisions
                  divisions={[
                    {
                      element: <TopbarLogoWithDetails />,
                    },
                    {
                      element: <Addressbar />,
                    },
                  ]}
                />
              </PrintHeaderFormat>
            </div>
            <div className="balance_sheet_table_wrapper">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Particulars</th>
                    {searchedQueryItem?.date ? (
                      <>
                        <th className="textCenter" colSpan={2}>
                          Opening
                        </th>
                        <th className="textCenter" colSpan={2}>
                          Changed
                        </th>
                        <th className="textCenter" colSpan={2}>
                          Closing
                        </th>
                      </>
                    ) : (
                      <>
                        <th>Debit</th>
                        <th>Credit</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {balanceSheetData.map(
                    (accountHead: IBalanceSheetData, index: number) => {
                      return (
                        <>
                          <tr>
                            {/* heads will be here */}
                            <td
                              className="_account_group_header"
                              colSpan={
                                searchedQueryItem?.date && index == 0 ? 1 : 7
                              }
                            >
                              <Capitalize>
                                <BOLDTEXT>{accountHead?.name}</BOLDTEXT>
                              </Capitalize>
                            </td>
                            {searchedQueryItem?.date && index == 0 ? (
                              <>
                                <td className="textCenter _account_group_header">
                                  <BOLDTEXT>Dr </BOLDTEXT>
                                </td>
                                <td className="textCenter _account_group_header">
                                  <BOLDTEXT>Cr </BOLDTEXT>
                                </td>
                                <td className="textCenter _account_group_header">
                                  <BOLDTEXT>Dr </BOLDTEXT>
                                </td>
                                <td className="textCenter _account_group_header">
                                  <BOLDTEXT>Cr </BOLDTEXT>
                                </td>
                                <td className="textCenter _account_group_header">
                                  <BOLDTEXT>Dr </BOLDTEXT>
                                </td>
                                <td className="textCenter _account_group_header">
                                  <BOLDTEXT>Cr </BOLDTEXT>
                                </td>
                              </>
                            ) : (
                              <>
                                <td></td>
                                <td></td>
                              </>
                            )}
                          </tr>
                          {accountHead?.accounts?.map((acc, index) => {
                            return (
                              <tr>
                                <td>{acc?.name}</td>
                                {searchedQueryItem?.date ? (
                                  <>
                                    <td className="textCenter">
                                      {acc?.opening_debits}
                                    </td>
                                    <td className="textCenter">
                                      {acc?.opening_credits}
                                    </td>
                                    <td className="textCenter">
                                      {acc?.total_debits}
                                    </td>
                                    <td className="textCenter">
                                      {acc?.total_credits}
                                    </td>
                                    <td className="textCenter">
                                      {acc?.closing_debits}
                                    </td>
                                    <td className="textCenter">
                                      {acc?.closing_credits}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      {accountHead.type ===
                                        ITransactionType.DEBIT &&
                                        moneyFormat(acc.balance.toFixed(2))}
                                    </td>
                                    <td>
                                      {' '}
                                      {accountHead.type ===
                                        ITransactionType.CREDIT &&
                                        moneyFormat(acc.balance.toFixed(2))}
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                          <tr className="calculated_groups">
                            <td colSpan={searchedQueryItem?.date ? 6 : 2}>
                              <Capitalize>
                                <BOLDTEXT>Total {accountHead?.name}</BOLDTEXT>
                              </Capitalize>
                            </td>
                            <td>
                              <BOLDTEXT>
                                {moneyFormat(accountHead?.balance)}
                              </BOLDTEXT>
                            </td>
                          </tr>
                        </>
                      );
                    }
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td>
                      <BoldText>Total</BoldText>
                    </td>
                    {searchedQueryItem?.date && <td />}
                    <td>
                      <BoldText>{moneyFormat(totalDebits.toFixed(2))}</BoldText>
                    </td>
                    <td>
                      <BoldText>
                        {moneyFormat(totalCredits.toFixed(2))}
                      </BoldText>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        </PrintFormat>
      </Card>
    </WrapperBalanceSheetList>
  );
};

interface WrapperBalanceSheetProps extends DivProps {
  adjustedWidth?: string;
}

const WrapperBalanceSheetList = styled.div<WrapperBalanceSheetProps>`
  .balance_sheet_table_wrapper {
    table thead tr th {
      background: ${(props: IThemeProps) => props?.theme?.colors?.bgTh};
      box-sizing: border-box;
      padding: 11px 24px;
      color: #ffff;
    }
    table thead tr th:first-child {
      border-top-left-radius: 5px;
    }
    table thead tr th:last-child {
      border-top-right-radius: 5px;
    }

    table tbody tr td {
      padding: 12px 0px;
      font-size: 15px;
      /* identical to box height */

      text-transform: capitalize;

      /* text label */

      color: #3e3e3c;
    }
    table tbody tr:nth-child(even) td {
      background: #fcfcfc;
    }
    table tbody tr td:first-child {
      padding-left: 24px;
    }

    .calculated_groups {
      td {
        border-top: 1px solid #d2d2d2;
        border-bottom: 1px solid #d2d2d2;
      }
    }
  }
`;
