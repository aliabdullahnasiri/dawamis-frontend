import { useEffect, useId, useState } from 'react';
import { AppBar, Box, Breadcrumbs, Button, Divider, IconButton, Link as MuiLink, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { CheckRounded, DarkModeOutlined, DashboardOutlined, FullscreenExitRounded, FullscreenRounded, LanguageOutlined, LightModeOutlined, MenuRounded, PersonOutlined, SearchRounded, SettingsOutlined, ShieldOutlined } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { SpotlightSearch } from '@/components/shared/SpotlightSearch';
import { AccountMenu } from '@/components/auth/AccountMenu';
import { useAuthText } from '@/components/auth/text';
import { useLocale } from '@/i18n/locale';
import { useMaterialController } from '@/context/useMaterialController';
import { setDarkMode, setOpenConfigurator, setOpenSidenav } from '@/context/materialActions';
import { useSession } from '@/context/Session';
import { routes } from '@/constants/routes';
import type { RouteItem } from '@/constants/routes';

const languages = [{ value: 'en', label: 'English' }, { value: 'fa', label: 'دری' }, { value: 'ps', label: 'پښتو' }] as const;
function flatten(items: RouteItem[]): RouteItem[] { return items.flatMap(item => [item, ...flatten(item.children || [])]); }

export default function Navbar() {
 const { t, locale, setLocale } = useLocale();
 const text = useAuthText();
 const [controller, dispatch] = useMaterialController();
 const { openSidenav, darkMode, fixedNavbar } = controller;
 const { context } = useSession();
 const { pathname } = useLocation();
 const languageId = useId();
 const [languageAnchor, setLanguageAnchor] = useState<HTMLElement | null>(null);
 const [searchOpen, setSearchOpen] = useState(false);
 const [fullscreen, setFullscreen] = useState(false);
 const navigation = [
  { path: '/dashboard', label: t('dashboard'), icon: DashboardOutlined },
  ...flatten(routes.flatMap(group => group.pages)).filter(item => item.path && item.path !== '/dashboard' && (!item.permission || context?.permissions?.includes(item.permission))).map(item => ({ path: item.path!, label: item.label, icon: item.icon })),
  { path: '/profile', label: text('profile'), icon: PersonOutlined },
  { path: '/account/security', label: text('security'), icon: ShieldOutlined },
 ];
 const current = navigation.find(item => item.path === pathname)?.label || t('dashboard');
 const closeSearch = () => setSearchOpen(false);
 const openSearch = () => setSearchOpen(true);
 useEffect(() => {
  const keyboard = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value); } };
  const changed = () => setFullscreen(!!document.fullscreenElement);
  document.addEventListener('keydown', keyboard); document.addEventListener('fullscreenchange', changed);
  return () => { document.removeEventListener('keydown', keyboard); document.removeEventListener('fullscreenchange', changed); };
 }, []);
 const iconStyle = { width: 42, height: 42, color: 'text.secondary', flexShrink: 0 };
 return <>
  <AppBar position={fixedNavbar ? 'sticky' : 'relative'} elevation={0} sx={theme => ({ top: fixedNavbar ? 16 : undefined, color: 'text.primary', borderRadius: '14px', bgcolor: fixedNavbar ? alpha(theme.palette.background.paper, .94) : 'background.paper', border: 1, borderColor: 'divider', mb: 3, ...(fixedNavbar ? { backdropFilter: 'blur(12px)' } : {}) })}>
   <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, px: { xs: 1, sm: 2 }, gap: { xs: .5, sm: 1.5 }, justifyContent: 'space-between' }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
     <Box sx={{ minWidth: 0, display: { xs: 'none', sm: 'block' } }}><Breadcrumbs aria-label={t('dashboard')} sx={{ fontSize: '.75rem', '& .MuiBreadcrumbs-separator': { mx: .75 } }}><MuiLink component={Link} to="/dashboard" underline="hover" color="text.secondary">EMS</MuiLink><Typography variant="caption" color="text.secondary" aria-current="page">{current}</Typography></Breadcrumbs><Typography sx={{ fontSize: '.9375rem', fontWeight: 600 }} noWrap>{current}</Typography></Box>
    </Stack>
    <Button onClick={openSearch} aria-label={text('findPage')} startIcon={<SearchRounded/>} sx={{ display: { xs: 'none', lg: 'flex' }, width: 260, justifyContent: 'flex-start', color: 'text.secondary', bgcolor: 'action.hover', border: 1, borderColor: 'divider', minHeight: 40, fontWeight: 400, mx: 1 }}><Box component="span" sx={{ flex: 1, textAlign: 'start' }}>{text('findPage')}</Box><Box component="kbd" dir="ltr" sx={{ font: 'inherit', fontSize: 11, border: 1, borderColor: 'divider', borderRadius: 1, px: .75 }}>{typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K'}</Box></Button>
    <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 0, sm: .5 } }}>
     <Tooltip title={text('findPage')}><IconButton onClick={openSearch} aria-label={text('findPage')} sx={{ ...iconStyle, display: { lg: 'none' } }}><SearchRounded/></IconButton></Tooltip>
     <Tooltip title={text(darkMode ? 'lightTheme' : 'darkTheme')}><IconButton aria-label={text(darkMode ? 'lightTheme' : 'darkTheme')} onClick={() => setDarkMode(dispatch, !darkMode)} sx={iconStyle}>{darkMode ? <LightModeOutlined fontSize="small"/> : <DarkModeOutlined fontSize="small"/>}</IconButton></Tooltip>
     <Tooltip title={t('language')}><IconButton aria-label={t('language')} aria-haspopup="menu" aria-expanded={!!languageAnchor} aria-controls={languageAnchor ? languageId : undefined} onClick={event => setLanguageAnchor(event.currentTarget)} sx={iconStyle}><LanguageOutlined fontSize="small"/></IconButton></Tooltip>
     <Tooltip title={t('settings')}><IconButton aria-label={t('settings')} onClick={() => setOpenConfigurator(dispatch, true)} sx={iconStyle}><SettingsOutlined fontSize="small"/></IconButton></Tooltip>
     {typeof document !== 'undefined' && document.fullscreenEnabled && <Tooltip title={text(fullscreen ? 'exitFullscreen' : 'enterFullscreen')}><IconButton aria-label={text(fullscreen ? 'exitFullscreen' : 'enterFullscreen')} onClick={() => { const operation = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); void operation.catch(() => {}); }} sx={{ ...iconStyle, display: { xs: 'none', md: 'inline-flex' } }}>{fullscreen ? <FullscreenExitRounded/> : <FullscreenRounded/>}</IconButton></Tooltip>}
     <Tooltip title={text(openSidenav ? 'closeNavigation' : 'openNavigation')}><IconButton aria-label={text(openSidenav ? 'closeNavigation' : 'openNavigation')} aria-expanded={openSidenav} onClick={() => setOpenSidenav(dispatch, !openSidenav)} sx={iconStyle}><MenuRounded/></IconButton></Tooltip>
     <Divider orientation="vertical" flexItem sx={{ mx: .5, my: 1 }}/><AccountMenu/>
    </Stack>
   </Toolbar>
  </AppBar>
  <Menu id={languageId} anchorEl={languageAnchor} open={!!languageAnchor} onClose={() => setLanguageAnchor(null)} slotProps={{ paper: { sx: { minWidth: 170, mt: 1, border: 1, borderColor: 'divider' } } }}>{languages.map(language => <MenuItem key={language.value} lang={language.value} selected={locale === language.value} onClick={() => { setLocale(language.value); setLanguageAnchor(null); }} sx={{ minHeight: 46, gap: 2 }}><Typography sx={{ flex: 1 }}>{language.label}</Typography>{locale === language.value && <CheckRounded fontSize="small" color="primary"/>}</MenuItem>)}</Menu>
  {searchOpen && <SpotlightSearch pages={navigation} onClose={closeSearch}/>}
 </>;
}
