import { QueryKey } from '../modal';
import http from '../utils/http';

export const AccountTrailBalanceReportsApi = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `account/trail-balance`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http?.get(URL);
};
