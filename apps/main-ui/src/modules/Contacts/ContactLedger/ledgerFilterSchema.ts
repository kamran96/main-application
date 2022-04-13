import { FilterType } from '../../../modal';

export default {
  date: {
    type: FilterType.DATE_BETWEEN,
    label: 'Filter By Date',
    value: '',
  },
  // comment: {
  //   type: FilterType.SEARCH,
  //   label: "Comment",
  //   value: "",
  //   isFullSearch: true,
  // },
  // paymentMode: {
  //   type: FilterType.COMPARE,
  //   label: "Payment Mode",
  //   value: [
  //     { value: PaymentType.BANK, name: "Bank" },
  //     { value: PaymentType.CASH, name: "Cash" },
  //   ],
  // },
  // paymentType: {
  //   type: FilterType.COMPARE,
  //   label: "Payment Type",
  //   value: [
  //     { value: PaymentMode.CASH, name: "On Cash" },
  //     { value: PaymentMode.CREDIT, name: "On Credit" },
  //     { value: PaymentMode.PARTIAL, name: "Partial Payment" },
  //   ],
  // },
};
