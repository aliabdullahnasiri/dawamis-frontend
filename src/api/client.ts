export type Decimal = string;
export type UUID = string;
export interface Envelope<T> { success: boolean; message?: string; data: T }
export class ApiError extends Error {
 status: number; fields: Record<string,string>;
 constructor(status: number, message: string, fields: Record<string,string> = {}) { super(message); this.status = status; this.fields = fields; }
}
type Tokens = { access: string; refresh: string };
const sessionKey = 'ems.auth.session';
function readSession(): Tokens | undefined {
 try {
  const saved = sessionStorage.getItem(sessionKey);
  if (!saved) return;
  const value: unknown = JSON.parse(saved);
  if (value && typeof value === 'object' && 'access' in value && 'refresh' in value &&
      typeof value.access === 'string' && value.access && typeof value.refresh === 'string' && value.refresh) {
   return { access: value.access, refresh: value.refresh };
  }
 } catch { /* Storage can be unavailable or contain malformed data. */ }
 try { sessionStorage.removeItem(sessionKey); } catch { /* Keep memory-only login available. */ }
}
function saveSession(value?: Tokens) {
 try {
  if (value) sessionStorage.setItem(sessionKey, JSON.stringify(value));
  else sessionStorage.removeItem(sessionKey);
 } catch { /* Restricted storage falls back to the current in-memory session. */ }
}
// A restored token is only a credential candidate; SessionProvider verifies /auth/me.
let tokens: Tokens | undefined = readSession();
let generation = 0;
let refreshing: Promise<void> | undefined;
const listeners = new Set<() => void>();
export const subscribeSession = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const hasSession = () => !!tokens;
export const sessionVersion = () => generation;
export function setTokens(value?: Tokens) { tokens = value; saveSession(value); generation++; refreshing = undefined; listeners.forEach(fn => fn()); }
const base = (import.meta.env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
export async function request<T>(path: string, options: RequestInit = {}, binary = false, anonymous = false): Promise<T> {
 const epoch = generation;
 const originalAccess = tokens?.access;
 const headers = new Headers(options.headers);
 if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
 const send = () => { const current = new Headers(headers); if (tokens && !anonymous) current.set('Authorization',`Bearer ${tokens.access}`); return fetch(`${base}${path}`, { ...options, headers: current, signal: options.signal || AbortSignal.timeout(30000) }); };
 let response: Response;
 try {
  response = await send();
  if (response.status === 401 && !anonymous && tokens && generation === epoch) {
   if (tokens.access === originalAccess) {
    if (!refreshing) {
     const refreshToken = tokens.refresh;
     refreshing = (async () => {
      try {
       const r = await fetch(`${base}/auth/refresh`, { method:'POST', headers:{ Authorization:`Bearer ${refreshToken}` }, signal: AbortSignal.timeout(30000) });
       if (!r.ok) throw new ApiError(401,'Session expired');
       const result = await r.json();
       if (typeof result.data?.access_token !== 'string') throw new ApiError(401,'Session expired');
       if (generation === epoch && tokens) {
        tokens.access = result.data.access_token;
        saveSession(tokens);
       }
      } catch (error) { if (generation === epoch) setTokens(); throw error; }
     })().finally(() => { if (generation === epoch) refreshing = undefined; });
    }
    await refreshing;
   }
   if (generation !== epoch) throw new ApiError(401,'Session changed');
   response = await send();
   if (response.status === 401) setTokens();
  }
 } catch (error) { if (error instanceof ApiError || options.signal?.aborted) throw error; throw new ApiError(0,'Backend unavailable'); }
 if (generation !== epoch) throw new ApiError(401,'Session changed');
 if (!response.ok) {
  const body = await response.json().catch(() => ({}));
  const fields: Record<string,string> = Object.create(null);
  for (const issue of Array.isArray(body.errors) ? body.errors : []) {
   if (!Array.isArray(issue.loc)) continue;
   const segments = issue.loc.filter((p: unknown) => p !== 'body' && p !== 'query' && p !== 'path');
   if (segments.some((p: unknown) => !['string','number'].includes(typeof p) || ['__proto__','constructor','prototype'].includes(String(p)))) continue;
   if (segments.length && typeof issue.msg === 'string') fields[segments.join('.')] = issue.msg;
  }
  throw new ApiError(response.status, typeof body.message === 'string' ? body.message : `Request failed (${response.status})`, fields);
 }
 if (binary) return await response.blob() as T;
 if (response.status === 204) return undefined as T;
 const body = await response.json();
 return body && typeof body === 'object' && 'success' in body && 'data' in body ? body.data : body;
}
export function financialIntent<T>(path: string, payload: T) {
 const body = JSON.stringify(payload), key = crypto.randomUUID(), epoch = generation;
 let pending: Promise<unknown> | undefined;
 let completed: Promise<unknown> | undefined;
 return Object.freeze({ key, body, submit: <R>(): Promise<R> => {
  if (generation !== epoch) return Promise.reject(new ApiError(409,'Operation belongs to a previous session'));
  if (completed) return completed as Promise<R>;
  if (!pending) pending = request<R>(path,{ method:'POST',body,headers:{'Idempotency-Key':key} }).then(result => { completed = Promise.resolve(result); return result; }).finally(() => { pending = undefined; });
  return pending as Promise<R>;
 } });
}
