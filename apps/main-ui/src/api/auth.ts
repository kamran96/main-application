import http from '../utils/http';

export const LoginAPI = (payload) => http.post(`users/auth`, payload);

export const RegisterAPI = (payload) =>
  http.post(`users/auth/register`, payload);

interface IActiveBranchPayload {
  organizationId: number;
  branchId: number;
}
export const activeBranchAPI = (payload?: any, userId?: number) =>
  http.put(`users/organization/${payload.UserId}`, payload);

export const updateThemeAPI = (payload?: any) =>
  http.post(`users/user/update-theme`, payload);

export const requestResetPasswordAPI = (payload: any) =>
  http?.post('users/auth/forget-password', payload);

export const resetPasswordAPI = (payload: any) =>
  http?.post(`users/auth/change-password`, payload);

export const verifyAccountAPI = (payload: any) =>
  http?.post(`users/auth/verify-otp`, payload);

export const resendVerificationCodeAPI = (payload: any) =>
  http?.post(`users/auth/resend-otp`, payload);

export const CheckAuthAPI = (key?: string) => http.get(`users/auth/check`);
export const CheckAuthAPIDev = (key?: string, id?: number) =>
  http?.get(`users/user/${id}`);

export const LogoutAPI = (key?: string) => http.post(`users/auth/logout`);
