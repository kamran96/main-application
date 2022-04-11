import { FilterType } from '../../../modal';

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
    label: 'Credit Note Date',
    value: '',
  },
  invoiceNumber: {
    type: FilterType.SEARCH,
    label: 'Credit Note Number',
    value: '',
    isFullSearch: false,
  },
};
