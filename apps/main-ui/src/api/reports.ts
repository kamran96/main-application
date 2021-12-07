import http from '../utils/http';

export const TrialbalanceAPI = (key?: string, query?: string) => {
  let URL = `accounts/reports/trial-balance`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http.get(URL);
};
export const BalanceSheetAPI = (key?: string, query?: string) => {
  let URL = `accounts/reports/balance-sheet`;
  if (query) {
    URL = `${URL}?query=${query}`;
  }
  return http.get(URL);
};

export const IncomeStatementAPI = (key?: string, query?: string) => {
  let URL = `accounts/reports/income-statement`;

  if (query) {
    URL = `${URL}?query=${query}`;
  }

  return http.get(URL);
};

export const CashActivityStatementAPI = (key?: string, query?: string) => {
  let URL = `reports/cash-flow-report`;

  if (query) {
    URL = `${URL}?query=${query}`;
  }

  return http.get(URL);
};
