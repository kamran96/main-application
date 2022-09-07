import { FilterType } from '@invyce/shared/types';

export default {
  // accountId: {
  //   type: FilterType.LIST_IDS,
  //   label: "Account",
  //   value: [],
  // },
  ref: {
    type: FilterType.SEARCH,
    label: 'Reference',
    value: '',
    isFullSearch: true,
  },
  narration: {
    type: FilterType.SEARCH,
    label: 'Narration',
    value: '',
    isFullSearch: true,
  },
  date: {
    type: FilterType.DATE_BETWEEN,
    label: 'Created At',
    value: '',
    isFullSearch: false,
  },
};
