import { afterEach, expect, test, vi } from 'vitest';

const key = 'ems.auth.session';
const envelope = (data: unknown) => Response.json({ success: true, data });

afterEach(() => {
 vi.unstubAllGlobals();
 sessionStorage.clear();
 vi.resetModules();
});

test('completed login survives a module reload and authenticates the bootstrap request', async () => {
 const { acceptLogin } = await import('../src/api/auth');
 acceptLogin({ access_token: 'access', refresh_token: 'refresh', requires_2fa: false });
 vi.resetModules();
 const restored = await import('../src/api/client');
 const fetcher = vi.fn(async (_url: unknown, init?: RequestInit) => {
  expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer access');
  return envelope({ user_name: 'operator' });
 });
 vi.stubGlobal('fetch', fetcher);
 expect(restored.hasSession()).toBe(true);
 expect(await restored.request('/auth/me')).toEqual({ user_name: 'operator' });
 expect(localStorage.getItem(key)).toBeNull();
});

test('an expired restored access token refreshes once and the replacement survives another reload', async () => {
 sessionStorage.setItem(key, JSON.stringify({ access: 'expired', refresh: 'refresh' }));
 const client = await import('../src/api/client');
 const fetcher = vi.fn(async (url: unknown, init?: RequestInit) => {
  if (String(url).endsWith('/auth/refresh')) {
   expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer refresh');
   return envelope({ access_token: 'renewed' });
  }
  return new Headers(init?.headers).get('Authorization') === 'Bearer expired'
   ? new Response(null, { status: 401 }) : envelope({ user_name: 'operator' });
 });
 vi.stubGlobal('fetch', fetcher);
 await client.request('/auth/me');
 expect(fetcher).toHaveBeenCalledTimes(3);
 vi.resetModules();
 const restored = await import('../src/api/client');
 await restored.request('/auth/me');
 expect(fetcher).toHaveBeenCalledTimes(4);
 expect(JSON.parse(sessionStorage.getItem(key)!)).toEqual({ access: 'renewed', refresh: 'refresh' });
});

test('a rejected refresh removes persisted credentials and reload stays signed out', async () => {
 sessionStorage.setItem(key, JSON.stringify({ access: 'expired', refresh: 'revoked' }));
 const client = await import('../src/api/client');
 vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })));
 await expect(client.request('/auth/me')).rejects.toThrow('Session expired');
 expect(sessionStorage.getItem(key)).toBeNull();
 vi.resetModules();
 expect((await import('../src/api/client')).hasSession()).toBe(false);
});

test('successful logout removes the saved session but failed logout remains retryable', async () => {
 const { setTokens } = await import('../src/api/client');
 const { auth } = await import('../src/api/auth');
 setTokens({ access: 'access', refresh: 'refresh' });
 vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(envelope(null)));
 await expect(auth.logout()).rejects.toThrow();
 expect(sessionStorage.getItem(key)).not.toBeNull();
 await auth.logout();
 expect(sessionStorage.getItem(key)).toBeNull();
 vi.resetModules();
 expect((await import('../src/api/client')).hasSession()).toBe(false);
});

test.each(['not-json', 'null', '{}', '{"access":"access","refresh":0}', '{"access":"","refresh":"refresh"}'])('invalid saved credentials are discarded: %s', async saved => {
 sessionStorage.setItem(key, saved);
 expect((await import('../src/api/client')).hasSession()).toBe(false);
 expect(sessionStorage.getItem(key)).toBeNull();
});

test('a two-factor challenge cannot persist an authenticated session', async () => {
 const { acceptLogin } = await import('../src/api/auth');
 expect(() => acceptLogin({ requires_2fa: true, challenge_token: 'challenge', expires_in: 300 })).toThrow();
 expect(sessionStorage.getItem(key)).toBeNull();
 vi.resetModules();
 expect((await import('../src/api/client')).hasSession()).toBe(false);
});

test('unavailable storage does not prevent an in-memory login or logout', async () => {
 vi.stubGlobal('sessionStorage', {
  getItem: () => { throw new Error('Storage denied'); },
  setItem: () => { throw new Error('Storage denied'); },
  removeItem: () => { throw new Error('Storage denied'); },
 });
 const client = await import('../src/api/client');
 expect(client.hasSession()).toBe(false);
 client.setTokens({ access: 'access', refresh: 'refresh' });
 expect(client.hasSession()).toBe(true);
 client.setTokens();
 expect(client.hasSession()).toBe(false);
});
