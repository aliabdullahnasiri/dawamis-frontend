import { lazy } from 'react';
import { RouteSkeleton } from './components/shared/PageSkeleton';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { PageLoading } from './components/shared/PageLoading';
import './App.css';
const Dashboard = lazy(() => import('./layouts/Dashboard').then(module => ({ default: module.Dashboard })));
const AuthPage = lazy(() => import('./components/auth/AuthPage').then(module => ({ default: module.AuthPage })));
const MyProfile = lazy(() => import('./components/auth/MyProfile').then(module => ({ default: module.MyProfile })));
const AccountSecurity = lazy(() => import('./components/auth/AccountSecurity').then(module => ({ default: module.AccountSecurity })));
function App() { return <PageLoading><Routes>
 <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
 {['/login','/register','/forgot-password','/reset-password','/verify-email','/resend-verification'].map(path=><Route key={path} path={path} element={<RouteSkeleton key={path} kind="auth" pathname={path}><AuthPage key={path}/></RouteSkeleton>}/>)}
 <Route path="/profile" element={<RequireAuth><RouteSkeleton kind="profile"><MyProfile/></RouteSkeleton></RequireAuth>}/>
 <Route path="/account/profile" element={<Navigate to="/profile" replace/>}/>
 <Route path="/account/security" element={<RequireAuth><RouteSkeleton kind="security"><AccountSecurity/></RouteSkeleton></RequireAuth>}/>
 <Route path="/*" element={<RequireAuth><RouteSkeleton kind="dashboard"><Dashboard/></RouteSkeleton></RequireAuth>}/>
 </Routes></PageLoading>; }
export default App;
