import { FilterType } from '../../../../../modal';

export default {
  contactId: {
    type: FilterType.LIST_IDS,
    label: 'Customer',
    value: [],
  },
  invoiceNumber: {
    type: FilterType.SEARCH,
    label: 'Invoice Number',
    value: '',
    isFullSearch: false,
  },
  reference: {
    type: FilterType.SEARCH,
    label: 'Reference',
    value: '',
    isFullSearch: true,
  },
  issueDate: {
    type: FilterType.DATE_BETWEEN,
    label: 'Invoice Date',
    value: '',
  },
  isReturn: {
    type: FilterType.COMPARE,
    label: 'Invoice Type',
    isBoolean: true,
    value: [
      { value: 'true', name: 'Returned' },
      { value: 'false', name: 'Not Returned' },
    ],
  },
  // isReturn: {
  //   type: FilterType.COMPARE,
  //   label: "Type",
  //   value: [{ value: true, name: "Is Return" }],
  // },
};
