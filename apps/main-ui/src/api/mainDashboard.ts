import http from '../utils/http';

export const DailyStalesDashboardAPI = (
  key: any,
  startDate?: string,
  endDate?: string
) => http(`/invoice-sale-detail?start=${startDate}&ends=${endDate}`);

export const SalesOverviewGraphAPI = (key?: any) =>
  http.get(`invoice-daily-sale`);

export const InvoicePIEchartAPI = (key?: any) =>
  http.get(`invoice-circle-chart`);
