import React, { FC, Fragment } from 'react';
import {
  Document,
  StyleSheet,
  View,
  Text,
  Page,
  Font,
} from '@react-pdf/renderer';
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
  balanceSheetData: {
    name: string;
    accounts: IAccountsResult[];
    type: ITransactionType;
    balance: number;
  }[];
  searchquery: any;
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: 60,
  },
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
  queryHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  tableBody: {
    padding: '10px 30px',
    margin: '0 12px',
    width: '100%',
  },
  LabelName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  bodyFont: {
    fontWeight: 'normal',
    padding: '12px 2px',
    fontSize: 12,
    color: '#272727',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Debit: {
    width: '55%',
  },
  Credit: {
    width: '90%',
  },
  totalContainer: {
    fontWeight: 600,
    fontSize: 14,
    borderTop: '1px solid #F4F4F4',
    borderBottom: '1px solid #F4F4F4',
    margin: '10px 0',
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
  },
  filterTable: {
    display:'flex',
    flexDirection: 'row',
    fontFamily: 'Roboto Slab',
    fontSize: '12'
  },
  itemCenter: {
    width: '13%',
    padding: '12px 0'
  },
  ItemName: {
    width: '22%',
    padding: '12px 0'
  },
  tableHeaderWidth: {
    width: '35%'
  },
  tableHeaderItem: {
    width: '33%'
  }
});

export const BalanceSheetPdf: FC<IProps> = ({
  header,
  balanceSheetData,
  searchquery,
}) => {
  console.log('balance Sheet data', balanceSheetData);
  // console.log('search query', searchquery);
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
              <View>
                <View style={styles.filterTable}>
                <Text style={[styles.LabelName, styles.ItemName]}>{item?.name}</Text>
                        {searchquery?.date && index == 0 ? (
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
                {item.accounts.map((accountItem) => {
                  return (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <Fragment>
                    {
                      searchquery?.date ? (
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

                      )
                      : (
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
                      )
                    }
                    </Fragment>
                  );
                })}
                <View style={styles.totalContainer}>
                  <Text>Total {item.name}</Text>
                  <Text>{moneyFormat(item?.balance.toFixed(2))}</Text>
                </View>
              </View>
            );
          })}
          <View style={styles.totalFooter}>
            <Text style={styles.LabelName}>Total</Text>
            <Text style={styles.LabelName}>$ 0</Text>
            <Text style={styles.LabelName}>$ 0</Text>
          </View>
        </View>
      </PDFFontWrapper>
    </PdfDocument>
  );
};
