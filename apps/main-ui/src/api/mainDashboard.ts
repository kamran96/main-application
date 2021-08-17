import { railsHttp } from "../utils/http";

export const DailyStalesDashboardAPI = (
  key: string,
  startDate?: string,
  endDate?: string
) => railsHttp(`/invoice-sale-detail?start=${startDate}&ends=${endDate}`);

export const SalesOverviewGraphAPI = (key?: string) =>
  railsHttp.get(`invoice-daily-sale`);

export const InvoicePIEchartAPI = (key?: string) =>
  railsHttp.get(`invoice-circle-chart`);
