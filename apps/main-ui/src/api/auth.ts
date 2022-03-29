import http from '../utils/http';
import { QueryKey } from '../modal';

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

export const CheckAuthAPI = (key?: any) => http.get(`users/auth/check`);
export const CheckAuthAPIDev = ({ queryKey }: QueryKey) => {
  const id = queryKey[1];
  return http?.get(`users/user/${id}`);
};

export const LogoutAPI = (key?: any) => http.post(`users/auth/logout`);

export const ChangeAccountPreferencesAPI = (payload?: { type: string }) =>
  http?.post(`users/auth/request-change`, payload);

export const ChangeRequestOtpVerification = (payload?: { otp: number }) =>
  http?.post(`users/auth/request-change-verify`, payload);

export const updateAccountSetting = (payload?: {
  email?: string;
  password?: string;
}) => http?.post(`users/user/account-settings`, payload);

export const generateAuthenticator = () =>
  http?.post(`users/auth/gen-authenticator`);

export const verifyAuthenticatorCode = (payload?: { code: number }) =>
  http?.post(`users/auth/authenticator`, payload);

export const googleLoginAPI = (payload?: { token?: string }) =>
  http?.post(`users/auth/google-login`, payload);
