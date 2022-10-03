import { QueryKey } from '@invyce/shared/types';
import http from '../utils/http';

export const getTribalanceReport = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `account/trail-balance`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http?.get(URL);
};

export const getBalaceSheetReport = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `account/balance-sheet`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http?.get(URL);
};
