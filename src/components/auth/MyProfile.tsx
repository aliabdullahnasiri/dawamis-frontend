import { useRef, useState } from 'react';
import { Alert, Avatar, Box, Button, Container, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import { ArrowBackOutlined, SettingsOutlined, ShieldOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { auth } from '../../api/auth';
import type { UpdateUserRequest } from '../../api/generated';
import { useSession } from '../../context/Session';
import { useMaterialController } from '../../context/useMaterialController';
import { setOpenConfigurator } from '../../context/materialActions';
import { useLocale } from '../../i18n/locale';
import Configurator from '../../widgets/layout/Configurator';
import FormInput from '../shared/FormInput';
import { AccountMenu } from './AccountMenu';
import { fullName, initials } from './identity';
import { useAuthText } from './text';

export function MyProfile() {
 const { user, reload } = useSession();
 const t = useAuthText();
 const { t: ui } = useLocale();
 const [, dispatch] = useMaterialController();
 const lock = useRef(false);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState<string>();
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [saved, setSaved] = useState(false);
 const name = fullName(user);
 const panel = { p: { xs: 2.5, md: 3.5 }, border: 1, borderColor: 'divider', boxShadow: 'none' };
 const names = ['first_name', 'middle_name', 'last_name'] as const;
 return <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}><Stack spacing={3}>
  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}><Button component={Link} to="/dashboard" startIcon={<ArrowBackOutlined sx={{ '[dir=rtl] &': { transform: 'rotate(180deg)' } }}/>}>{t('back')}</Button><Stack direction="row" spacing={1}><Button startIcon={<SettingsOutlined/>} onClick={() => setOpenConfigurator(dispatch, true)}>{ui('settings')}</Button><AccountMenu/></Stack></Stack>
  <Paper data-motion-panel sx={{ ...panel, borderTop: 3, borderTopColor: 'primary.main' }}><Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}><Avatar sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 }, borderRadius: '24px', fontSize: 26, fontWeight: 600, bgcolor: theme => alpha(theme.palette.primary.main, .1), color: 'primary.main' }}>{initials(name)}</Avatar><Box sx={{ minWidth: 0 }}><Typography component="h1" variant="h4" sx={{ fontSize: { xs: 26, md: 32 } }}>{t('profile')}</Typography><Typography sx={{ mt: .75, fontWeight: 600, overflowWrap: 'anywhere' }}>{name}</Typography><Typography variant="body2" color="text.secondary" dir="auto" sx={{ overflowWrap: 'anywhere' }}>{user?.email}</Typography></Box></Stack></Paper>
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 300px' }, gap: 3, alignItems: 'start' }}>
   <Paper data-motion-panel sx={panel}><Stack component="form" spacing={3} noValidate aria-busy={busy} onChange={() => { setSaved(false); setError(undefined); }} onSubmit={async event => {
    event.preventDefault(); if (lock.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const issues: Record<string, string> = {};
    for (const key of [...names, 'user_name'] as const) if ((values[key] || '').trim().length > 50) issues[key] = t('maximumLength').replace('{count}', '50');
    for (const key of ['user_name']) if (!values[key]?.trim()) issues[key] = t('requiredField');
    if (values.birthday && !/^\d{4}-\d{2}-\d{2}$/.test(values.birthday)) issues.birthday = t('invalidDate');
    setErrors(issues); setError(undefined); setSaved(false);
    if (Object.keys(issues).length) { (form.elements.namedItem(Object.keys(issues)[0]) as HTMLElement | null)?.focus(); return; }
    const body: UpdateUserRequest = {};
    for (const key of [...names, 'user_name', 'birthday'] as const) {
     const value = values[key]?.trim() || null;
     if (value !== (user?.[key] || null)) Object.assign(body, { [key]: value });
    }
    if (!Object.keys(body).length) { setSaved(true); return; }
    lock.current = true; setBusy(true);
    try { await auth.updateProfile(body); reload(); setSaved(true); }
    catch (failure) { if (failure instanceof ApiError) setErrors(failure.fields); setError(failure instanceof Error ? failure.message : t('retry')); }
    finally { lock.current = false; setBusy(false); }
   }}>
    <Box><Typography component="h2" variant="h6">{t('personalDetails')}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{t('profileHelp')}</Typography></Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
     {names.map(key => <FormInput key={key} name={key} label={t(key)} defaultValue={user?.[key] || ''} maxLength={50} disabled={busy} error={errors[key]} autoComplete={key === 'first_name' ? 'given-name' : key === 'middle_name' ? 'additional-name' : 'family-name'} onChange={() => setErrors(current => ({ ...current, [key]: '' }))}/>)}
     <TextField name="birthday" type="date" label={t('birthday')} defaultValue={user?.birthday || ''} disabled={busy} error={!!errors.birthday} helperText={errors.birthday} slotProps={{ inputLabel: { shrink: true }, htmlInput: { dir: 'ltr' } }}/>
    </Box>
    <Divider/><Typography component="h2" variant="h6">{t('accountDetails')}</Typography>
    <FormInput name="user_name" label={t('user_name')} defaultValue={user?.user_name || ''} maxLength={50} required disabled={busy} error={errors.user_name} autoComplete="username" dir="ltr" onChange={() => setErrors(current => ({ ...current, user_name: '' }))}/>
    <FormInput name="email" label={t('email')} type="email" defaultValue={user?.email || ''} readOnly autoComplete="email" dir="ltr"/>
    {error && <Alert severity="error">{error}</Alert>}{saved && <Alert severity="success">{t('profileSaved')}</Alert>}
    <Button type="submit" variant="contained" loading={busy} sx={{ minHeight: 48, alignSelf: { sm: 'flex-start' }, minWidth: 160 }}>{t('saveChanges')}</Button>
   </Stack></Paper>
   <Paper data-motion-panel sx={panel}><Stack spacing={2}><ShieldOutlined color="primary"/><Typography component="h2" variant="h6">{t('security')}</Typography><Typography variant="body2" color="text.secondary">{t('manageSecurity')}</Typography><Button component={Link} to="/account/security" variant="outlined">{t('security')}</Button></Stack></Paper>
  </Box>
  <Configurator/>
 </Stack></Container>;
}
