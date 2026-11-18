import { Fragment, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useLocale } from '../../i18n/locale';

export const PAGE_LOADING_DELAY = 3000;
const FADE_DURATION = 300;

const quotes = [
 { en: 'Trust grows one promise at a time.', fa: 'اعتماد با هر وعده‌ای که به آن وفا می‌کنیم، بیشتر می‌شود.', ps: 'باور د هرې ژمنې په پوره کولو پیاوړی کېږي.' },
 { en: 'Good work begins with a clear mind.', fa: 'کار خوب با ذهن آرام آغاز می‌شود.', ps: 'ښه کار په ارام ذهن پیلېږي.' },
 { en: 'Small steps carry us far.', fa: 'گام‌های کوچک ما را به دوردست‌ها می‌رسانند.', ps: 'واړه ګامونه مو لرې رسوي.' },
 { en: 'Every detail deserves care.', fa: 'هر جزئیات ارزش دقت را دارد.', ps: 'هر کوچنی څه پام غواړي.' },
] as const;

export function PageSpinner({ leaving = false }: { leaving?: boolean }) {
 const { t, locale, direction } = useLocale();
 const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
 return <Box className="ems-page-loader" data-leaving={leaving} role="status" aria-label={t('loading')} dir={direction} sx={{
  transition: `opacity ${FADE_DURATION}ms ease-out`, opacity: leaving ? 0 : 1,
  position: 'fixed', inset: 0, zIndex: 'modal', display: 'grid', placeContent: 'center',
  justifyItems: 'center', px: 3, textAlign: 'center', bgcolor: 'background.default', color: 'text.primary',
 }}>
  <Box className="ems-loading-mark" aria-hidden="true">
   <span className="ems-loading-spinner"/>
   <img src="/favicon.svg" alt="" width="34" height="34"/>
  </Box>
  <Typography component="blockquote" lang={locale} sx={{
   m: 0, mt: 3, maxWidth: '28ch', textWrap: 'balance', fontWeight: 500,
   fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: direction === 'rtl' ? 1.75 : 1.35,
   letterSpacing: direction === 'rtl' ? 0 : '-.025em',
  }}>
   {quote[locale].split(' ').map((word, index) => (
    <Fragment key={`${locale}-${index}`}>
     {index > 0 && ' '}
     <span className="ems-quote-word" style={{ animationDelay: `${index * 65}ms` }}>{word}</span>
    </Fragment>
   ))}
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('loading')}</Typography>
 </Box>;
}

export function PageLoading({ children }: { children: ReactNode }) {
 const [phase, setPhase] = useState<'loading' | 'leaving' | 'ready'>('loading');
 useEffect(() => {
  const fade = window.setTimeout(() => setPhase('leaving'), PAGE_LOADING_DELAY - FADE_DURATION);
  const finish = window.setTimeout(() => setPhase('ready'), PAGE_LOADING_DELAY);
  return () => {
   window.clearTimeout(fade);
   window.clearTimeout(finish);
  };
 }, []);
 const pending = phase !== 'ready';
 return <Box aria-busy={pending}>
  {pending && <PageSpinner leaving={phase === 'leaving'}/>}
  {/* Requests start immediately. Keep controls inactive until the overlay clears. */}
  <Box hidden={phase === 'loading'} inert={pending} aria-hidden={pending}
   data-motion-page={phase === 'loading' ? 'pending' : 'ready'}>{children}</Box>
 </Box>;
}
