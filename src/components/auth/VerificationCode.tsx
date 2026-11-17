import { useId, useRef, useState } from 'react';
import { Box, FormHelperText, OutlinedInput, Typography } from '@mui/material';
import { useAuthText } from './text';

export function VerificationCode({ disabled, error, onChange }: { disabled: boolean; error?: string; onChange: () => void }) {
 const t = useAuthText();
 const id = useId();
 const inputs = useRef<(HTMLInputElement | null)[]>([]);
 const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
 const normalize = (value: string) => value.replace(/[۰-۹٠-٩]/g, char => String(char.charCodeAt(0) - (char >= '۰' ? 1776 : 1632))).replace(/\D/g, '');
 const update = (index: number, value: string) => {
  const text = normalize(value);
  const next = [...digits];
  if (!text) next[index] = '';
  else Array.from(text.slice(0, 6 - index)).forEach((digit, offset) => { next[index + offset] = digit; });
  setDigits(next); onChange();
  if (text) inputs.current[Math.min(index + text.length, 5)]?.focus();
 };
 return <Box role="group" aria-labelledby={`${id}-label`}>
  <Typography id={`${id}-label`} variant="body2" sx={{ mb: 1.5, fontWeight: 600 }}>{t('enterSetupCode')}</Typography>
  <input type="hidden" name="code" value={digits.join('')}/>
  <Box dir="ltr" sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: { xs: .75, sm: 1.25 } }}>
   {digits.map((digit, index) => <OutlinedInput key={index} value={digit} disabled={disabled} error={!!error}
    inputRef={(element: HTMLInputElement | null) => { inputs.current[index] = element; }}
    onChange={event => update(index, event.target.value)}
    onFocus={event => event.target.select()}
    onPaste={event => { event.preventDefault(); update(index, event.clipboardData.getData('text')); }}
    onKeyDown={event => {
     if (event.key === 'Backspace' && !digits[index] && index > 0) { event.preventDefault(); const next = [...digits]; next[index - 1] = ''; setDigits(next); onChange(); inputs.current[index - 1]?.focus(); }
     if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); inputs.current[Math.max(0, Math.min(5, index + (event.key === 'ArrowLeft' ? -1 : 1)))]?.focus(); }
    }}
    slotProps={{ input: { 'aria-label': index === 0 ? t('code') : t('codeDigit').replace('{count}', String(index + 1)), 'aria-describedby': error ? `${id}-error` : undefined, 'aria-invalid': !!error, inputMode: 'numeric', autoComplete: index === 0 ? 'one-time-code' : 'off', pattern: '[0-9]*' } }}
    sx={{ height: { xs: 54, sm: 62 }, borderRadius: '10px', '& input': { px: 0, textAlign: 'center', fontSize: '1.5rem', fontWeight: 600 }, bgcolor: digit ? 'action.selected' : 'transparent', transition: 'background-color 160ms ease, box-shadow 160ms ease', '&.Mui-focused': { boxShadow: theme => `0 0 0 3px ${theme.palette.primary.main}20` }, '& input:not([value=""])': { animation: 'code-pop 140ms ease-out' }, '@keyframes code-pop': { from: { transform: 'scale(.88)' }, to: { transform: 'scale(1)' } }, '@media (prefers-reduced-motion: reduce)': { transition: 'none', '& input': { animation: 'none !important' } } }}/>) }
  </Box>
  {error && <FormHelperText id={`${id}-error`} error role="alert">{error}</FormHelperText>}
 </Box>;
}
