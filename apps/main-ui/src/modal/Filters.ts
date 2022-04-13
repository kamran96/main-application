export enum FilterType {
  SEARCH = 'search',
  DATE_BETWEEN = 'date-between',
  DATE_IN = 'date-in',
  COMPARE = 'compare',
  LIST_IDS = 'in',
  EQUALSTO = 'equals',
  JOIN = 'join',
}

export interface IFilterItem {
  value: string | number;
  type: string;
}
