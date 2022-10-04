/* eslint-disable react-hooks/exhaustive-deps */
import printIcon from '@iconify-icons/bytesize/print';
import { Card } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC, useEffect, useMemo, useRef, useState, lazy } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { BalanceSheetAPI } from '../../../../api';
import {
  ButtonTag,
  Heading,
  SmartFilter,
  Capitalize,
  P,
  PDFICON,
  BalanceSheetPdf,
  BOLDTEXT,
  MeduimText,
  Addressbar,
  TopbarLogoWithDetails,
  PrintHeaderFormat,
  TableDivisions,
} from '@components';
import { PrintFormat } from '../../../../components/PrintFormat';

import { useGlobalContext } from '../../../../hooks/globalContext/globalContext';
import { IThemeProps } from '@invyce/shared/invyce-theme';
import {
  DivProps,
  ISupportedRoutes,
  IAccountsResult,
} from '@invyce/shared/types';
import moneyFormat from '../../../../utils/moneyFormat';
import printDiv from '../../../../utils/Print';
import FilterSchema from './filterSchema';
import DUMMYLOGO from '../../../../assets/quickbook.png';
import { PDFDownloadLink } from '@react-pdf/renderer';

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
  const PDFDownloader = lazy(
    () => import('../../../../components/PDFs/PDFDownloader')
  );
  const [balanceSheetData, setBalanceSheet] = useState<IBalanceSheetData[]>([]);
  const [
    {
      totalCredits,
      totalDebits,
      closing_credits,
      closing_debits,
      opening_credits,
      opening_debits,
    },
    setTotals,
  ] = useState({
    totalCredits: 0,
    totalDebits: 0,
    closing_credits: 0,
    closing_debits: 0,
    opening_credits: 0,
    opening_debits: 0,
  });
  const { routeHistory, userDetails } = useGlobalContext();
  const { history } = routeHistory;

  const [config, setConfig] = useState({
    query: '',
  });

  //handle Organization Data
  const { organization } = userDetails;
  const {
    address: organizationAddress,
    name: organizationName,
    email: organizationEmail,
    phoneNumber: organizationContact,
    website,
  } = organization;
  const { city, country, postalCode } = organizationAddress;

  const headerprops = {
    organizationName,
    city,
    country,
    title: 'BalanceSheet',
    organizationContact,
    organizationEmail,
    address: '',
    code: postalCode,
    logo: DUMMYLOGO,
    website,
  };
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

      setTotals(() => {
        const newRes = result?.map((item) => {
          return {
            ...item?.accounts?.reduce((a, b) => {
              // debugger;
              return {
                closing_credits: a?.closing_credits + b?.closing_credits,
                closing_debits: a?.closing_debits + b?.closing_debits,
                opening_credits: a?.opening_credits + b?.opening_credits,
                opening_debits: a?.opening_debits + b?.opening_debits,
              };
            }),
            totalCredits:
              item?.type === ITransactionType?.CREDIT ? item?.balance : 0,
            totalDebits:
              item?.type === ITransactionType?.DEBIT ? item?.balance : 0,
          };
        });

        return (
          newRes?.length &&
          newRes?.reduce((a, b) => {
            return {
              totalCredits: a?.totalCredits + b?.totalCredits,
              totalDebits: a?.totalDebits + b?.totalDebits,
              closing_credits: a?.closing_credits + b?.closing_credits,
              closing_debits: a?.closing_debits + b?.closing_debits,
              opening_credits: a?.opening_credits + b?.opening_credits,
              opening_debits: a?.opening_debits + b?.opening_debits,
            };
          })
        );
      });

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
            {balanceSheetData?.length > 0 && (
              <PDFDownloadLinkWrapper
                document={
                  <BalanceSheetPdf
                    totals={{
                      totalCredits,
                      totalDebits,
                      closing_credits,
                      closing_debits,
                      opening_credits,
                      opening_debits,
                    }}
                    header={headerprops}
                    balanceSheetData={balanceSheetData}
                    searchquery={searchedQueryItem}
                  />
                }
              >
                <div className="flex alignCenter">
                  <PDFICON className="flex alignCenter mr-5" />

                  <span> Download PDF</span>
                </div>
              </PDFDownloadLinkWrapper>
            )}
            <ButtonTag
              className="mh-10"
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
        <div ref={printRef}>
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
                      <th className="ant-table-cell textLeft">Particulars</th>
                      {searchedQueryItem?.date ? (
                        <>
                          <th className="textCenter ant-table-cell" colSpan={2}>
                            Opening
                          </th>
                          <th className="textCenter ant-table-cell" colSpan={2}>
                            Changed
                          </th>
                          <th className="textCenter ant-table-cell" colSpan={2}>
                            Closing
                          </th>
                        </>
                      ) : (
                        <>
                          <th className="ant-table-cell">Debit</th>
                          <th className="ant-table-cell">Credit</th>
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
                                      <td className="textCenter">
                                        {accountHead.type ===
                                          ITransactionType.DEBIT &&
                                          moneyFormat(acc.balance.toFixed(2))}
                                      </td>
                                      <td className="textCenter">
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
                              <td
                                colSpan={
                                  searchedQueryItem?.date
                                    ? 6
                                    : accountHead.type ===
                                      ITransactionType.DEBIT
                                    ? 1
                                    : 2
                                }
                              >
                                <Capitalize>
                                  <BOLDTEXT>Total {accountHead?.name}</BOLDTEXT>
                                </Capitalize>
                              </td>
                              <td className="textCenter">
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
                        <MeduimText>Total</MeduimText>
                      </td>
                      {searchedQueryItem?.date && (
                        <>
                          <td>
                            <MeduimText>
                              {moneyFormat(opening_debits.toFixed(2) || 0)}
                            </MeduimText>
                          </td>
                          <td>
                            <MeduimText>
                              {moneyFormat(opening_credits.toFixed(2) || 0)}
                            </MeduimText>
                          </td>
                          <td>
                            <MeduimText>
                              {moneyFormat(closing_debits.toFixed(2) || 0)}
                            </MeduimText>
                          </td>
                          <td>
                            <MeduimText>
                              {moneyFormat(closing_credits.toFixed(2) || 0)}
                            </MeduimText>
                          </td>
                        </>
                      )}
                      <td className="textCenter">
                        <MeduimText>
                          {moneyFormat(totalDebits?.toFixed(2) || 0)}
                        </MeduimText>
                      </td>
                      <td className="textCenter">
                        <MeduimText>
                          {moneyFormat(totalCredits?.toFixed(2) || 0)}
                        </MeduimText>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          </PrintFormat>
        </div>
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
      font-weight: normal;
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
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

      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
    }
    table tbody tr:nth-child(even) td {
      background: ${(props: IThemeProps) => props?.theme?.colors?.td};
    }
    table tbody tr td:first-child {
      padding-left: 24px;
    }

    table tfoot tr td {
      padding: 10px 10px;
    }

    .calculated_groups {
      td {
        border-top: 1px solid
          ${(props: IThemeProps) => props?.theme?.colors?.seprator};
        border-bottom: 1px solid
          ${(props: IThemeProps) => props?.theme?.colors?.seprator};
      }
    }
  }
`;
const PDFDownloadLinkWrapper = styled(PDFDownloadLink)`
  background: #e4e4e4;
  padding: 5px 5px;
  border-radius: 2px;
  margin-right: 8px;
  color: #333333;
  border: none;
  outline: none;
  transition: 0.4s all ease-in-out;
  &:hover {
    background: #143c69;
    color: #ffff;
  }
`;
