import { useRef, useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../api/auth';
import { useAuthText } from './text';
export function SignOutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
 const t = useAuthText();
 const navigate = useNavigate();
 const lock = useRef(false);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState<string>();
 return <Dialog open={open} onClose={() => { if (!busy) onClose(); }} maxWidth="xs" fullWidth>
  <DialogTitle>{t('logout')}</DialogTitle><DialogContent><Typography variant="body2" color="text.secondary">{t('signOutHelp')}</Typography>{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}</DialogContent>
  <DialogActions sx={{ px: 3, pb: 2.5 }}><Button disabled={busy} onClick={onClose}>{t('cancel')}</Button><Button variant="contained" color="error" loading={busy} onClick={async () => {
   if (lock.current) return;
   lock.current = true; setBusy(true); setError(undefined);
   try { await auth.logout(); onClose(); navigate('/login', { replace: true }); }
   catch (failure) { setError(failure instanceof Error ? failure.message : t('retry')); }
   finally { lock.current = false; setBusy(false); }
  }}>{t('logout')}</Button></DialogActions>
 </Dialog>;
}
