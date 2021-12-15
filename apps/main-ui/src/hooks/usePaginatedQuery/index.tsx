import { useQuery, useQueryClient } from 'react-query';
import types from 'react-query/types';

export function usePaginatedQuery<T>(
  query: types.QueryKey,
  func: any,
  options?: types.QueryOptions<T>
): any {
  return useQuery(query, func, { ...options, refetchOnWindowFocus: false });
}

export function QueryCache() {
  const queryCache = useQueryClient();
  return queryCache;
}
