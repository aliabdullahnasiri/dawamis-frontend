import type { ReactNode } from 'react';
import { Alert, Button, Container, Stack } from '@mui/material';
import { PageSkeleton } from '../shared/PageSkeleton';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../context/Session';
import { useAuthText } from './text';
import { setTokens } from '../../api/client';
export function RequireAuth({children}:{children:ReactNode}) {
 const { pathname } = useLocation();
 const {authenticated,user,loading,error,reload}=useSession(); const t=useAuthText();
 if (!authenticated) return <Navigate to="/login" replace/>;
 if (loading) return <PageSkeleton kind={pathname === '/profile' ? 'profile' : pathname === '/account/security' ? 'security' : 'dashboard'}/>;
 if (error || !user) return <Container><Stack spacing={2}><Alert severity="error">{error instanceof Error?error.message:t('retry')}</Alert><Button onClick={reload}>{t('retry')}</Button><Button onClick={()=>setTokens()}>{t('logout')}</Button></Stack></Container>;
 return children;
}
