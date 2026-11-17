import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LocaleProvider } from '../src/i18n/locale';
import LocaleControl from '../src/components/shared/LocaleControl';
import { PermissionGate, CurrencyInput, RequestState, Confirmation } from '../src/components/shared/Contracts';
import { ApiError } from '../src/api/client';
import { useState } from 'react';
import { SessionProvider, useSession } from '../src/context/Session';
import { setTokens } from '../src/api/client';
import { act } from '@testing-library/react';
afterEach(()=>{cleanup();localStorage.clear();});
test('language selection persists and changes RTL without reload',async()=>{
 render(<LocaleProvider><LocaleControl /></LocaleProvider>);
 fireEvent.click(screen.getByRole('button',{name:'پښتو'}));
 expect(screen.getByRole('button',{name:'پښتو'}).getAttribute('aria-pressed')).toBe('true');
 await waitFor(()=>expect(document.documentElement.dir).toBe('rtl'));
 expect(document.documentElement.lang).toBe('ps');expect(localStorage.getItem('ems.locale')).toBe('ps');
});
test('permission denial hides protected data',()=>{
 render(<PermissionGate grants={['payment:read']} permission="exchange:create">secret</PermissionGate>);
 expect(screen.queryByText('secret')).toBeNull();expect(screen.getByRole('alert').textContent).toContain('Access denied');
});
function Money(){const [value,setValue]=useState('');return <CurrencyInput currency="AFN" value={value} onChange={setValue}/>;}
test('money field retains exact Unicode digits and fractional precision',()=>{render(<Money/>);const input=screen.getByRole('textbox') as HTMLInputElement;fireEvent.change(input,{target:{value:'۱۲۳۴۵۶۷۸۹۰.۰۰۱'}});expect(input.value).toBe('۱۲۳۴۵۶۷۸۹۰.۰۰۱');});
test('server status maps to localized UI and busy confirmation disables actions',()=>{render(<><RequestState error={new ApiError(409,'raw details')}/><Confirmation open title="Review" busy onConfirm={()=>{}} onClose={()=>{}}>Receipt</Confirmation></>);expect(screen.getByRole('alert', { hidden: true }).textContent).toContain('conflicts');expect((screen.getByRole('button',{name:'Confirm'}) as HTMLButtonElement).disabled).toBe(true);});

function SessionProbe(){const {context,loading}=useSession();return <p>{loading?'loading':context?String(context.organization_id):'guest'}</p>;}
test('session bootstrap loads verified context and clears it on logout',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({organization_id:7,membership_id:2,user_id:3,permissions:['exchange:create']});
 try {
 render(<SessionProvider><SessionProbe/></SessionProvider>);
 expect(screen.getByText('guest')).toBeTruthy();
 act(()=>setTokens({access:'access',refresh:'refresh'}));
 await screen.findByText('7');
 act(()=>setTokens());
 await screen.findByText('guest');
 } finally {globalThis.fetch=original;setTokens();}
});
