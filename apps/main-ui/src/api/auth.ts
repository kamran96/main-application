import http, { railsHttp } from "../utils/http";

export const LoginAPI = (payload) => http.post(`users/auth`, payload);

export const RegisterAPI = (payload) => http.post(`auth/register`, payload);

interface IActiveBranchPayload {
  organizationId: number;
  branchId: number;
}
export const activeBranchAPI = (payload?: any, userId?: number) =>
  railsHttp.put(`/users/organization/${payload.UserId}`, payload);

export const updateThemeAPI = (payload?: any) =>
  railsHttp.put(`users/theme_update`, payload);

export const requestResetPasswordAPI = (payload: any)=>http?.post('auth/forget-password', payload);

export const resetPasswordAPI = (payload:any)=> http?.post(`auth/change-password`, payload);

export const verifyAccountAPI = (payload: any)=>http?.post(`auth/verify-otp`, payload);

export const resendVerificationCodeAPI = (payload: any)=> http?.post(`auth/resend-otp`, payload);

export const CheckAuthAPI = (key?:string)=> http.get(`users/auth/check`);

export const LogoutAPI = (key?:string)=> http.post(`users/auth/logout`);