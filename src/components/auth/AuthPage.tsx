import { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { auth, acceptLogin } from '../../api/auth';
import { ApiError } from '../../api/client';
import { useSession } from '../../context/Session';
import LocaleControl from '../shared/LocaleControl';
import { useLocale } from '../../i18n/locale';
import SwapHorizRounded from '@mui/icons-material/SwapHorizRounded';
import { AuthForm } from './AuthForm';
import type { Field } from './AuthForm';
import { useAuthText } from './text';
import type { AuthKey } from './text';
const modes: Record<string, AuthKey> = {'/login':'login','/register':'register','/forgot-password':'forgot','/reset-password':'reset','/verify-email':'verify','/resend-verification':'resend'};
export function AuthPage() {
 const {pathname,search} = useLocation();
 const { t: ui } = useLocale();
 const t = useAuthText(); const navigate = useNavigate(); const {authenticated} = useSession();
 const [challenge,setChallenge] = useState<{token:string; deadline:number}>();
 const [useRecovery,setUseRecovery] = useState(false);
 const [expired,setExpired] = useState(false);
 const [linkToken] = useState(() => new URLSearchParams(search).get('token') || '');
 useEffect(() => { if (search) navigate(pathname,{replace:true}); },[search,pathname,navigate]);
 useEffect(() => { if (!challenge) return; const timer = setTimeout(()=>{setChallenge(undefined);setExpired(true);}, Math.max(0,challenge.deadline-Date.now())); return ()=>clearTimeout(timer); },[challenge]);
 const mode = modes[pathname] || 'login';
 if (authenticated && (mode === 'login' || mode === 'register')) return <Navigate to="/dashboard" replace/>;
 const email: Field = {name:'email',type:'email'};
 const password: Field = {name:'password',type:'password',minLength:mode === 'register' ? 8 : 1,maxLength:128};
 const fields: Field[] = challenge ? [{name:'code',type:useRecovery ? 'text' : 'codeCells',minLength:6,maxLength:useRecovery ? 64 : 6}] : mode === 'register' ? [{name:'user_name',minLength:3},email,password] : mode === 'login' ? [email,password] : mode === 'reset' ? [{name:'token',type:'hidden',initial:linkToken},{name:'new_password',type:'password',minLength:8,maxLength:128}] : mode === 'verify' ? [{name:'token',type:'hidden',initial:linkToken}] : [email];
 const recoveryLinks: Partial<Record<AuthKey, [string, AuthKey][]>> = {
  forgot: [['/reset-password', 'reset']],
  reset: [['/forgot-password', 'forgot']],
  verify: [['/resend-verification', 'resend']],
  resend: [['/verify-email', 'verify']],
 };
 return <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
 <Box component="header" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, px: { xs: 2.5, sm: 5 }, py: 2 }}>
  <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1.25}>
   <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center' }}><SwapHorizRounded /></Box>
   <Typography sx={{ fontFamily: '"Public Sans", sans-serif', fontWeight: 700, fontSize: 20 }} dir="ltr">EMS</Typography>
  </Stack>
  <LocaleControl compact />
 </Box>
 <Container component="main" maxWidth={false} sx={{ width: '100%', maxWidth: 440, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: { xs: 3, sm: 2 }, py: { xs: 4, sm: 7 } }}>
 <Stack spacing={3.5}>
 <Box>
  <Typography component="h1" variant="h4" sx={{ fontSize: { xs: '1.8rem', sm: '2.1rem' }, letterSpacing: 0, textWrap: 'balance', mb: 1.25 }}>{t(challenge ? 'challenge' : mode)}</Typography>
  <Typography color="text.secondary" sx={{ textWrap: 'pretty' }}>{t(challenge ? 'challengeHelp' : mode === 'login' ? 'loginHelp' : mode === 'register' ? 'registerHelp' : 'recoveryHelp')}</Typography>
 </Box>
 {expired && <Alert severity="warning">{t('expired')}</Alert>}
 <AuthForm key={`${pathname}-${challenge?.deadline || ''}-${useRecovery}`} fields={fields} terms={mode==='register'} footer={challenge ? <Button onClick={() => setUseRecovery(value => !value)}>{t(useRecovery ? 'useVerificationCode' : 'useRecoveryCode')}</Button> : mode === 'login' ? <MuiLink component={Link} to="/forgot-password" underline="hover" sx={{ alignSelf: 'flex-end', fontSize: '0.875rem', py: 0.5 }}>{t('forgot')}</MuiLink> : undefined} label={challenge ? 'submit' : mode} success={mode==='register'?'registered':mode==='forgot'||mode==='resend'?'emailSent':'done'} onSubmit={async data => {
  if (challenge) {
   if (Date.now() >= challenge.deadline) {setChallenge(undefined);setExpired(true);return;}
   try {acceptLogin(await auth.verifyChallenge(challenge.token,data.code));setChallenge(undefined);navigate('/dashboard',{replace:true});}
   catch (error) { if (error instanceof ApiError && error.status===401) {setChallenge(undefined);setExpired(true);} throw error; }
  } else if (mode==='login') {
   const result=await auth.login({email:data.email,password:data.password});
   if (result.requires_2fa) {
    if (!result.challenge_token || !result.expires_in || result.expires_in<=0) throw new ApiError(502,'Invalid authentication response');
    setUseRecovery(false);setExpired(false);setChallenge({token:result.challenge_token,deadline:Date.now()+result.expires_in*1000});
   } else {acceptLogin(result);navigate('/dashboard',{replace:true});}
  } else if (mode==='register') await auth.register({user_name:data.user_name,email:data.email,password:data.password,accept_terms:data.accept_terms==='on'});
  else if (mode==='forgot') await auth.forgot(data.email);
  else if (mode==='reset') await auth.reset(data.token,data.new_password);
  else if (mode==='verify') await auth.verifyEmail(data.token);
  else await auth.resendEmail(data.email);
 }}/>
 {challenge ? <Button onClick={()=>setChallenge(undefined)}>{t('cancel')}</Button> : (
  <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
   {mode === 'login' || mode === 'register' ? <Typography color="text.secondary" variant="body2" sx={{ textAlign: 'center' }}>
    {t(mode === 'login' ? 'newHere' : 'haveAccount')}{' '}
    <MuiLink component={Link} to={mode === 'login' ? '/register' : '/login'} underline="hover" sx={{ fontWeight: 600, display: 'inline-block', py: 1 }}>{t(mode === 'login' ? 'register' : 'login')}</MuiLink>
   </Typography> : <MuiLink component={Link} to="/login" underline="hover" sx={{ py: 1 }}>{t('backLogin')}</MuiLink>}
   {(recoveryLinks[mode] || []).map(([path, label]) => <MuiLink key={path} component={Link} to={path} underline="hover" variant="body2">{t(label)}</MuiLink>)}
   {mode === 'register' && <MuiLink component={Link} to="/resend-verification" underline="hover" variant="body2">{t('resend')}</MuiLink>}
  </Stack>
 )}
 </Stack></Container>
 <Box component="footer" sx={{ textAlign: 'center', px: 3, py: 3 }}><Typography variant="body2" color="text.secondary">{ui('title')}</Typography></Box>
 </Box>;
}
