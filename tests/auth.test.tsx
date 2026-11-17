import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthPage } from '../src/components/auth/AuthPage';
import { MyProfile } from '../src/components/auth/MyProfile';
import { AccountSecurity } from '../src/components/auth/AccountSecurity';
import { RequireAuth } from '../src/components/auth/RequireAuth';
import { SessionProvider } from '../src/context/Session';
import { LocaleProvider } from '../src/i18n/locale';
import { hasSession, request, setTokens } from '../src/api/client';
import { auth } from '../src/api/auth';
import { MaterialControllerProvider } from '../src/context/MaterialProvider';
const user={uuid:'user-uuid',email:'user@example.com',user_name:'operator'};
const envelope=(data:unknown)=>Response.json({success:true,data});
afterEach(()=>{cleanup();setTokens();vi.unstubAllGlobals();localStorage.clear();});
function mount(path='/login') {
 return render(<MaterialControllerProvider><LocaleProvider><MemoryRouter initialEntries={[path]}><SessionProvider><Routes>
 <Route path="/login" element={<AuthPage/>}/><Route path="/register" element={<AuthPage/>}/><Route path="/reset-password" element={<AuthPage/>}/>
 <Route path="/dashboard" element={<RequireAuth><p>Signed in dashboard</p></RequireAuth>}/>
 <Route path="/profile" element={<RequireAuth><MyProfile/></RequireAuth>}/>
 <Route path="/account/security" element={<RequireAuth><AccountSecurity/></RequireAuth>}/>
 </Routes></SessionProvider></MemoryRouter></LocaleProvider></MaterialControllerProvider>);
}
function login(){fireEvent.change(screen.getByLabelText(/^Email/),{target:{value:'user@example.com'}});fireEvent.change(screen.getByLabelText(/^Password/),{target:{value:'password123'}});fireEvent.click(screen.getByRole('button',{name:'Sign in'}));}
test('login bootstraps /auth/me and permits users without an organization',async()=>{
 const fetcher=vi.fn(async(url:unknown)=>String(url).endsWith('/auth/login')?envelope({access_token:'access',refresh_token:'refresh'}):String(url).endsWith('/auth/me')?Response.json(user):Response.json({message:'Select organization'},{status:403}));
 vi.stubGlobal('fetch',fetcher);mount();login();await screen.findByText('Signed in dashboard');expect(hasSession()).toBe(true);expect(localStorage.getItem('access_token')).toBeNull();
});
test('challenge is isolated from session tokens and submitted only to verification',async()=>{
 const fetcher=vi.fn(async(url:unknown,init?:RequestInit)=>{
  const path=String(url);
  if(path.endsWith('/auth/login'))return envelope({requires_2fa:true,challenge_token:'challenge-only',expires_in:300});
  if(path.endsWith('/auth/2fa/verify')){expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer challenge-only');return envelope({access_token:'access',refresh_token:'refresh'});}
  if(path.endsWith('/auth/me'))return Response.json(user);
  return envelope({organization_id:1,permissions:[]});
 });
 vi.stubGlobal('fetch',fetcher);mount();login();await screen.findByLabelText(/^Verification or recovery code/);expect(hasSession()).toBe(false);
 fireEvent.change(screen.getByLabelText(/^Verification or recovery code/),{target:{value:'123456'}});fireEvent.click(screen.getByRole('button',{name:'Continue'}));await screen.findByText('Signed in dashboard');
 expect(fetcher.mock.calls.some(([,init])=>new Headers(init?.headers).get('Authorization')==='Bearer challenge-only')).toBe(true);
});
test('rejected challenge returns to login without refreshing or granting a session',async()=>{
 const fetcher=vi.fn(async(url:unknown)=>String(url).endsWith('/auth/login')?envelope({requires_2fa:true,challenge_token:'expired',expires_in:300}):Response.json({message:'Challenge expired'},{status:401}));
 vi.stubGlobal('fetch',fetcher);mount();login();await screen.findByLabelText(/^Verification or recovery code/);fireEvent.change(screen.getByLabelText(/^Verification or recovery code/),{target:{value:'123456'}});fireEvent.click(screen.getByRole('button',{name:'Continue'}));await screen.findByText('Challenge expired. Sign in again.');expect(hasSession()).toBe(false);expect(fetcher).toHaveBeenCalledTimes(2);
});
test('public endpoints never carry an existing access token or trigger refresh',async()=>{
 setTokens({access:'access',refresh:'refresh'});const fetcher=vi.fn(async(_url:unknown,init?:RequestInit)=>{expect(new Headers(init?.headers).has('Authorization')).toBe(false);return Response.json({message:'Invalid credentials'},{status:401});});vi.stubGlobal('fetch',fetcher);
 await expect(auth.login({email:'user@example.com',password:'bad'})).rejects.toThrow('Invalid credentials');expect(fetcher).toHaveBeenCalledTimes(1);expect(hasSession()).toBe(true);
});
test('logout clears the session only after server revocation succeeds',async()=>{
 setTokens({access:'access',refresh:'refresh'});vi.stubGlobal('fetch',vi.fn().mockRejectedValueOnce(new TypeError('network')).mockResolvedValueOnce(envelope(null)));
 await expect(auth.logout()).rejects.toThrow();expect(hasSession()).toBe(true);await auth.logout();expect(hasSession()).toBe(false);
});
test('protected routes redirect signed-out visitors',async()=>{mount('/dashboard');await screen.findByRole('heading',{name:'Sign in'});expect(screen.queryByText('Signed in dashboard')).toBeNull();});
test('reset link supplies the token and submits the actual backend fields',async()=>{
 const fetcher=vi.fn(async()=>envelope(null));vi.stubGlobal('fetch',fetcher);mount('/reset-password?token=email-link-token');
 expect(screen.queryByLabelText(/^Verification token/)).toBeNull(); expect((document.querySelector('input[type=hidden][name=token]') as HTMLInputElement).value).toBe('email-link-token');fireEvent.change(screen.getByLabelText(/^New password/),{target:{value:'new-password123'}});fireEvent.click(screen.getByRole('button',{name:'Reset password'}));await screen.findByText('Request completed successfully.');
 expect(JSON.parse((fetcher.mock.calls as unknown as [string,RequestInit][])[0][1].body as string)).toEqual({token:'email-link-token',new_password:'new-password123'});
});
test('session revocation uses UUID and a confirmation',async()=>{
 setTokens({access:'access',refresh:'refresh'});
 const fetcher=vi.fn(async(url:unknown,init?:RequestInit)=>String(url).endsWith('/auth/me')?Response.json(user):String(url).endsWith('/auth/sessions')?envelope([{id:9,uuid:'device-uuid',user_agent:'Other browser',ip_address:'127.0.0.1',last_used_at:null,expires_at:'2030-01-01T00:00:00Z'}]):init?.method==='DELETE'?envelope(null):envelope({organization_id:1,permissions:[]}));
 vi.stubGlobal('fetch',fetcher);mount('/account/security');await screen.findByText('Other browser');fireEvent.click(screen.getByRole('button',{name:'Revoke session'}));expect(fetcher.mock.calls.some(([,init])=>init?.method==='DELETE')).toBe(false);fireEvent.click(screen.getByRole('button',{name:'Confirm'}));await waitFor(()=>expect(fetcher.mock.calls.some(([url,init])=>String(url).endsWith('/sessions/device-uuid')&&init?.method==='DELETE')).toBe(true));
});
test('expired refresh clears identity and does not replay unauthorized operations',async()=>{
 setTokens({access:'access',refresh:'refresh'});const fetcher=vi.fn(async()=>Response.json({message:'expired'},{status:401}));vi.stubGlobal('fetch',fetcher);await expect(request('/auth/me')).rejects.toThrow('Session expired');expect(hasSession()).toBe(false);expect(fetcher).toHaveBeenCalledTimes(2);
});
test('registration submits consent and does not create a session',async()=>{
 const fetcher=vi.fn(async()=>envelope(user));vi.stubGlobal('fetch',fetcher);mount('/register');
 fireEvent.change(screen.getByLabelText(/^Username/),{target:{value:'newuser'}});fireEvent.change(screen.getByLabelText(/^Email/),{target:{value:'new@example.com'}});fireEvent.change(screen.getByLabelText(/^Password/),{target:{value:'password123'}});fireEvent.click(screen.getByRole('checkbox'));fireEvent.click(screen.getByRole('button',{name:'Create account'}));await screen.findByText('Account created. Sign in to continue.');
 expect(JSON.parse((fetcher.mock.calls as unknown as [string,RequestInit][])[0][1].body as string)).toEqual({user_name:'newuser',email:'new@example.com',password:'password123',accept_terms:true});expect(hasSession()).toBe(false);
});
test('TOTP setup enables with a code and displays recovery codes only until dismissed',async()=>{
 setTokens({access:'access',refresh:'refresh'});
 vi.stubGlobal('fetch',vi.fn(async(url:unknown)=>{
  const path=String(url);
  if(path.endsWith('/auth/me'))return Response.json(user);
  if(path.endsWith('/sessions'))return envelope([]);
  if(path.endsWith('/totp/setup'))return envelope({qr_code:'data:image/png;base64,YQ==',provisioning_uri:'otpauth://totp/EMS?secret=test-only'});
  if(path.endsWith('/totp/enable'))return envelope({recovery_codes:['RECOVERY123']});
  return envelope({organization_id:1,permissions:[]});
 }));mount('/account/security');await screen.findByRole('button',{name:'Set up two-factor authentication'});fireEvent.click(screen.getByRole('button',{name:'Set up two-factor authentication'}));await screen.findByText('otpauth://totp/EMS?secret=test-only');
 const button=screen.getByRole('button',{name:'Enable two-factor authentication'});const form=button.closest('form')!;fireEvent.change(form.querySelector('input')!,{target:{value:'123456'}});fireEvent.click(button);await screen.findByText('RECOVERY123');expect(screen.queryByText('otpauth://totp/EMS?secret=test-only')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Hide secrets'}));expect(screen.queryByText('RECOVERY123')).toBeNull();
});

test('password validation is inline and blocks empty requests', async () => {
 setTokens({access:'access',refresh:'refresh'});
 const fetcher=vi.fn(async(url:unknown)=>String(url).endsWith('/auth/me')?Response.json({...user,first_name:'Ali',middle_name:'Ahmad',last_name:'Rahimi',two_factor_enabled:false}):String(url).endsWith('/sessions')?envelope([]):envelope({organization_id:1,permissions:[]}));
 vi.stubGlobal('fetch',fetcher);mount('/account/security');
 await screen.findByText('Ali Ahmad Rahimi');
 expect(screen.getByText('Disabled')).toBeTruthy();
 const button=screen.getByRole('button',{name:'Change password'});
 expect(button.closest('form')?.noValidate).toBe(true);
 fireEvent.click(button);
 expect(screen.getAllByText('This field is required.')).toHaveLength(2);
 expect(document.activeElement).toBe(screen.getByLabelText(/^Current password/));
 expect(fetcher.mock.calls.some(([url])=>String(url).endsWith('/password/change'))).toBe(false);
 expect(screen.queryByText('Turn off two-factor verification')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'EMS Settings'}));
 expect(await screen.findByText('Appearance')).toBeTruthy();
});

test('reset without a link token explains how to recover without submitting', async () => {
 const fetcher=vi.fn();vi.stubGlobal('fetch',fetcher);mount('/reset-password');
 fireEvent.change(screen.getByLabelText(/^New password/),{target:{value:'new-password123'}});
 fireEvent.click(screen.getByRole('button',{name:'Reset password'}));
 expect(await screen.findByText('Open the full link from your email. The verification token is missing.')).toBeTruthy();
 expect(fetcher).not.toHaveBeenCalled();
});

test('challenge supports six-cell paste, keyboard navigation, and recovery codes',async()=>{
 const fetcher=vi.fn(async()=>envelope({requires_2fa:true,challenge_token:'challenge-only',expires_in:300}));
 vi.stubGlobal('fetch',fetcher);mount();login();
 const first=await screen.findByLabelText(/^Verification or recovery code/);
 fireEvent.paste(first,{clipboardData:{getData:()=> '۱۲۳۴۵۶'}});
 expect((document.querySelector('input[type=hidden][name=code]') as HTMLInputElement).value).toBe('123456');
 const sixth=screen.getByLabelText('Digit 6');expect(document.activeElement).toBe(sixth);
 fireEvent.keyDown(sixth,{key:'ArrowLeft'});expect(document.activeElement).toBe(screen.getByLabelText('Digit 5'));
 fireEvent.click(screen.getByRole('button',{name:'Use a recovery code instead'}));
 const recovery=screen.getByLabelText(/^Verification or recovery code/);
 fireEvent.change(recovery,{target:{value:'RECOVERY123'}});
 expect((recovery as HTMLInputElement).value).toBe('RECOVERY123');
 expect(screen.queryByLabelText('Digit 6')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Use a 6-digit verification code'}));
 fireEvent.click(screen.getByRole('button',{name:'Continue'}));
 expect(await screen.findByText('Enter all 6 digits.')).toBeTruthy();
 expect(fetcher).toHaveBeenCalledTimes(1);
});

test('profile saves only changed fields and refreshes the signed-in identity', async () => {
 setTokens({access:'access',refresh:'refresh'});
 let current={...user,first_name:'Ali',middle_name:null,last_name:'Nasiri',birthday:null};
 const fetcher=vi.fn(async(url:unknown,init?:RequestInit)=>{
  if(String(url).endsWith('/auth/me'))return Response.json(current);
  if(String(url).endsWith('/users/me') && init?.method==='PATCH') {
   const body=JSON.parse(String(init.body));expect(body).toEqual({first_name:'Ahmad'});
   current={...current,...body};return envelope(current);
  }
  return envelope({organization_id:1,permissions:[]});
 });
 vi.stubGlobal('fetch',fetcher);mount('/profile');await screen.findByText('Ali Nasiri');
 expect((screen.getByLabelText(/^Email/) as HTMLInputElement).readOnly).toBe(true);
 fireEvent.change(screen.getByLabelText(/^First name/),{target:{value:'Ahmad'}});
 fireEvent.click(screen.getByRole('button',{name:'Save changes'}));
 await screen.findByText('Profile updated.');await screen.findByText('Ahmad Nasiri');
 expect(fetcher.mock.calls.filter(([url,init])=>String(url).endsWith('/users/me')&&init?.method==='PATCH')).toHaveLength(1);
});

test('avatar menu opens profile actions and sign-out can retry after a failure',async()=>{
 setTokens({access:'access',refresh:'refresh'});let attempts=0;
 vi.stubGlobal('fetch',vi.fn(async(url:unknown)=>{
  if(String(url).endsWith('/auth/me'))return Response.json(user);
  if(String(url).endsWith('/logout')) { attempts++;return attempts===1?Response.json({message:'Try again later'},{status:503}):envelope(null); }
  return envelope({organization_id:1,permissions:[]});
 }));mount('/profile');await screen.findByRole('button',{name:'Account menu'});
 fireEvent.click(screen.getByRole('button',{name:'Account menu'}));
 expect(screen.getByRole('menuitem',{name:'My Profile'}).getAttribute('href')).toBe('/profile');
 expect(screen.getByRole('menuitem',{name:'Account security'}).getAttribute('href')).toBe('/account/security');
 fireEvent.click(screen.getByRole('menuitem',{name:'Sign out'}));
 fireEvent.click(screen.getByRole('button',{name:'Sign out',exact:true}));
 await screen.findByRole('alert');expect(hasSession()).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Sign out',exact:true}));
 await screen.findByRole('button',{name:'Sign in',exact:true});expect(hasSession()).toBe(false);
});
