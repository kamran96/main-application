import { FilterType } from '@invyce/shared/types';

export default {
  date: {
    type: FilterType.DATE_BETWEEN,
    label: 'Filter By Date',
    value: '',
  },
  dateIn: {
    type: FilterType.DATE_IN,
    label: 'Filter Adjusted Incomestatement',
    value: '',
  },
};
