import { FilterType } from '@invyce/shared/types';

export default {
  contactId: {
    type: FilterType.LIST_IDS,
    label: 'Customer',
    value: [],
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
  invoiceNumber: {
    type: FilterType.SEARCH,
    label: 'Invoice Number',
    value: '',
    isFullSearch: false,
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
};
