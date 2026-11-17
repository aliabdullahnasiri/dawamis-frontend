import { Avatar, Box, Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from '@mui/material';
import { ArrowForwardRounded, BusinessOutlined, ChevronRightRounded, PersonOutlined, ShieldOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useAuthText } from '../auth/text';
import { fullName, initials } from '../auth/identity';
import { useLocale } from '../../i18n/locale';
import { useSession } from '../../context/Session';
import { RequestState } from './Contracts';

export function ShellHome() {
 const { t, direction } = useLocale();
 const text = useAuthText();
 const { user, context, loading, error, contextError } = useSession();
 const name = fullName(user);
 const needsProfile = !user?.first_name?.trim() || !user?.last_name?.trim();
 return <Stack spacing={3.5} sx={{ width: '100%', minWidth: 0 }}>
  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
   <Box><Typography component="h1" variant="h4">{t('dashboard')}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: .75, maxWidth: 560 }}>{text('workspaceHelp')}</Typography></Box>
   <Button component={Link} to={needsProfile ? '/profile' : '/account/security'} variant="contained" endIcon={<ArrowForwardRounded sx={{ transform: direction === 'rtl' ? 'rotate(180deg)' : undefined }}/>} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, flexShrink: 0, minHeight: 44, '& .MuiButton-endIcon': { transition: 'transform 150ms ease' }, '&:hover .MuiButton-endIcon': { transform: direction === 'rtl' ? 'translateX(-3px)' : 'translateX(3px)' }, '@media (prefers-reduced-motion: reduce)': { '& .MuiButton-endIcon': { transition: 'none' }, '&:hover .MuiButton-endIcon': { transform: 'none' } } }}>{text(needsProfile ? 'completeProfile' : 'reviewSecurity')}</Button>
  </Stack>
  <RequestState loading={loading} error={error}/>
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(12, minmax(0, 1fr))' }, '& > :nth-of-type(1)': { gridColumn: { xs: '1 / -1', md: 'span 8' } }, '& > :nth-of-type(2)': { gridColumn: { xs: '1 / -1', md: 'span 4' } }, gap: 3, alignItems: 'start' }}>
   <Paper data-motion-panel><Stack direction="row" spacing={2} sx={{ p: 3, alignItems: 'center' }}><Avatar sx={{ width: 52, height: 52, borderRadius: '16px', fontSize: 18, fontWeight: 600, bgcolor: theme => alpha(theme.palette.primary.main, .1), color: 'primary.main' }}>{initials(name)}</Avatar><Box sx={{ minWidth: 0 }}><Typography component="h2" variant="h6" sx={{ overflowWrap: 'anywhere' }}>{name || text('accountDetails')}</Typography><Typography variant="body2" color="text.secondary" dir="auto" sx={{ overflowWrap: 'anywhere', mt: .25 }}>{user?.email}</Typography></Box></Stack><Divider/>
    <List disablePadding sx={{ p: 1 }}>{([{ path: '/profile', title: 'profile', help: 'profileHelp', icon: <PersonOutlined/> }, { path: '/account/security', title: 'security', help: 'manageSecurity', icon: <ShieldOutlined/> }] as const).map(item => <ListItemButton key={item.path} component={Link} to={item.path} sx={{ borderRadius: '10px', py: 1.75, gap: .5 }}><ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{item.icon}</ListItemIcon><ListItemText primary={text(item.title)} secondary={text(item.help)} slotProps={{ primary: { sx: { fontWeight: 600, fontSize: '.9375rem' } }, secondary: { sx: { mt: .5, lineHeight: 1.6 } } }}/><ChevronRightRounded sx={{ color: 'text.disabled', fontSize: 20, transform: direction === 'rtl' ? 'rotate(180deg)' : undefined }}/></ListItemButton>)}</List>
   </Paper>
   <Paper data-motion-panel sx={{ p: 3 }}><Stack spacing={2}><Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}><BusinessOutlined sx={{ color: 'text.secondary' }}/><Typography component="h2" variant="h6">{text('workspaceAccess')}</Typography></Stack>
    {context ? <><Typography sx={{ fontWeight: 600 }}>{text('organizationNumber').replace('{id}', String(context.organization_id))}</Typography><Typography variant="body2" color="text.secondary">{text('workspaceConnected')}</Typography></> : <><Typography variant="body2" color="text.secondary">{text('noOrg')}</Typography>{contextError != null && <RequestState error={contextError}/>}</>}
    <Divider/><Typography variant="caption" color="text.secondary">{text('financialToolsPending')}</Typography>
   </Stack></Paper>
  </Box>
 </Stack>;
}
