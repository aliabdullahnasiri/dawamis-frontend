import type { InputHTMLAttributes, ReactNode } from 'react';
import { InputAdornment, TextField } from '@mui/material';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'color'> & {
 label: string;
 error?: string;
 helperText?: string;
 endAdornment?: ReactNode;
};

/** Outlined field with a label that floats on focus or when filled. */
export default function FormInput({ label, error, helperText, endAdornment, minLength, maxLength, dir, spellCheck, autoCapitalize, readOnly, ...props }: Props) {
 return <TextField {...props} fullWidth variant="outlined" label={label} error={!!error} helperText={error || helperText}
  slotProps={{
   htmlInput: { minLength, maxLength, dir, spellCheck, autoCapitalize, readOnly },
   input: endAdornment ? { endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment> } : undefined,
   formHelperText: { role: error ? 'alert' : undefined },
  }}
  sx={{ '& .MuiOutlinedInput-root': { minHeight: 54, borderRadius: '10px' }, '& .MuiInputLabel-asterisk': { display: 'none' } }}/ >;
}
