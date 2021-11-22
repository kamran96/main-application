import http from '../utils/http';

export const CsvImportAPi = (payload: any) => http.post('csv/import', payload);
