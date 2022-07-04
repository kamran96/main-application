import dayjs from 'dayjs';
import { PaymentMode } from '../../modal';

export default {
  itemId: null,
  description: '',
  quantity: 1,
  unitPrice: 0,
  purchasePrice: 0,
  itemDiscount: '0',
  tax: '0',
  total: 0,
  costOfGoodAmount: 0,
  index: 0,
  accountId: null,
};

export const defaultPayment = {
  paymentMode: PaymentMode.CREDIT,
  totalAmount: 0,
  totalDiscount: 0,
  dueDate: dayjs(),
};

export const defaultFormData = {
  issueDate: dayjs(),
  currency: 'PKR',
  invoiceDiscount: 0,
};

export const Requires = {
  itemId: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  description: {
    require: false,
    message: '',
  },
  quantity: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  unitPrice: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  purchasePrice: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  itemDiscount: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  tax: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  total: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  costOfGoodAmount: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
  index: {
    require: false,
    message: 'Item is Requred to Proceed invoice',
  },
  accountId: {
    require: true,
    message: 'Item is Requred to Proceed invoice',
  },
};
