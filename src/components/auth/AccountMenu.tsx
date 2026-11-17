import { useId, useState } from 'react';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { ChevronRightRounded, LogoutOutlined, PersonOutlined, ShieldOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '../../context/Session';
import { useLocale } from '../../i18n/locale';
import { fullName, initials } from './identity';
import { useAuthText } from './text';
import { SignOutDialog } from './SignOutDialog';

export function AccountMenu() {
 const { user } = useSession();
 const { direction } = useLocale();
 const { pathname } = useLocation();
 const t = useAuthText();
 const id = useId();
 const [anchor, setAnchor] = useState<HTMLElement | null>(null);
 const [signOut, setSignOut] = useState(false);
 const name = fullName(user);
 const avatarStyle = { fontWeight: 600, bgcolor: (theme: import('@mui/material/styles').Theme) => alpha(theme.palette.primary.main, .12), color: 'primary.main' };
 return <>
  <Tooltip title={t('accountMenu')}><IconButton aria-label={t('accountMenu')} aria-controls={anchor ? id : undefined} aria-haspopup="menu" aria-expanded={!!anchor} onClick={event => setAnchor(event.currentTarget)} sx={{ p: .5, minWidth: 44, minHeight: 44, borderRadius: '50%', outline: '2px solid', outlineColor: anchor ? 'primary.main' : 'transparent', outlineOffset: 2, transition: 'outline-color 150ms ease, transform 120ms ease, background-color 160ms ease', '@media (prefers-reduced-motion: reduce)': { transition: 'none' } }}><Avatar sx={{ ...avatarStyle, width: 36, height: 36, fontSize: 14 }}>{initials(name)}</Avatar></IconButton></Tooltip>
  <Menu id={id} anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'rtl' ? 'left' : 'right' }} transformOrigin={{ vertical: 'top', horizontal: direction === 'rtl' ? 'left' : 'right' }} slotProps={{ list: { sx: { py: 0 } }, paper: { sx: theme => ({
   mt: 1.5, width: 312, maxWidth: 'calc(100vw - 32px)', borderRadius: '18px', border: '1px solid',
   borderColor: alpha(theme.palette.text.primary, .1),
   boxShadow: theme.palette.mode === 'dark' ? '0 16px 48px rgb(0 0 0 / .4), 0 2px 8px rgb(0 0 0 / .2)' : '0 16px 48px rgb(15 23 42 / .12), 0 2px 8px rgb(15 23 42 / .05)',
   '& .MuiMenuItem-root': { minHeight: 50, mx: 1, my: .5, px: 1.5, gap: 1.5, borderRadius: '10px', fontSize: '.875rem', '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, .09), color: 'primary.main' }, '&.Mui-focusVisible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: -2 } },
   '& .MuiListItemIcon-root': { minWidth: 20, color: 'inherit', opacity: .75 },
  }) } }}>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2.5 }}>
    <Avatar sx={{ ...avatarStyle, width: 46, height: 46, fontSize: 17, borderRadius: '14px' }}>{initials(name)}</Avatar>
    <Box sx={{ minWidth: 0 }}><Typography sx={{ fontWeight: 600, fontSize: '.9375rem', lineHeight: 1.5, overflowWrap: 'anywhere' }}>{name}</Typography><Typography variant="body2" color="text.secondary" dir="auto" sx={{ overflowWrap: 'anywhere', fontSize: '.8125rem', mt: .25 }}>{user?.email}</Typography></Box>
   </Box>
   <Divider sx={{ mx: 2.5, mb: 1 }}/>
   {([{ path: '/profile', label: 'profile', icon: <PersonOutlined fontSize="small"/> }, { path: '/account/security', label: 'security', icon: <ShieldOutlined fontSize="small"/> }] as const).map(item => <MenuItem key={item.path} component={Link} to={item.path} selected={pathname === item.path} onClick={() => setAnchor(null)}>
    <ListItemIcon>{item.icon}</ListItemIcon><Typography component="span" sx={{ flex: 1, fontSize: 'inherit', fontWeight: pathname === item.path ? 600 : 500 }}>{t(item.label)}</Typography><ChevronRightRounded sx={{ fontSize: 18, opacity: .35, transform: direction === 'rtl' ? 'rotate(180deg)' : undefined }}/>
   </MenuItem>)}
   <Divider sx={{ mx: 2.5, mt: 1, mb: 1 }}/>
   <MenuItem onClick={() => { setAnchor(null); setSignOut(true); }} sx={{ color: 'error.main', mb: '8px !important', '&:hover': { bgcolor: theme => alpha(theme.palette.error.main, .08) } }}><ListItemIcon><LogoutOutlined fontSize="small"/></ListItemIcon><Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 500 }}>{t('logout')}</Typography></MenuItem>
  </Menu>
  <SignOutDialog open={signOut} onClose={() => setSignOut(false)}/>
 </>;
}
