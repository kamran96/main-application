import { FilterType } from '../../../../modal';

export default {
  contactId: {
    type: FilterType.LIST_IDS,
    label: 'Customer',
    value: [],
  },
  reference: {
    type: FilterType.SEARCH,
    label: 'Referance',
    value: '',
  },
  dueDate: {
    type: FilterType.EQUALSTO,
    label: 'Expiry Date',
    value: '',
  },
  createdAt: {
    type: FilterType.DATE_BETWEEN,
    label: 'Created At',
    value: '',
  },
};
