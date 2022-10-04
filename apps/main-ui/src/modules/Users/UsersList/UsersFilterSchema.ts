import { FilterType } from '@invyce/shared/types';

export default {
  username: {
    type: FilterType.SEARCH,
    label: 'User Name',
    value: '',
    isFullSearch: true,
  },
  email: {
    type: FilterType.JOIN,
    label: 'Email',
    value: '',
    isFullSearch: false,
  },
  phoneNumber: {
    type: FilterType.JOIN,
    label: 'Phone Number',
    value: '',
    isFullSearch: false,
  },
  role: {
    type: FilterType.COMPARE,
    label: 'User Role',
    value: [{ value: 54, name: 'Admin' }],
  },
};
