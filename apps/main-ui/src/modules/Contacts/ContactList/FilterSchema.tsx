import { FilterType } from '../../../modal';

export default {
  name: {
    type: FilterType.SEARCH,
    label: 'Contact Name',
    value: '',
    isFullSearch: true,
  },
  email: {
    type: FilterType.SEARCH,
    label: 'Email',
    value: '',
    isFullSearch: false,
  },
  businessName: {
    type: FilterType.SEARCH,
    label: 'Business Name',
    value: '',
    isFullSearch: false,
  },
  creditLimit: {
    type: FilterType.EQUALSTO,
    label: 'Credit Limit',
    value: '',
  },
  createdAt: {
    type: FilterType.DATE_BETWEEN,
    label: 'Created At',
    value: '',
  },
};
