import { ApiError, request, setTokens } from './client';
import type { LoginData, LoginRequest, RegisterRequest, UserData, SessionData, TOTPSetupData, RecoveryCodesData, ChangePasswordRequest, UpdateUserRequest } from './generated';
const post = <T>(path: string, body?: unknown, anonymous = false, authorization?: string) => request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body), ...(authorization ? {headers: {Authorization: `Bearer ${authorization}`}} : {}) }, false, anonymous);
export function acceptLogin(result: LoginData) {
 if (result.requires_2fa || !result.access_token || !result.refresh_token) throw new ApiError(502, 'Invalid authentication response');
 setTokens({access: result.access_token, refresh: result.refresh_token});
}
export const auth = {
 login: (body: LoginRequest) => post<LoginData>('/auth/login', body, true),
 register: (body: RegisterRequest) => post<UserData>('/auth/register', body, true),
 verifyChallenge: (challenge: string, code: string) => post<LoginData>('/auth/2fa/verify', {code}, true, challenge),
 updateProfile: (body: UpdateUserRequest) => request<UserData>('/users/me', {method: 'PATCH', body: JSON.stringify(body)}),
 me: (signal?: AbortSignal) => request<UserData>('/auth/me', {signal}),
 logout: async () => { await post('/auth/logout'); setTokens(); },
 forgot: (email: string) => post('/auth/password/forgot', {email}, true),
 reset: (token: string, new_password: string) => post('/auth/password/reset', {token, new_password}, true),
 verifyEmail: (token: string) => post('/auth/email/verify', {token}, true),
 resendEmail: (email: string) => post('/auth/email/resend', {email}, true),
 changePassword: (body: ChangePasswordRequest) => post('/auth/password/change', body),
 sessions: () => request<SessionData[]>('/auth/sessions'),
 revoke: (uuid: string) => request(`/auth/sessions/${encodeURIComponent(uuid)}`, {method: 'DELETE'}),
 revokeAll: async () => { await post('/auth/sessions/revoke-all'); setTokens(); },
 setup: (method: 'totp' | 'otp') => post<TOTPSetupData | {message: string}>(`/auth/2fa/${method}/setup`),
 resendOtp: () => post('/auth/2fa/otp/resend'),
 enable: (method: 'totp' | 'otp', code: string) => post<RecoveryCodesData>(`/auth/2fa/${method}/enable`, {code}),
 disable: (method: 'totp' | 'otp', password: string, code: string) => post(`/auth/2fa/${method}/disable`, {password, code}),
 recoveryCodes: (code: string) => post<RecoveryCodesData>('/auth/2fa/totp/recovery-codes', {code}),
};
