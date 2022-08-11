export * from './lib/sorting.module';

export const Sorting = async (sort) => {
  let sort_column, sort_order;
  if (sort === null || sort === '' || sort === undefined || sort === 'null') {
    sort_column = 'id';
    sort_order = '';
  } else if (sort.startsWith('-')) {
    const [, column] = sort.trim().split('-');
    sort_column = column;
    sort_order = 'DESC';
  } else {
    sort_column = sort;
    sort_order = 'ASC';
  }

  return {
    sort_column,
    sort_order,
  };
};
