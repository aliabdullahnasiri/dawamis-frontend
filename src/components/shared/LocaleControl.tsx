import { Button, Stack, Typography } from '@mui/material';
import { useLocale } from '../../i18n/locale';
import type { Locale } from '../../i18n/locale';
const languages: { value: Locale; label: string }[] = [
 { value: 'en', label: 'English' },
 { value: 'fa', label: 'دری' },
 { value: 'ps', label: 'پښتو' },
];
export default function LocaleControl({ compact = false }: { compact?: boolean }) {
 const { locale, setLocale, t } = useLocale();
 return <Stack spacing={2}>
  {!compact && <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{t('language')}</Typography>}
  <Stack direction="row" spacing={compact ? 0.5 : 1} role="group" aria-label={t('language')}>
   {languages.map(({value,label}) => <Button type="button" key={value} lang={value} aria-pressed={locale === value} variant={compact ? 'text' : locale === value ? 'contained' : 'outlined'} sx={compact ? { fontFamily: value === 'en' ? '"Public Sans", sans-serif' : value === 'fa' ? '"Vazirmatn", sans-serif' : '"Noto Naskh Arabic", serif', fontSize: value === 'en' ? '0.8125rem' : '1rem', minWidth: 52, minHeight: 44, px: 1.25, color: locale === value ? 'primary.main' : 'text.secondary', bgcolor: locale === value ? 'action.selected' : 'transparent' } : undefined} onClick={() => setLocale(value)}>{label}</Button>)}
  </Stack>
 </Stack>;
}
