import http from '../utils/http';

export const CsvImportAPi = (payload: any) =>
  http.post('exports/import', payload);
