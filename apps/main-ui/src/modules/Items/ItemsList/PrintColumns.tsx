import { ColumnsType } from 'antd/es/table';
import moneyFormat from '../../../utils/moneyFormat';
import { ITEM_TYPE } from '@invyce/shared/types';

export const PrintColumns: ColumnsType<any> = [
  {
    title: '#',
    dataIndex: '',
    render: (item, row, index) => {
      return index + 1;
    },
  },
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Category',
    dataIndex: 'categoryName',
    key: 'categoryName',
  },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Purchase Price ',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
  },
  {
    title: 'Sale Price ',
    dataIndex: 'salePrice',
    key: 'salePrice',
  },
  {
    title: 'Item Type ',
    dataIndex: 'itemType',
    key: 'itemType',
    sorter: false,
    showSorterTooltip: false,
    render: (data) => {
      return data === ITEM_TYPE.PRODUCT
        ? 'Product'
        : data === ITEM_TYPE.SERVICE
        ? 'Service'
        : '';
    },
  },
  {
    title: 'Stock',
    dataIndex: 'showStock',
    align: 'center',
  },
];
export const PDFColumns: ColumnsType<any> = [
  {
    title: '#',
    dataIndex: '',
    width: 10,
    render: (item, row, index) => {
      return index + 1;
    },
  },
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
    width: 700,
  },
  // {
  //   title: 'Category',
  //   dataIndex: 'categoryName',
  //   key: 'categoryName',
  // },
  {
    title: 'Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Purchase Price ',
    dataIndex: 'purchasePrice',
    key: 'purchasePrice',
    render: (data, row, index) => moneyFormat(data ? data : 0),
  },
  {
    title: 'Sale Price ',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: (data, row, index) => moneyFormat(data ? data : 0),
  },
  {
    title: 'Item Type ',
    dataIndex: 'itemType',
    key: 'itemType',
    sorter: false,
    showSorterTooltip: false,
    render: (data) => {
      return data === ITEM_TYPE.PRODUCT
        ? 'Product'
        : data === ITEM_TYPE.SERVICE
        ? 'Service'
        : '';
    },
  },
  {
    title: 'Stock',
    dataIndex: 'showStock',
    align: 'center',
  },
];
