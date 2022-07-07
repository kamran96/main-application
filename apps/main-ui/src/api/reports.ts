import { QueryKey } from '../modal';
import http from '../utils/http';



export const TrialbalanceAPI = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `accounts/reports/trial-balance`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http.get(URL);
};
export const BalanceSheetAPI = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `accounts/reports/balance-sheet`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http.get(URL);
};

export const IncomeStatementAPI = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `accounts/reports/income-statement`;

  if (query) {
    URL = `${URL}?query=${query}`;
  }

  return http.get(URL);
};

export const CashActivityStatementAPI = ({ queryKey }: QueryKey) => {
  const query = queryKey[1];
  let URL = `reports/cash-flow-report`;

  if (query) {
    URL = `${URL}?query=${query}`;
  }

  return http.get(URL);
};

export const TrialbalanceKeysAPI = () => http.get(`accounts/reports/import-csv`)