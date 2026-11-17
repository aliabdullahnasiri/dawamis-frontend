import { useEffect, useId, useRef, useState } from 'react';
import type { ElementType } from 'react';
import { Box, Dialog, Divider, InputBase, List, ListItemButton, Typography } from '@mui/material';
import { ArrowForwardRounded, SearchRounded, SubdirectoryArrowLeftRounded } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuthText } from '../auth/text';
import { useLocale } from '../../i18n/locale';

type SearchPage = { path: string; label: string; icon: ElementType };
export function SpotlightSearch({ pages, onClose }: { pages: SearchPage[]; onClose: () => void }) {
 const text = useAuthText();
 const { t, direction } = useLocale();
 const navigate = useNavigate();
 const id = useId();
 const input = useRef<HTMLInputElement>(null);
 const [query, setQuery] = useState('');
 const [active, setActive] = useState(0);
 const normalized = query.trim().toLocaleLowerCase();
 const matches = pages.filter(page => page.label.toLocaleLowerCase().includes(normalized) || page.path.includes(normalized));
 const index = Math.min(active, Math.max(0, matches.length - 1));
 const selectedId = matches.length ? `${id}-option-${index}` : undefined;
 const openPage = (page: SearchPage) => { navigate(page.path); onClose(); };
 useEffect(() => { if (selectedId) document.getElementById(selectedId)?.scrollIntoView?.({ block: 'nearest' }); }, [selectedId]);
 const keyStyle = { fontFamily: 'inherit', fontSize: 11, px: .6, py: .2, minWidth: 22, textAlign: 'center', border: 1, borderColor: 'divider', borderRadius: '5px', lineHeight: 1.4 };
 return <Dialog open onClose={onClose} aria-label={text('navigationSearch')} fullWidth maxWidth="sm" slotProps={{
  transition: { onEntered: () => input.current?.focus() },
  backdrop: { sx: { bgcolor: 'rgb(0 0 0 / .28)', backdropFilter: 'blur(5px)', '@media (prefers-reduced-motion: reduce)': { transition: 'none !important' } } },
  container: { sx: { alignItems: 'flex-start', pt: { xs: '10vh', sm: '17vh' } } },
  paper: { sx: theme => ({ m: 2, mt: 0, borderRadius: '18px', maxHeight: 'min(580px, 75dvh)', border: '1px solid', borderColor: alpha(theme.palette.text.primary, .12), bgcolor: 'background.paper', boxShadow: theme.palette.mode === 'dark' ? '0 24px 80px rgb(0 0 0 / .55), 0 0 0 1px rgb(255 255 255 / .04)' : '0 24px 80px rgb(15 23 42 / .22), 0 4px 12px rgb(15 23 42 / .06)', '@supports (backdrop-filter: blur(24px))': { bgcolor: alpha(theme.palette.background.paper, .9), backdropFilter: 'blur(24px) saturate(150%)' } }) },
 }}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, px: { xs: 2, sm: 3 }, py: 2.25 }}>
   <SearchRounded sx={{ color: 'text.secondary', fontSize: 28, flexShrink: 0 }}/>
   <InputBase inputRef={input} fullWidth placeholder={text('findPage')} value={query} onChange={event => { setQuery(event.target.value); setActive(0); }} onKeyDown={event => {
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && matches.length) { event.preventDefault(); setActive((index + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length); }
    if (event.key === 'Enter' && matches.length) { event.preventDefault(); openPage(matches[index]); }
   }} inputProps={{ role: 'combobox', 'aria-label': text('navigationSearch'), 'aria-expanded': true, 'aria-autocomplete': 'list', 'aria-controls': `${id}-results`, 'aria-activedescendant': selectedId, autoComplete: 'off', spellCheck: false }} sx={{ fontSize: { xs: 19, sm: 23 }, fontWeight: 400, letterSpacing: '-.02em', '& input': { p: 0, height: 36, '&::placeholder': { opacity: .6 } } }}/>
   <Box component="button" type="button" onClick={onClose} aria-label={t('close')} sx={{ ...keyStyle, bgcolor: 'transparent', color: 'text.secondary', cursor: 'pointer', minHeight: 32, minWidth: 36, flexShrink: 0 }}>esc</Box>
  </Box>
  <Divider/>
  <Box sx={{ overflowY: 'auto', minHeight: 100, p: 1 }}>
   <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 1.75, pt: .75, pb: .5, fontWeight: 500 }}>{text('searchPages')}</Typography>
   <List id={`${id}-results`} role="listbox" aria-label={text('quickNavigation')} disablePadding>
    {matches.map((page, itemIndex) => <ListItemButton key={page.path} id={`${id}-option-${itemIndex}`} role="option" aria-selected={itemIndex === index} tabIndex={-1} selected={itemIndex === index} onMouseMove={() => setActive(itemIndex)} onMouseDown={event => event.preventDefault()} onClick={() => openPage(page)} sx={{ borderRadius: '10px', px: 1.75, py: 1.25, gap: 1.5, minHeight: 58, '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }}>
     <Box sx={{ width: 34, height: 34, display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: '9px', bgcolor: itemIndex === index ? 'rgb(255 255 255 / .15)' : 'action.hover', color: itemIndex === index ? 'inherit' : 'text.secondary' }}><page.icon fontSize="small"/></Box>
     <Typography sx={{ flex: 1, fontSize: '.9375rem', fontWeight: 500 }}>{page.label}</Typography>
     {itemIndex === index ? <SubdirectoryArrowLeftRounded sx={{ fontSize: 19, opacity: .8, transform: direction === 'rtl' ? 'scaleX(-1)' : undefined }}/> : <ArrowForwardRounded sx={{ fontSize: 16, opacity: .3, transform: direction === 'rtl' ? 'rotate(180deg)' : undefined }}/>}
    </ListItemButton>)}
   </List>
   {matches.length === 0 && <Typography role="status" color="text.secondary" sx={{ p: 3, textAlign: 'center', fontSize: '.875rem' }}>{text('noPages')}</Typography>}
  </Box>
  <Divider/>
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2.75, py: 1.25, bgcolor: 'action.hover' }}>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: .75, color: 'text.secondary' }}><Box component="kbd" sx={keyStyle}>↑↓</Box><Typography variant="caption">{text('navigateResults')}</Typography></Box>
   <Box sx={{ display: 'flex', alignItems: 'center', gap: .75, color: 'text.secondary' }}><Box component="kbd" sx={keyStyle}>↵</Box><Typography variant="caption">{text('openResult')}</Typography></Box>
  </Box>
 </Dialog>;
}
