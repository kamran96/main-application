import { FilterType } from '../../../modal';

export default {
  contactId: {
    type: FilterType.LIST_IDS,
    label: 'Supplier',
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
    label: 'Debit Note Date',
    value: '',
  },
  invoiceNumber: {
    type: FilterType.SEARCH,
    label: 'Debit Note Number',
    value: '',
    isFullSearch: false,
  },
};
