import { ITableColumns, PDFTable } from '../PDFs/PDFTable';
import { PDFHeader } from '../PDFs/pdf-header';
import {
  Document,
  Page,
  View,
  PDFDownloadLink,
  Text,
  PDFViewer,
  StyleSheet,
} from '@react-pdf/renderer';
import { PDFFontWrapper } from '../PDFs/PDFFontWrapper';
import { FC } from 'react';
import { PDFICON } from '../Icons';
import styled from 'styled-components';
import { PdfDocument } from '../PDFs/PdfDocument';

const styles = StyleSheet.create({
  page: {
    paddingBottom: 60,
  },

  tableWrapper: {
    padding: '0 20px ',
  },
  pageNumbers: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '10px',
  },
  textPoweredBy: {
    color: '#575757',
    fontSize: '10px',
  },
});

interface IPDFProps {
  columns: ITableColumns[];
  data: unknown[];
  Header: {
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
  generatedBy?: string;
}

const PDF: FC<IPDFProps> = ({ columns, data, Header, generatedBy }) => {
  return (
    <PdfDocument generatedUser={generatedBy}>
      <PDFFontWrapper>
        <PDFHeader {...Header} />
        <View style={styles.tableWrapper}>
          <PDFTable columns={columns} data={data} />
        </View>
      </PDFFontWrapper>
    </PdfDocument>
  );
};

export const ExportPDF: FC<IPDFProps> = (props) => {
  return (
    <PDFDownloadLinkWrapper document={<PDF {...props} />}>
      <div className="flex alignCenter">
        <PDFICON className="flex alignCenter mr-5" />

        <span> Download PDF</span>
      </div>
    </PDFDownloadLinkWrapper>
  );
};

export default ExportPDF;

export const PreviewPDF: FC<IPDFProps> = (props) => {
  return (
    <PDFViewer height={'1080px'} width={'100%'}>
      <PDF {...props} />
    </PDFViewer>
  );
};

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
