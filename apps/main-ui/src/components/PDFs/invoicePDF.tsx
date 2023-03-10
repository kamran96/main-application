/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { IInvoiceResult, IInvoiceItem } from '@invyce/shared/types';
import {
  Document,
  StyleSheet,
  View,
  Text,
  Page,
  Font,
} from '@react-pdf/renderer';
import { FC } from 'react';
import dayjs from 'dayjs';
import moneyFormat from '../../utils/moneyFormat';
import { totalDiscountInInvoice } from '../../utils/formulas';
import thin from '../../assets/fonts/RobotoSlab-ExtraLight.ttf';
import black from '../../assets/fonts/RobotoSlab-Black.ttf';
import bold from '../../assets/fonts/RobotoSlab-Bold.ttf';
import extraBold from '../../assets/fonts/RobotoSlab-ExtraBold.ttf';
import extraLight from '../../assets/fonts/RobotoSlab-ExtraLight.ttf';
import light from '../../assets/fonts/RobotoSlab-Light.ttf';
import medium from '../../assets/fonts/RobotoSlab-Medium.ttf';
import regular from '../../assets/fonts/RobotoSlab-Regular.ttf';
import semiBold from '../../assets/fonts/RobotoSlab-SemiBold.ttf';
import PdfTable from './PDFTable';
import { PdfDocument } from './PdfDocument';
import { PDFHeader } from './pdf-header';
import { PDFFontWrapper } from './PDFFontWrapper';
import { useRef } from 'react';

Font.register({
  family: 'Roboto Slab',
  fonts: [
    { src: thin },
    { src: black },
    { src: bold },
    { src: extraBold },
    { src: extraLight },
    { src: light },
    { src: medium },
    { src: regular, fontWeight: 400 },
    { src: semiBold },
  ],
});

const styles = StyleSheet.create({
  dispatchedInfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '23px 30px',
    fontFamily: 'Roboto Slab',
  },
  dispatchLabel: {
    color: '#6F6F84',
    fontSize: 10,
    lineHeight: '1.5px',
    fontWeight: 'medium',
  },
  dispatchData: {
    color: '#222234',
    fontSize: 11,
    lineHeight: '2px',
    fontWeight: 'bold',
  },
  calculationAndNotesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: '23px 30px',
  },
  notesSection: {
    flex: 7,
    paddingRight: '10px',
  },
  note: {
    fontSize: '10px',
    lineHeight: '1.5px',
    color: '#222234',
  },
  calculation: {
    flex: 5,
    paddingLeft: '30px',
    marginTop: '20px',
  },
  calculationItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    fontFamily: 'Roboto Slab',
  },
  calculationLabel: {
    fontSize: '11px',
    color: '#6F6F84',
    lineHeight: '1.6px',
    fontWeight: 'demibold',
  },
  calculationData: {
    fontSize: '13px',
    color: '#222234',
    fontWeight: 'bold',
  },
});

interface IProps {
  data: IInvoiceResult;
  type: 'SI' | 'PO' | 'credit-note';
  header: {
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
  };
  reportGeneratedUser: string;
  ref?: any;
}

export const InvoicePDF: FC<IProps> = ({
  data,
  type,
  header,
  reportGeneratedUser,
  ref,
}) => {
  const columns = [
    {
      title: 'DESCRIPTION',
      dataIndex: 'item',
      key: 'item',
      render: (data: any, row: IInvoiceItem, index: number) => {
        return <> {data ? data?.name : '-'}</>;
      },
    },
    {
      title: 'QTY',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'RATE',
      dataIndex: type === 'PO' ? `purchasePrice` : `unitPrice`,
      key: type === 'PO' ? `purchasePrice` : `unitPrice`,
    },
    {
      title: 'DISCOUNT',
      dataIndex: 'itemDiscount',
      key: 'itemDiscount',
    },
    {
      title: 'TAX',
      dataIndex: 'tax',
      key: 'tax',
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      key: 'total',
      render: (data, row, index) => moneyFormat(data),
    },
  ];

  const accessor =
    type === 'SI'
      ? 'invoiceItems'
      : type === 'credit-note'
      ? 'creditNoteItems'
      : 'purchaseItems';

  const calculatedDisc: number = data.discount || 0;
  /* ********* THIS IS RESPONSIBLE TO GET ITEMS DISCOUNT TOTAL ************ */
  const itemsDiscount =
    (data &&
      totalDiscountInInvoice(
        data[accessor],
        'itemDiscount',
        type === 'PO' ? 'POE' : 'SI'
      )) ||
    0;

  const invoiceDiscount = calculatedDisc - itemsDiscount;

  /* ************* THIS WILL CALCULATE TOTAL TAX ************* */
  const TotalTax =
    (data &&
      totalDiscountInInvoice(
        data[accessor],
        'tax',
        type === 'PO' ? 'POE' : 'SI'
      )) ||
    0;

  return (
    <PdfDocument ref={ref} generatedUser={reportGeneratedUser}>
      <PDFFontWrapper>
        <PDFHeader {...header} />
        <View style={styles.dispatchedInfoWrapper}>
          <View>
            <View>
              <Text style={styles.dispatchLabel}>Billed to,</Text>
              <Text style={styles.dispatchData}>
                {data?.contact?.name || ''}
              </Text>
            </View>
            {data?.contact?.addresses?.length > 0 ? (
              <View>
                <Text style={styles.dispatchLabel}>Address</Text>
                <Text style={styles.dispatchData}>
                  {data?.contact?.addresses[0]?.country},{' '}
                  {data?.contact?.addresses[0]?.city},{' '}
                  {data?.contact?.addresses[0]?.postalCode}
                </Text>
              </View>
            ) : null}
          </View>
          <View>
            <View>
              <Text style={styles.dispatchLabel}>Invoice number</Text>
              <Text style={styles.dispatchData}>{data?.invoiceNumber}</Text>
            </View>
            <View>
              <Text style={styles.dispatchLabel}>Reference</Text>
              <Text style={styles.dispatchData}>{data?.reference}</Text>
            </View>
          </View>
          <View>
            <View>
              <Text style={styles.dispatchLabel}>Invoice Date</Text>
              <Text style={styles.dispatchData}>
                {dayjs(data?.issueDate).format('MM/DD/YYYY')}
              </Text>
            </View>
            <View>
              <Text style={styles.dispatchLabel}>Due Date</Text>
              <Text style={styles.dispatchData}>
                {' '}
                {dayjs(data?.dueDate).format('MM/DD/YYYY')}
              </Text>
            </View>
          </View>
        </View>
        <PdfTable columns={columns} data={data[accessor]} />
        <View style={styles.calculationAndNotesWrapper}>
          <View style={styles.notesSection}>
            {data?.comment ? (
              <>
                <Text style={styles.dispatchLabel}>Notes</Text>
                <Text style={styles.note}>
                  {data.comment ? data?.comment : ''}
                </Text>
              </>
            ) : null}
          </View>
          <View style={styles.calculation}>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Sub Total</Text>
              <Text style={styles.calculationData}>
                {moneyFormat(data?.grossTotal || 0)}
              </Text>
            </View>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Items Discount</Text>
              <Text style={styles.calculationData}>
                {moneyFormat(itemsDiscount || 0)}
              </Text>
            </View>
            <View style={styles.calculationItem}>
              <Text style={styles.calculationLabel}>Invoice Discount</Text>
              <Text style={styles.calculationData}>
                {moneyFormat(invoiceDiscount || 0)}
              </Text>
            </View>
            <View
              style={{
                ...styles.calculationItem,
                borderTop: '1px solid #333',
                paddingTop: '5px',
              }}
            >
              <Text style={styles.calculationLabel}>Total</Text>
              <Text style={styles.calculationData}>
                {moneyFormat(data?.netTotal || 0)}
              </Text>
            </View>
          </View>
        </View>
      </PDFFontWrapper>
    </PdfDocument>
  );
};
