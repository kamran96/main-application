import React, { FC, Fragment } from 'react';
import { StyleSheet, View, Text, Font } from '@react-pdf/renderer';
import moneyFormat from '../../utils/moneyFormat';
import { PdfDocument } from './PdfDocument';
import { PDFFontWrapper } from './PDFFontWrapper';
import { IAccountsResult } from '../../modal/accounts';
import { PDFHeader } from './pdf-header';

enum ITransactionType {
  DEBIT = 1,
  CREDIT = 2,
}

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

interface IProps {
  header: IPropsHeader;
  totals: {
    totalCredits: number;
    totalDebits: number;
    closing_credits: number;
    closing_debits: number;
    opening_credits: number;
    opening_debits: number;
  };
  balanceSheetData: {
    name: string;
    accounts: IAccountsResult[];
    type: ITransactionType;
    balance: number;
  }[];
  searchquery: any;
}

const styles = StyleSheet.create({
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '23px 30px',
    fontFamily: 'Roboto Slab',
    backgroundColor: '#fafafa',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: '1.5',
    margin: '0 12px',
  },
  tableBody: {
    padding: '10px 30px',
    margin: '0 12px',
    width: '100%',
  },
  LabelName: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  bodyFont: {
    fontWeight: 'normal',
    padding: '12px 2px',
    fontSize: 10,
    color: '#272727',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Debit: {
    width: '56%',
  },
  Credit: {
    width: '90%',
  },
  totalContainer: {
    fontWeight: 600,
    fontSize: 10,
    borderTop: '1px solid #F4F4F4',
    borderBottom: '1px solid #F4F4F4',
    margin: '10px 0',
    marginRight: '30px',
    padding: '12px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  totalFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '8px',
  },
  filterTable: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Roboto Slab',
    fontSize: '10',
  },
  itemCenter: {
    width: '13%',
    padding: '12px 0',
  },
  ItemName: {
    flex: '1 0 0',
    padding: '12px 0',
  },
  ItemNameFilter: {
    flex: '2.5 0 0',
    padding: '12px 0',
  },
  tableHeaderWidth: {
    width: '35%',
  },
  tableHeaderItem: {
    width: '33%',
  },
  border: {
    borderTop: '1px solid #F4F4F4',
    borderBottom: '1px solid #F4F4F4',
    margin: '10px 0',
    padding: '12px 0',
  },
  totalCenter: {
    marginLeft: '-75px',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: '10px',
  },
  itemDebit: {
    flex: '1.5 0 0',
  },
  flextEnd: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '12px 0',
  },
  marginRight: {
    marginRight: '30px',
  },
});

export const BalanceSheetPdf: FC<IProps> = ({
  header,
  balanceSheetData,
  searchquery,
  totals,
}) => {
  const {
    totalCredits,
    totalDebits,
    closing_credits,
    closing_debits,
    opening_credits,
    opening_debits,
  } = totals;

  return (
    <PdfDocument>
      <PDFFontWrapper>
        <PDFHeader {...header} />
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderWidth}>Particulars</Text>
          {searchquery?.date ? (
            <>
              <Text style={styles.tableHeaderItem}>Opening</Text>
              <Text style={styles.tableHeaderItem}>Changed</Text>
              <Text style={styles.tableHeaderItem}>Closing</Text>
            </>
          ) : (
            <>
              <Text>Debit</Text>
              <Text>Credit</Text>
            </>
          )}
        </View>
        <View style={styles.tableBody}>
          {balanceSheetData.map((item, index) => {
            return (
              <View key={index}>
                <View style={styles.filterTable}>
                  <Text style={[styles.LabelName, styles.ItemName]}>
                    {item?.name}
                  </Text>
                  {searchquery?.date && index === 0 ? (
                    <>
                      <Text style={[styles.LabelName, styles.itemCenter]}>
                        Dr
                      </Text>
                      <Text style={[styles.LabelName, styles.itemCenter]}>
                        Cr
                      </Text>
                      <Text style={[styles.LabelName, styles.itemCenter]}>
                        Dr
                      </Text>
                      <Text style={[styles.LabelName, styles.itemCenter]}>
                        Cr
                      </Text>
                      <Text style={[styles.LabelName, styles.itemCenter]}>
                        Dr
                      </Text>
                      <Text style={[styles.LabelName, styles.itemCenter]}>
                        Cr
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text></Text>
                      <Text></Text>
                    </>
                  )}
                </View>
                {item.accounts.map((accountItem, index) => {
                  return (
                    <Fragment key={index}>
                      {searchquery?.date ? (
                        <View style={styles.filterTable}>
                          <Text style={styles.ItemName}>
                            {accountItem?.name}
                          </Text>
                          <Text style={styles.itemCenter}>
                            {accountItem?.opening_debits}
                          </Text>
                          <Text style={styles.itemCenter}>
                            {accountItem?.opening_credits}
                          </Text>
                          <Text style={styles.itemCenter}>
                            {accountItem?.total_debits}
                          </Text>
                          <Text style={styles.itemCenter}>
                            {accountItem?.total_credits}
                          </Text>
                          <Text style={styles.itemCenter}>
                            {accountItem?.closing_debits}
                          </Text>
                          <Text style={styles.itemCenter}>
                            {accountItem?.closing_credits}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.bodyFont}>
                          <View
                            style={
                              item.type === ITransactionType.DEBIT
                                ? styles.Debit
                                : styles.Credit
                            }
                          >
                            <Text>{accountItem?.name}</Text>
                          </View>
                          <Text>
                            {moneyFormat(accountItem?.balance.toFixed(2))}
                          </Text>
                        </View>
                      )}
                    </Fragment>
                  );
                })}

                {searchquery?.date ? (
                  <View style={[styles.totalContainer]}>
                    <Text>Total {item.name}</Text>
                    <Text>{moneyFormat(item?.balance.toFixed(2))}</Text>
                  </View>
                ) : (
                  <View style={[styles.totalFooter, styles.border]}>
                    <Text style={[styles.LabelName, styles.tableHeaderWidth]}>
                      Total {item.name}
                    </Text>
                    <Text style={[styles.LabelName, styles.totalCenter]}>
                      {item.type === 1
                        ? moneyFormat(item?.balance.toFixed(2))
                        : null}
                    </Text>
                    <Text style={[styles.LabelName]}>
                      {item.type === 2
                        ? moneyFormat(item?.balance.toFixed(2))
                        : null}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
          <View
            style={[
              styles.boldText,
              styles.filterTable,
              searchquery?.date && styles.marginRight,
            ]}
          >
            <Text
              style={[
                styles.ItemName,
                !searchquery?.date && styles.tableHeaderWidth,
                !searchquery?.date && styles.ItemNameFilter,
                searchquery?.date && styles.itemDebit,
              ]}
            >
              Total
            </Text>
            {searchquery?.date && (
              <Fragment>
                <Text style={styles.ItemName}>
                  {moneyFormat(opening_debits.toFixed(2))}
                </Text>
                <Text style={styles.ItemName}>
                  {moneyFormat(opening_credits.toFixed(2))}
                </Text>
                <Text style={styles.ItemName}>
                  {moneyFormat(closing_debits.toFixed(2))}
                </Text>
                <Text style={styles.ItemName}>
                  {moneyFormat(closing_credits.toFixed(2))}
                </Text>
              </Fragment>
            )}
            <Text
              style={[styles.ItemName, !searchquery?.date && styles.itemDebit]}
            >
              {moneyFormat(totalDebits.toFixed(2))}
            </Text>
            <Text style={[styles.flextEnd]}>
              {moneyFormat(totalCredits.toFixed(2))}
            </Text>
          </View>
        </View>
      </PDFFontWrapper>
    </PdfDocument>
  );
};

export default BalanceSheetPdf;
