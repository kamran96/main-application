import { FC, useEffect } from 'react';
import { useMutation } from 'react-query';

import { CsvImportAPi } from '../../api';
// import { Inconvinience } from '../../components/ErrorBoundries/Inconvinience';
// import { InvoiceImportManager } from '../../modules/Invoice/InvoiceImportManager';
import {
  Document,
  PDFViewer,
  Page,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { PdfTable } from '@invyce/pdf-table';

const columns = [
  {
    title: 'item',
    dataIndex: 'item',
  },
  {
    title: 'item code',
    dataIndex: 'code',
  },
  {
    title: 'quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'unit price',
    dataIndex: 'unitPrice',
  },
  {
    title: 'Total',
    dataIndex: 'total',
  },
];

const data = [
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
  {
    item: 'Gloss Enamel',
    code: '3289',
    unitPrice: '734984',
    quantity: '7',
    total: '379834',
  },
];

export const TestComponents: FC = () => {
  const { mutate: mutateCsv } = useMutation(CsvImportAPi);

  const handleLoad = async (payload) => {
    console.log(payload, 'payload');
    await mutateCsv(payload, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  return (
    // <div>test</div>
    <div>
      <PDFDownloadLink document={<Doc />} fileName="generated.pdf">
        Generate PDF
      </PDFDownloadLink>
      <PDFViewer width={'100%'} height={900}>
        <Document>
          <Page size={'A4'}>
            <PdfTable columns={columns} data={data} />
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

const Doc = () => {
  return (
    <Document>
      <Page size={'A4'}>
        <PdfTable columns={columns} data={data} />
      </Page>
    </Document>
  );
};
