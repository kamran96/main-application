import { IContactTypes } from '@invyce/shared/types';
import moneyFormat from '../../../utils/moneyFormat';

export const pdfCols: any = [
  {
    title: '#',
    render: (data, row, index) => index + 1,
    width: 20,
  },
  {
    title: 'Contact',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    showSorterTooltip: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
    showSorterTooltip: true,
    width: 900,
  },
  {
    title: 'Company Name',
    dataIndex: 'businessName',
    key: 'businessName',
    sorter: true,
    showSorterTooltip: true,
  },
  {
    title: 'Credit Limit',
    dataIndex: 'creditLimit',
    key: 'creditLimit',
  },
  {
    title: 'Credit Block Limit',
    dataIndex: 'creditLimitBlock',
    key: 'creditLimitBlock',
  },
  {
    title: 'Balance',
    dataIndex: 'balance',
    key: 'balance',
    render: (data) => (data ? moneyFormat(data) : moneyFormat(0)),
  },
];
