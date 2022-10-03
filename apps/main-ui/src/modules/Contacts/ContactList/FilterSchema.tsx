import { FilterType } from '@invyce/shared/types';

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
};
