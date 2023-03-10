/* eslint-disable react-hooks/exhaustive-deps */
import { ColumnsType } from 'antd/lib/table';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { IncomeStatementAPI } from '../../../api';
import {
  ButtonTag,
  Heading,
  BoldText,
  PrintFormat,
  SmartFilter,
  PrintHeader,
  TableCard,
  P,
  CommonLoader,
  PrintHeaderFormat,
  TableDivisions,
  Addressbar,
  TopbarLogoWithDetails,
  IncomeStatementPdf,
  PDFICON,
} from '@components';

import { useGlobalContext } from '../../../hooks/globalContext/globalContext';
import { ISupportedRoutes, IAccountsResult } from '@invyce/shared/types';
import moneyFormat from '../../../utils/moneyFormat';
import printDiv from '../../../utils/Print';
import FilterSchema from './filter';
import printIcon from '@iconify-icons/bytesize/print';
import { IThemeProps } from '../../../hooks/useTheme/themeColors';
import DUMMYLOGO from '../../../assets/quickbook.png';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// import FilterSchema from "./filterSchema";

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

export const IncomeStatementList: FC = () => {
  const [incomeStatementData, setIncomeStatementData] = useState<
    IBalanceSheetData[]
  >([]);
  const [total, setTotals] = useState(0);
  const { routeHistory, userDetails, Colors } = useGlobalContext();
  const { history } = routeHistory;

  const [config, setConfig] = useState({
    query: '',
  });
  const { query } = config;

  //User details
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
    title: 'IncomeStatement',
    organizationContact,
    organizationEmail,
    address: '',
    code: postalCode,
    logo: DUMMYLOGO,
    website,
  };

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
    [`report-income-statement-${config.query}`, config.query],
    IncomeStatementAPI
  );
  useEffect(() => {
    if (data?.data?.result) {
      const { result } = data?.data;
      const { balance } = (result.length > 0 &&
        result.reduce((a, b) => {
          return { balance: a.balance - b.balance };
        })) || { balance: 0 };

      setTotals(balance);

      setIncomeStatementData(result);
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
    <WrapperIncomeStatement>
      <TableCard minHeight={590}>
        <div className="flex alignCenter justifySpaceBetween pb-20">
          <div>
            <Heading type="form-inner">Income Statement</Heading>
            <P className="dark-text"></P>
          </div>
          <div className="_disable_print flex alignCenter">
            <PDFDownloadLinkWrapper
              document={
                <IncomeStatementPdf
                  header={headerprops}
                  incomeStatement={incomeStatementData}
                  searchedQueryItem={searchedQueryItem}
                  total={total}
                />
              }
            >
              <div className="flex alignCenter">
                <PDFICON className="flex alignCenter mr-5" />

                <span> Download PDF</span>
              </div>
            </PDFDownloadLinkWrapper>
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
                  `/app${ISupportedRoutes.INCOME_STATEMENT}?query=${query}`
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
              <div className="balancesheet-table-wrapper">
                <table className="balancesheet-table">
                  <thead>
                    <tr>
                      <th className="main-title-head">Particulars</th>
                      {searchedQueryItem?.date && (
                        <>
                          <th className="main-title-head static-width-header">
                            Opening
                          </th>
                          <th className="main-title-head static-width-header">
                            Debit
                          </th>
                          <th className="main-title-head static-width-header">
                            Credit
                          </th>
                          <th className="main-title-head static-width-header">
                            Net Change
                          </th>
                        </>
                      )}

                      <th className="main-title-head static-width-header">
                        {searchedQueryItem?.date ? 'Closing' : 'Amount'}
                      </th>
                      <th className="main-title-head static-width-header">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading || !incomeStatementData?.length ? (
                      <tr>
                        <td
                          rowSpan={4}
                          colSpan={3}
                          className="textCenter nodata_loader"
                        >
                          {isLoading ? <CommonLoader /> : 'No Data Found'}
                        </td>
                      </tr>
                    ) : (
                      <>
                        {incomeStatementData.map(
                          (accountHead: IBalanceSheetData, index: number) => {
                            return (
                              <tr>
                                <td colSpan={searchedQueryItem?.date ? 7 : 3}>
                                  <table style={{ width: '100%' }}>
                                    <thead>
                                      <th className="ItemName">
                                        {accountHead.name}
                                      </th>
                                      <th className="static-width"></th>
                                      <th className="static-width"></th>
                                      {searchedQueryItem?.date && (
                                        <>
                                          <th className="static-width"></th>
                                          <th className="static-width"></th>
                                          <th className="static-width"></th>
                                          <th className="static-width"></th>
                                        </>
                                      )}
                                    </thead>
                                    <tbody>
                                      {accountHead.accounts.map(
                                        (acc, index) => {
                                          return (
                                            <>
                                              <tr>
                                                <td>{acc.name}</td>
                                                {searchedQueryItem?.date && (
                                                  <>
                                                    <td className="static-width">
                                                      {moneyFormat(
                                                        acc?.opening_balance?.toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </td>
                                                    <td className="static-width">
                                                      {moneyFormat(
                                                        acc?.total_debits?.toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </td>
                                                    <td className="static-width">
                                                      {moneyFormat(
                                                        acc?.total_credits?.toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </td>
                                                    <td className="static-width">
                                                      {moneyFormat(
                                                        acc?.net_change?.toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </td>
                                                  </>
                                                )}
                                                <td className="static-width">
                                                  {moneyFormat(
                                                    acc?.balance?.toFixed(2)
                                                  )}
                                                </td>
                                                <td className="static-width"></td>
                                              </tr>
                                              {accountHead?.accounts?.length -
                                                1 ===
                                                index && (
                                                <tr>
                                                  <td></td>
                                                  {searchedQueryItem?.date && (
                                                    <>
                                                      <td />
                                                      <td />
                                                      <td />
                                                      <td />
                                                    </>
                                                  )}
                                                  <td></td>
                                                  <td>
                                                    <BoldText>
                                                      {moneyFormat(
                                                        accountHead.balance.toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </BoldText>
                                                  </td>
                                                </tr>
                                              )}
                                            </>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={searchedQueryItem?.date ? 6 : 2}>
                        <BoldText>Total</BoldText>
                      </td>
                      <td>
                        <BoldText>{moneyFormat(total.toFixed(2))}</BoldText>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          </PrintFormat>
        </div>
      </TableCard>
    </WrapperIncomeStatement>
  );
};
const WrapperIncomeStatement = styled.div`
  .balancesheet-table {
    width: 100%;
    border: 1px solid ${(props: IThemeProps) => props?.theme?.colors?.seprator};

    thead {
      tr th.main-title-head {
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.05em;
        text-transform: capitalize;
        border: 1px solid
          ${(props: IThemeProps) => props?.theme?.colors?.seprator};
        border-top: none;
        padding: 11px 20px;
        /* text heading color */
        color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
      }
    }
    tbody tr td:last-child {
      border-right: none;
    }
    tbody tr td {
      border-right: 1px solid
        ${(props: IThemeProps) => props?.theme?.colors?.seprator};
      padding: 0px;
      table thead th {
        color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
        border-right: 1px solid
          ${(props: IThemeProps) => props?.theme?.colors?.seprator};
        padding: 11px 20px;
      }
      table tbody td {
        color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
        padding: 8px 0px 8px 22px;
      }
      table thead th:last-child {
        border-right: none;
      }
    }

    tfoot tr td {
      color: ${(props: IThemeProps) => props?.theme?.colors?.textTd};
      border-top: 1px solid
        ${(props: IThemeProps) => props?.theme?.colors?.seprator};
      border-right: 1px solid
        ${(props: IThemeProps) => props?.theme?.colors?.seprator};
      padding: 11px 20px;
      p {
        font-size: 13px;
      }
    }
    tfoot tr td:last-child {
      border-right: none;
    }
  }

  .static-width {
    width: 160px;
  }
  .static-width-header {
    width: 160px;
  }
  .ItemName {
    display: flex;
    jutsify-content: flex-start;
    align-items: center;
  }

  .dark-text {
    color: ${(props: IThemeProps) => props?.theme?.colors?.$BLACK};
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 15px;
    text-transform: capitalize;
    margin-top: 10px;
  }

  .nodata_loader {
    padding: 130px 0 !important;
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
