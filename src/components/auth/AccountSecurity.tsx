import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Box, Button, Chip, Container, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { SettingsOutlined, ArrowBackOutlined, DevicesOutlined, ExpandMore, KeyOutlined, LanguageOutlined, LockOutlined, LogoutOutlined, MailOutlined, RefreshOutlined, ShieldOutlined, SmartphoneOutlined, TabletMacOutlined, ComputerOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { auth } from '../../api/auth';
import type { SessionData, TOTPSetupData } from '../../api/generated';
import { useSession } from '../../context/Session';
import { useLocale } from '../../i18n/locale';
import { initials as avatarInitials } from './identity';
import { AccountMenu } from './AccountMenu';
import { AuthForm } from './AuthForm';
import { useAuthText } from './text';
import Configurator from '../../widgets/layout/Configurator';
import { useMaterialController } from '../../context/useMaterialController';
import { setOpenConfigurator } from '../../context/materialActions';

function SectionTitle({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
 return <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}><Box sx={{ color: 'primary.main', display: 'flex', pt: .25 }}>{icon}</Box><Box><Typography component="h2" variant="h6">{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5, maxWidth: 560 }}>{description}</Typography></Box></Stack>;
}

function deviceDetails(agent: string | null) {
 const ua = agent || '';
 const icon = /ipad|tablet/i.test(ua) ? <TabletMacOutlined/> : /mobile|iphone|android/i.test(ua) ? <SmartphoneOutlined/> : ua ? <ComputerOutlined/> : <DevicesOutlined/>;
 const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : '';
 const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Macintosh|Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
 return { icon, browser, os };
}

export function AccountSecurity() {
 const t = useAuthText();
 const { user, reload } = useSession();
 const { locale, t: localeText } = useLocale();
 const [, dispatch] = useMaterialController();
 const [twoFactorOverride, setTwoFactorEnabled] = useState<boolean>();
 const [methodOverride, setEnabledMethod] = useState<'totp' | 'otp'>();
 const twoFactorEnabled = twoFactorOverride ?? user?.two_factor_enabled;
 const enabledMethod = methodOverride ?? (user?.two_factor_method === 'totp' || user?.two_factor_method === 'otp' ? user.two_factor_method : undefined);
 const [sessions, setSessions] = useState<SessionData[]>();
 const [error, setError] = useState<unknown>();
 const [busy, setBusy] = useState(false);
 const lock = useRef(false);
 const [revision, setRevision] = useState(0);
 const [confirm, setConfirm] = useState<'all' | SessionData>();
 const [setup, setSetup] = useState<TOTPSetupData>();
 const [setupMethod, setSetupMethod] = useState<'totp' | 'otp'>();
 const [codes, setCodes] = useState<string[]>();
 const [method, setMethod] = useState<'totp' | 'otp'>('totp');
 useEffect(() => {
  let active = true;
  auth.sessions().then(data => { if (active) setSessions(data); }).catch(failure => { if (active) setError(failure); });
  return () => { active = false; };
 }, [revision]);
 const action = async (fn: () => Promise<unknown>) => {
  if (lock.current) return;
  lock.current = true; setBusy(true); setError(undefined);
  try { await fn(); } catch (failure) { setError(failure); } finally { lock.current = false; setBusy(false); }
 };
 const clearSetup = () => { setSetup(undefined); setSetupMethod(undefined); setCodes(undefined); };
 const name = [user?.first_name, user?.middle_name, user?.last_name].map(part => part?.trim()).filter(Boolean).join(' ') || t('profile');
 const initials = avatarInitials(name);
 const date = (value: string | null) => value && !Number.isNaN(Date.parse(value)) ? new Date(value).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
 const panel = { p: { xs: 2.5, md: 3.5 }, border: 1, borderColor: 'divider', boxShadow: 'none' };
 return <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}><Stack spacing={3}>
  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
   <Button component={Link} to="/dashboard" startIcon={<ArrowBackOutlined sx={{ '[dir=rtl] &': { transform: 'rotate(180deg)' } }}/>}>{t('back')}</Button>
   <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}><Tooltip title={localeText('settings')}><IconButton aria-label={localeText('settings')} onClick={() => setOpenConfigurator(dispatch, true)} sx={{ p: .5, minWidth: 44, minHeight: 44 }}><Avatar sx={{ width: 36, height: 36, bgcolor: theme => alpha(theme.palette.primary.main, .12), color: 'primary.main' }}><SettingsOutlined fontSize="small"/></Avatar></IconButton></Tooltip><AccountMenu/></Stack>
  </Stack>
  <Paper data-motion-panel sx={{ ...panel, py: { xs: 3, md: 4 }, borderTop: 3, borderTopColor: 'primary.main' }}>
   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}>
    <Avatar sx={{ width: 80, height: 80, fontSize: 28, fontWeight: 600, borderRadius: '24px', bgcolor: theme => alpha(theme.palette.primary.main, .1), color: 'primary.main' }}>{initials}</Avatar>
    <Box sx={{ minWidth: 0, flex: 1 }}><Typography component="h1" variant="h4" sx={{ fontSize: { xs: 26, md: 32 }, letterSpacing: '-.025em' }}>{t('security')}</Typography><Typography sx={{ mt: 1, fontWeight: 600, overflowWrap: 'anywhere' }}>{name}</Typography><Typography variant="body2" color="text.secondary" dir="auto" sx={{ overflowWrap: 'anywhere' }}>{user?.email}</Typography></Box>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250 }}>{t('securityHelp')}</Typography>
   </Stack>
  </Paper>
  {error != null && <Alert severity="error">{error instanceof Error ? error.message : t('retry')}</Alert>}
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.35fr) minmax(0, 1fr)' }, gap: 3, alignItems: 'start' }}>
   <Paper data-motion-panel sx={panel}><Stack spacing={3}>
    <SectionTitle icon={<ShieldOutlined/>} title={t('challenge')} description={t('twoFactorHelp')}/>
    <Chip role="status" label={t(twoFactorEnabled === true ? 'twoFactorEnabled' : twoFactorEnabled === false ? 'twoFactorDisabled' : 'twoFactorUnknown')} color={twoFactorEnabled ? 'success' : 'default'} variant="outlined" sx={{ alignSelf: 'flex-start' }}/>
    {!setupMethod && !codes && twoFactorEnabled !== true && <>
     <Box role="group" aria-label={t('method')} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
      {(['totp', 'otp'] as const).map(value => <Button key={value} variant="outlined" disabled={busy} aria-pressed={method === value} onClick={() => setMethod(value)} sx={{ p: 2, textAlign: 'start', alignItems: 'flex-start', justifyContent: 'flex-start', borderColor: method === value ? 'primary.main' : 'divider', bgcolor: theme => method === value ? alpha(theme.palette.primary.main, .05) : 'transparent', color: 'text.primary' }}><Stack spacing={1}>{value === 'totp' ? <SmartphoneOutlined color="primary"/> : <MailOutlined color="primary"/>}<Typography component="span" sx={{ fontWeight: 600 }}>{t(value)}</Typography><Typography component="span" variant="body2" color="text.secondary">{t(value === 'totp' ? 'appHelp' : 'emailHelp')}</Typography></Stack></Button>)}
     </Box>
     <Button variant="contained" loading={busy} onClick={() => void action(async () => { clearSetup(); const result = await auth.setup(method); if ('qr_code' in result) setSetup(result); setSetupMethod(method); })}>{t('setup')}</Button>
    </>}
    {setupMethod && <Stack spacing={2.5}>
     <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{t(setupMethod === 'totp' ? 'connectApp' : 'otp')}</Typography>
     {setup && <><Typography variant="body2" color="text.secondary">{t('scan')}</Typography>{/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(setup.qr_code) && <Box sx={{ alignSelf: 'center', p: 1.5, bgcolor: '#ffffff', borderRadius: 2 }}><Box component="img" alt={t('setup')} src={setup.qr_code} sx={{ display: 'block', width: 200, maxWidth: '100%' }}/></Box>}<Box><Typography variant="caption" color="text.secondary">{t('manualSetup')}</Typography><Typography dir="ltr" variant="body2" sx={{ overflowWrap: 'anywhere', p: 1.5, mt: .5, bgcolor: 'action.hover', borderRadius: 1 }}>{setup.provisioning_uri}</Typography></Box></>}
     {setupMethod === 'otp' && <><Alert severity="info">{t('emailSent')}</Alert><Button disabled={busy} onClick={() => void action(auth.resendOtp)}>{t('resendCode')}</Button></>}
     <Divider/><Box><Typography sx={{ fontWeight: 600 }}>{t('enterSetupCode')}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{t('codeHelp')}</Typography></Box>
     <AuthForm fields={[{ name: 'code', minLength: 6, maxLength: 6 }]} label="enable" onSubmit={async data => { const result = await auth.enable(setupMethod, data.code); setSetup(undefined); setSetupMethod(undefined); setCodes(result.recovery_codes); setTwoFactorEnabled(true); setEnabledMethod(setupMethod); }}/>
     <Button disabled={busy} onClick={clearSetup}>{t('cancel')}</Button>
    </Stack>}
    {codes && <Stack spacing={2}><Alert severity="success">{t('enabledSuccess')}</Alert><Typography variant="body2">{t('saveCodes')}</Typography><Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1, bgcolor: 'action.hover', p: 2, borderRadius: 2 }}>{codes.map(code => <Typography key={code} dir="ltr" sx={{ fontFamily: 'monospace', overflowWrap: 'anywhere' }}>{code}</Typography>)}</Box><Button variant="outlined" onClick={clearSetup}>{t('dismiss')}</Button></Stack>}
    {!setupMethod && !codes && twoFactorEnabled !== false && <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '12px', overflow: 'hidden', '& .MuiAccordion-root': { border: 0, borderRadius: 0, m: 0, boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' }, '&.Mui-expanded': { m: 0 } }, '& .MuiAccordionSummary-root': { px: 2, minHeight: 56, '&.Mui-expanded': { minHeight: 56 } }, '& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded': { my: 1.5 }, '& .MuiAccordionDetails-root': { px: 2, pt: .5, pb: 2.5 } }}>
     <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }}><AccordionSummary expandIcon={<ExpandMore/>}><Typography variant="body2" sx={{ fontWeight: 600 }}>{t('recovery')}</Typography></AccordionSummary><AccordionDetails><Stack spacing={2}><Typography variant="body2" color="text.secondary">{t('recoveryHelpSecurity')}</Typography><AuthForm label="recovery" fields={[{ name: 'code', minLength: 6, maxLength: 64 }]} onSubmit={async data => { const result = await auth.recoveryCodes(data.code); setCodes(result.recovery_codes); }}/></Stack></AccordionDetails></Accordion>
     <Divider/>
     <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' }, bgcolor: 'transparent' }}><AccordionSummary expandIcon={<ExpandMore/>}><Typography variant="body2" color="text.secondary">{t('manageTwoFactor')}</Typography></AccordionSummary><AccordionDetails><Stack spacing={2}><Typography variant="body2" color="text.secondary">{t('disableHelp')}</Typography><Chip label={t(enabledMethod || method)} variant="outlined" sx={{ alignSelf: 'flex-start' }}/>{(enabledMethod || method) === 'otp' && <Button disabled={busy} onClick={() => void action(auth.resendOtp)}>{t('resendCode')}</Button>}<AuthForm label="disable" fields={[{ name: 'password', type: 'password' }, { name: 'code', minLength: 6, maxLength: 64 }]} onSubmit={async data => { await auth.disable(enabledMethod || method, data.password, data.code); setTwoFactorEnabled(false); setEnabledMethod(undefined); clearSetup(); }}/></Stack></AccordionDetails></Accordion>
    </Box>}
   </Stack></Paper>
   <Paper data-motion-panel sx={panel}><Stack spacing={3}><SectionTitle icon={<LockOutlined/>} title={t('change')} description={t('passwordSecurityHelp')}/><AuthForm label="change" fields={[{ name: 'current_password', type: 'password' }, { name: 'new_password', type: 'password', minLength: 8, maxLength: 128 }]} onSubmit={async data => { await auth.changePassword({ current_password: data.current_password, new_password: data.new_password }); reload(); }}/></Stack></Paper>
  </Box>
  <Paper data-motion-panel sx={{ ...panel, overflow: 'hidden' }}><Stack spacing={2.5}>
   <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'space-between', gap: 2 }}><SectionTitle icon={<DevicesOutlined/>} title={t('sessions')} description={t('sessionsHelp')}/><Button startIcon={<RefreshOutlined/>} disabled={busy || sessions === undefined && error == null} onClick={() => { setError(undefined); setSessions(undefined); setRevision(v => v + 1); }}>{t('refresh')}</Button></Stack>
   {sessions === undefined && error == null && <Stack role="status" aria-label={t('loadingSessions')} spacing={2}><Skeleton height={64}/><Skeleton height={64}/></Stack>}
   {sessions?.length === 0 && <Stack spacing={1} sx={{ alignItems: "center", py: 4, color: 'text.secondary' }}><DevicesOutlined sx={{ fontSize: 40 }}/><Typography>{t('empty')}</Typography></Stack>}
   {sessions?.map(session => { const device = deviceDetails(session.user_agent); return <Box key={session.uuid} sx={{ borderTop: 1, borderColor: 'divider', pt: 2.5 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
    <Stack direction="row" spacing={2} sx={{ flex: 1, minWidth: 0 }}><Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'action.hover', color: 'text.secondary' }}>{device.icon}</Avatar><Box sx={{ minWidth: 0 }}><Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}><Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{device.browser || session.user_agent || t('unknownDevice')}</Typography>{device.os && <Chip size="small" variant="outlined" label={device.os}/>}</Stack><Stack direction="row" spacing={.75} sx={{ alignItems: "center", color: "text.secondary", mt: .5 }}><LanguageOutlined sx={{ fontSize: 16 }}/><Typography variant="body2" dir="ltr">{session.ip_address || '—'}</Typography></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('activity')}: {date(session.last_used_at)}</Typography><Typography variant="caption" color="text.secondary">{t('expires')}: {date(session.expires_at)}</Typography></Box></Stack>
    <Button color="error" startIcon={<LogoutOutlined/>} disabled={busy} sx={{ alignSelf: { xs: 'flex-end', sm: 'center' }, flexShrink: 0 }} onClick={() => setConfirm(session)}>{t('revoke')}</Button>
   </Stack></Box>; })}
   {!!sessions?.length && <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}><Button color="error" variant="outlined" startIcon={<KeyOutlined/>} disabled={busy} onClick={() => setConfirm('all')}>{t('revokeAll')}</Button></Box>}
  </Stack></Paper>
  <Dialog open={!!confirm} fullWidth maxWidth="xs" onClose={() => { if (!busy) setConfirm(undefined); }}><DialogTitle>{t(confirm === 'all' ? 'revokeAll' : 'revoke')}</DialogTitle><DialogContent><Typography variant="body2" color="text.secondary">{t('revokeHelp')}</Typography><Typography sx={{ mt: 2, overflowWrap: 'anywhere' }}>{confirm && confirm !== 'all' ? confirm.user_agent : user?.email}</Typography></DialogContent><DialogActions><Button disabled={busy} onClick={() => setConfirm(undefined)}>{t('cancel')}</Button><Button color="error" variant="contained" loading={busy} onClick={() => void action(async () => { if (confirm === 'all') await auth.revokeAll(); else if (confirm) { await auth.revoke(confirm.uuid); await auth.me(); setRevision(v => v + 1); } setConfirm(undefined); })}>{t('confirm')}</Button></DialogActions></Dialog>
 <Configurator/>
 </Stack></Container>;
}
