import http from '../utils/http';

export const DailyStalesDashboardAPI = (
  key: string,
  startDate?: string,
  endDate?: string
) => http(`/invoice-sale-detail?start=${startDate}&ends=${endDate}`);

export const SalesOverviewGraphAPI = (key?: string) =>
  http.get(`invoice-daily-sale`);

export const InvoicePIEchartAPI = (key?: string) =>
  http.get(`invoice-circle-chart`);
