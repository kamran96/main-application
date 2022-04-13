import React, { FC, Fragment } from 'react';
import { StyleSheet, View, Text } from '@react-pdf/renderer';
import { PdfDocument } from './PdfDocument';
import { PDFFontWrapper } from './PDFFontWrapper';
import { PDFHeader } from './pdf-header';
import { IAccountsResult } from '../../modal/accounts';
import moneyFormat from '../../utils/moneyFormat';
import { Item } from 'rc-menu';

interface IPropsHeader {
  title?: string;
  organizationName?: string;
  organizationEmail?: string;
  organizationContact?: string;
  website?: string;
  address?: string;
  city?: string;
  code?: string | number;
  country?: string;
  logo?: string;
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

interface IProps {
  header: IPropsHeader;
  incomeStatement: IBalanceSheetData[];
  searchedQueryItem: any;
  total: number;
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  Header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  Itemborder: {
    border: '1px solid #F4F4F4',
  },
  ItemWidth: {
    padding: '11px 20px',
  },
  fontsDetails: {
    fontSize: '11px',
    fontWeight: 'normal',
  },
  padding: {
    padding: '8px 2px',
  },
  itemFlex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderRight: {
    borderRight: '1px solid black',
  },
  totalValue: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  marginLeft: {
    marginLeft: '10px',
    fontWeight: 'bold',
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: '12px',
  },
  smallWidth: {
    width: '20%',
    paddingLeft: '8px',
  },
  partialWidth: {
    width: '25%',
  },
  paddingTopBottom: {
    padding: '10px 0',
  },
  paddingBottom: {
    paddingBottom: '5px',
  },
  totalMargin: {
    marginRight: '10%',
  },
  partiallargeWidth: {
    width: '60%',
  },
  ItemMarginRight: {
    marginLeft: '10px',
  },
});

export const IncomeStatementPdf: FC<IProps> = ({
  header,
  incomeStatement,
  searchedQueryItem,
  total,
}) => {
  return (
    <PdfDocument>
      <PDFFontWrapper>
        <PDFHeader {...header} />
        <View style={styles.body}>
          <View>
            <View style={styles.Header}>
              <Text
                style={[
                  styles.Itemborder,
                  styles.ItemWidth,
                  !searchedQueryItem?.date && styles.partiallargeWidth,
                ]}
              >
                Particulars
              </Text>
              {searchedQueryItem?.date && (
                <>
                  <Text style={[styles.Itemborder, styles.ItemWidth]}>
                    Opening
                  </Text>
                  <Text style={[styles.Itemborder, styles.ItemWidth]}>
                    Debit
                  </Text>
                  <Text style={[styles.Itemborder, styles.ItemWidth]}>
                    Credit
                  </Text>
                  <Text style={[styles.Itemborder, styles.ItemWidth]}>
                    Net Change
                  </Text>
                </>
              )}
              <Text
                style={[
                  styles.Itemborder,
                  styles.ItemWidth,
                  !searchedQueryItem?.date && styles.partialWidth,
                ]}
              >
                {searchedQueryItem?.date ? 'Closing' : 'Amount'}
              </Text>
              <Text
                style={[
                  styles.Itemborder,
                  styles.ItemWidth,
                  !searchedQueryItem?.date && styles.partialWidth,
                ]}
              >
                Total
              </Text>
            </View>
          </View>
          <View style={[styles.Itemborder, styles.paddingBottom]}>
            {incomeStatement.map((income) => {
              return (
                <View>
                  <View style={[styles.fontsDetails]}>
                    <Text style={[styles.padding, styles.marginLeft]}>
                      {income.name}
                    </Text>
                    {income.accounts.map((acc, index) => {
                      return (
                        <View style={[styles.itemFlex]}>
                          <Text
                            style={[
                              !searchedQueryItem?.date &&
                                styles.partiallargeWidth,
                              searchedQueryItem?.date && styles.partialWidth,
                              styles.paddingTopBottom,
                              styles.ItemMarginRight,
                            ]}
                          >
                            {acc.name}
                          </Text>

                          {searchedQueryItem?.date && (
                            <>
                              <Text
                                style={
                                  searchedQueryItem?.date && styles.smallWidth
                                }
                              >
                                {moneyFormat(acc?.opening_balance?.toFixed(2))}
                              </Text>
                              <Text
                                style={
                                  searchedQueryItem?.date && styles.smallWidth
                                }
                              >
                                {moneyFormat(acc?.total_debits?.toFixed(2))}
                              </Text>
                              <Text
                                style={
                                  searchedQueryItem?.date && styles.smallWidth
                                }
                              >
                                {moneyFormat(acc?.total_credits?.toFixed(2))}
                              </Text>
                              <Text
                                style={
                                  searchedQueryItem?.date && styles.smallWidth
                                }
                              >
                                {moneyFormat(acc?.net_change?.toFixed(2))}
                              </Text>
                            </>
                          )}
                          <Text
                            style={[
                              !searchedQueryItem?.date && styles.partialWidth,
                              searchedQueryItem?.date && styles.smallWidth,
                            ]}
                          >
                            {moneyFormat(acc?.balance.toFixed(2))}
                          </Text>
                          <Text
                            style={[
                              !searchedQueryItem?.date && styles.partialWidth,
                              searchedQueryItem?.date && styles.smallWidth,
                            ]}
                          ></Text>
                        </View>
                      );
                    })}

                    <Text
                      style={[
                        styles.totalValue,
                        styles.fontBold,
                        !searchedQueryItem?.date && styles.totalMargin,
                      ]}
                    >
                      {moneyFormat(income?.balance.toFixed(2))}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={[styles.itemFlex, styles.Itemborder, styles.fontBold]}>
            <Text style={[styles.padding]}>Total</Text>
            <Text style={[!searchedQueryItem?.date && styles.totalMargin]}>
              {moneyFormat(total.toFixed(2))}
            </Text>
          </View>
        </View>
      </PDFFontWrapper>
    </PdfDocument>
  );
};
