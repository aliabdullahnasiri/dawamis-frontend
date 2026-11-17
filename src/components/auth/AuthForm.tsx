import type { ReactNode } from 'react';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { Alert, Button, Checkbox, FormControlLabel, IconButton, Stack } from '@mui/material';
import { ApiError } from '../../api/client';
import { useAuthText } from './text';
import type { AuthKey } from './text';
import FormInput from '../shared/FormInput';
import { VerificationCode } from './VerificationCode';
export type Field = {name: AuthKey; type?: string; minLength?: number; maxLength?: number; initial?: string};
export function AuthForm({fields, onSubmit, label = 'submit', success = 'done', terms = false, footer}: {fields: Field[]; onSubmit: (data: Record<string,string>) => Promise<void>; label?: AuthKey; success?: AuthKey; terms?: boolean; footer?: ReactNode}) {
 const t = useAuthText();
 const lock = useRef(false);
 const [resetKey, setResetKey] = useState(0);
 const [busy,setBusy] = useState(false);
 const [error,setError] = useState<unknown>();
 const [visible, setVisible] = useState<Record<string, boolean>>({});
 const [validation,setValidation] = useState<Record<string,string>>({});
 const [termsError,setTermsError] = useState(false);
 const [done,setDone] = useState(false);
 return <Stack component="form" spacing={2.5} noValidate aria-busy={busy} onSubmit={async event => {
  event.preventDefault(); if (lock.current) return;
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form)) as Record<string,string>;
  const issues: Record<string,string> = {};
  for (const field of fields) {
   const value = data[field.name] || '';
   if (!value || (field.type !== 'password' && !value.trim())) issues[field.name] = t('requiredField');
   else if (field.minLength && value.length < field.minLength) issues[field.name] = t('minimumLength').replace('{count}', String(field.minLength));
   else if (field.maxLength && value.length > field.maxLength) issues[field.name] = t('maximumLength').replace('{count}', String(field.maxLength));
   else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) issues[field.name] = t('invalidEmail');
  }
  if (fields.some(field => field.type === 'codeCells') && !/^\d{6}$/.test(data.code || '')) issues.code = t('sixDigitsRequired');
  const missingTerms = terms && !data.accept_terms;
  setValidation(issues); setTermsError(missingTerms); setError(undefined); setDone(false);
  if (Object.keys(issues).length || missingTerms) {
   const first = fields.find(field => field.type !== 'hidden' && issues[field.name]);
   if (first?.type === 'codeCells') form.querySelector<HTMLInputElement>('input[inputmode=numeric]')?.focus();
   else (form.elements.namedItem(first?.name || 'accept_terms') as HTMLElement | null)?.focus();
   return;
  }
  lock.current = true; setBusy(true); setError(undefined); setDone(false);
  try { await onSubmit(data); form.reset(); setResetKey(value => value + 1); setVisible({}); setDone(true); } catch (failure) {setError(failure);} finally {lock.current=false;setBusy(false);}
 }}>
 {fields.map(field => {
  if (field.type === 'hidden') return <input key={field.name} type="hidden" name={field.name} value={field.initial || ''}/>;
  const isPassword = field.type === 'password';
  const fieldError = validation[field.name] || (error instanceof ApiError ? error.fields[field.name] : undefined);
  if (field.type === 'codeCells') return <VerificationCode key={`${field.name}-${resetKey}`} disabled={busy} error={fieldError} onChange={() => { setValidation({}); setError(undefined); setDone(false); }}/>;
  return <FormInput key={field.name} name={field.name} label={t(field.name)}
   type={isPassword && visible[field.name] ? 'text' : field.type || 'text'}
   onChange={() => { setValidation(current => { const next = {...current}; delete next[field.name]; return next; }); setError(undefined); setDone(false); }}
   defaultValue={field.initial || ''} required disabled={busy}
   autoComplete={field.name === 'email' ? 'email' : field.name === 'user_name' ? 'username' : field.name === 'password' ? terms ? 'new-password' : 'current-password' : field.name === 'current_password' ? 'current-password' : field.name === 'new_password' ? 'new-password' : field.name === 'code' ? 'one-time-code' : 'off'}
   minLength={field.minLength} maxLength={field.maxLength} dir={field.name === 'user_name' ? 'auto' : 'ltr'} spellCheck={false} autoCapitalize="none"
   endAdornment={isPassword ? <IconButton type="button" disabled={busy} aria-label={t(visible[field.name] ? 'hidePassword' : 'showPassword')} aria-pressed={!!visible[field.name]} onMouseDown={event => event.preventDefault()} onClick={() => setVisible(current => ({ ...current, [field.name]: !current[field.name] }))} sx={{ width: 44, height: 44, mr: -.75, color: 'text.secondary' }}>{visible[field.name] ? <VisibilityOffOutlined fontSize="small"/> : <VisibilityOutlined fontSize="small"/>}</IconButton> : undefined}
   error={fieldError} helperText={terms && isPassword ? t('passwordHelp') : undefined}/>;
 })}
 {fields.some(field => field.type === 'hidden' && validation[field.name]) && <Alert severity="error">{t('missingLinkToken')}</Alert>}
 {footer}
 {terms && <FormControlLabel sx={{ alignItems: 'center', mx: 0, gap: .5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem', lineHeight: 1.6 }, '& .MuiCheckbox-root': { minWidth: 44, minHeight: 44, p: 1.25, borderRadius: '10px' } }} control={<Checkbox onChange={() => setTermsError(false)} name="accept_terms" required disabled={busy}/>} label={t('accept_terms')}/>}
 {termsError && <Alert severity="error">{t('requiredTerms')}</Alert>}
 {error != null && <Alert severity="error">{error instanceof Error ? error.message : t('retry')}</Alert>}
 {done && <Alert severity="success">{t(success)}</Alert>}
 <Button type="submit" variant="contained" loading={busy} disabled={busy} sx={{ minHeight: 48, borderRadius: '10px', fontSize: '0.9375rem' }}>{t(label)}</Button>
 </Stack>;
}
