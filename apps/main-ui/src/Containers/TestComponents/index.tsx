import { FC, useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import { CsvImportAPi } from '../../api';
// import { Inconvinience } from '../../components/ErrorBoundries/Inconvinience';
import { InvoiceImportManager } from '../../modules/Invoice/InvoiceImportManager';
import {
  Document,
  PDFViewer,
  PDFDownloadLink,
  renderToString,
} from '@react-pdf/renderer';
import { InvoicePDF } from '../../components/PDFs';
import { EditableTable } from '@invyce/editable-table';
import { Editable } from '../../components/Editable';

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

  const [data, setData] = useState([
    {
      id: '1',
      description: 'sdfjafdiosaf',
    },
  ]);

  const cols: any = [
    {
      title: 'item id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (_data, row, index) => {
        console.log(data, row, index);
        return (
          <Editable
            onChange={(e) => {
              console.log(e, 'event');
            }}
          />
        );
      },
    },
  ];

  return (
    <InvoiceImportManager
      headers={`Item Name,Code,Purchase Price,Sale Price,Item Type,Stock,Status`.split(
        ','
      )}
      onLoad={(payload) => {
        console.log(payload);
      }}
    />
  );
};
