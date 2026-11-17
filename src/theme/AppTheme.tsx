import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { useLocale } from '../i18n/locale';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/noto-naskh-arabic/400.css';
import '@fontsource/noto-naskh-arabic/500.css';
import '@fontsource/noto-naskh-arabic/600.css';
import '@fontsource/noto-naskh-arabic/700.css';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { useMaterialController } from "@/context/useMaterialController";
import { lightTheme, darkTheme } from "./theme";

interface AppThemeProps {
  children: React.ReactNode;
}

export function AppTheme({ children }: AppThemeProps) {
  const [controller] = useMaterialController();

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { direction, locale } = useLocale();
  const theme = useMemo(() => {
    const base = controller.darkMode ? darkTheme : lightTheme;
    const fontFamily = locale === 'fa' ? '"Vazirmatn", "Noto Naskh Arabic", sans-serif'
      : locale === 'ps' ? '"Noto Naskh Arabic", "Vazirmatn", serif'
      : '"Public Sans", "Vazirmatn", "Noto Naskh Arabic", sans-serif';
    // Override every variant: the base theme already resolved its font family.
    const variants = Object.fromEntries(Object.entries(base.typography)
      .filter(([, value]) => typeof value === 'object')
      .map(([key, value]) => [key, { ...value, fontFamily, ...(direction === 'rtl' ? { letterSpacing: 0, lineHeight: key.startsWith('h') ? 1.65 : 1.85 } : {}) }]));
    return createTheme(base, { direction, transitions: reducedMotion ? { duration: { shortest: 0, shorter: 0, short: 0, standard: 0, complex: 0, enteringScreen: 0, leavingScreen: 0 } } : base.transitions, typography: { ...variants, fontFamily }, components: {
      ...(reducedMotion ? { MuiDialog: { defaultProps: { transitionDuration: 0 } }, MuiMenu: { defaultProps: { transitionDuration: 0 } }, MuiPopover: { defaultProps: { transitionDuration: 0 } } } : {}),
      MuiCssBaseline: { styleOverrides: {
        body: { WebkitFontSmoothing: 'antialiased' },
        '[lang="fa"], [lang="fa-AF"]': { fontFamily: '"Vazirmatn", sans-serif' },
        '[lang="ps"], [lang="ps-AF"]': { fontFamily: '"Noto Naskh Arabic", serif' },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important', scrollBehavior: 'auto !important' },
        },
      } },
    } });
  }, [controller.darkMode, direction, locale, reducedMotion]);
  const cache = useMemo(() => createCache({ key: direction === 'rtl' ? 'ems-rtl' : 'ems', stylisPlugins: direction === 'rtl' ? [rtlPlugin] : undefined }), [direction]);

  return (
    <CacheProvider value={cache}><ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider></CacheProvider>
  );
}
