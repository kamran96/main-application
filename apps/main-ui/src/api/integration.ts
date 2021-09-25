import http from "../utils/http";

export const XeroIntegrationAPI = () => http.post(`integrate/xero`);

export const XeroVerification = (payload) =>
  http.post(`integrate/callback`, payload);

export const XeroCopyModulesAPI = (payload) =>
  http?.post(`integrate/fetch-from-xero`, payload);

export const QuickbooksIntegrationAPI = () => http?.post(`quickbooks`);

export const QuickbooksVerifycationAPI = (payload: any) =>
  http?.post(`quickbooks/verify`, payload);

export const GmailIntegrationAPI = ()=> http?.post(`/integrate-email/gmail`);

export const GmailVerificationAPI = (payload:any)=> http?.post(`/integrate-email/verify-gmail`, payload);