import React, { FC, Fragment } from 'react';
import { ITransactionResult } from '../../modal/transaction';
import { StyleSheet, View, Text, Font } from '@react-pdf/renderer';
import moneyFormat from '../../utils/moneyFormat';
import { PdfDocument } from './PdfDocument';
import { PDFFontWrapper } from './PDFFontWrapper';
import { PDFHeader } from './pdf-header';
import dayjs from 'dayjs';

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
  resultData: ITransactionResult[];
}

const styles = StyleSheet.create({
  container: {},
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '10px',
    marginHorizontal: '15px',
    border: '1px solid #F4F4F4',
    fontWeight: 'bold',
    lineHeight: '1.5',
    backgroundColor: '#F4F4F4',
    fontFamily: 'Roboto Slab',
    color: '#272727',
  },
  tableItemOthers: {
    flex: '1 0 100px',
    borderRight: '1px solid #F4F4F4',
    padding: '8px 5px',
  },
  tableItemParticular: {
    flex: '2 0 200px',
    borderRight: '1px solid #F4F4F4',
    padding: '8px 5px',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'row',
    color: '#272727',
    fontSize: '9px',
    marginHorizontal: '15px',
    borderLeft: '1px solid #F4F4F4',
    borderRight: '1px solid #F4F4F4',
    borderBottom: '1.5px solid #F4F4F4',
    fontWeight: 'normal',
    lineHeight: '1.5',
    fontFamily: 'Roboto Slab',
  },
  tableCredit: {
    flex: '1 0 100px',
    borderRight: '1px solid #F4F4F4',
    padding: '9px 5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  narration: {
    fontSize: '8px',
    fontWeight: 'extralight',
  },
  itemCredit: {
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '40px',
  },
});

export const TransactionApprovePdf: FC<IProps> = ({ header, resultData }) => {
  return (
    <PdfDocument>
      <PDFFontWrapper>
        <PDFHeader {...header} />
        <View style={styles.container}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableItemOthers}>Date</Text>
            <Text style={styles.tableItemParticular}>Particulars</Text>
            <Text style={styles.tableItemOthers}>L.F</Text>
            <Text style={styles.tableItemOthers}>Debit</Text>
            <Text style={styles.tableItemOthers}>Credit</Text>
          </View>

          {resultData.map((item, index) => {
            const debit = item.transactionItems.filter(
              (item) => item.transactionType === 10
            );
            const credit = item.transactionItems.filter(
              (item) => item.transactionType === 20
            );

            return (
              <View style={styles.tableBody}>
                <Text style={styles.tableItemOthers}>
                  {dayjs(item.date).format(`MMMM D, YYYY`)}
                </Text>

                <View style={styles.tableItemParticular}>
                  {debit.map((debitItem: any) => {
                    return (
                      <Text style={{ padding: '10px 0' }}>
                        {debitItem?.account?.name}
                      </Text>
                    );
                  })}
                  {credit.map((creditItem: any) => {
                    return (
                      <Text style={styles.itemCredit}>
                        <Text style={{fontWeight: 'bold'}}> To </Text>{' '}
                        {creditItem?.account?.name}
                      </Text>
                    );
                  })}
                  <Text style={styles.narration}>({item.narration})</Text>
                </View>

                <Text style={styles.tableItemOthers}>{item.ref}</Text>

                <View style={styles.tableItemOthers}>
                  {debit.map((debitItem) => {
                    return (
                      <Text style={{ padding: '10px 0' }}>
                        {moneyFormat(debitItem?.amount.toFixed(2))}
                      </Text>
                    );
                  })}
                </View>

                <View style={styles.tableCredit}>
                  {credit.map((creditItem) => {
                    return (
                      <Text style={{ padding: '10px 0' }}>
                        {moneyFormat(creditItem?.amount.toFixed(2))}
                      </Text>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </PDFFontWrapper>
    </PdfDocument>
  );
};
