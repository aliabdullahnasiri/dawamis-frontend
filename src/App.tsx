import { Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './layouts/Dashboard';
import { AuthPage } from './components/auth/AuthPage';
import { MyProfile } from './components/auth/MyProfile';
import { AccountSecurity } from './components/auth/AccountSecurity';
import { RequireAuth } from './components/auth/RequireAuth';
import { PageLoading } from './components/shared/PageLoading';
import './App.css';
function App() { return <Routes>
 <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
 {['/login','/register','/forgot-password','/reset-password','/verify-email','/resend-verification'].map(path=><Route key={path} path={path} element={<PageLoading kind="auth"><AuthPage key={path}/></PageLoading>}/>)}
 <Route path="/profile" element={<RequireAuth><PageLoading kind="profile"><MyProfile/></PageLoading></RequireAuth>}/>
 <Route path="/account/profile" element={<Navigate to="/profile" replace/>}/>
 <Route path="/account/security" element={<RequireAuth><PageLoading kind="security"><AccountSecurity/></PageLoading></RequireAuth>}/>
 <Route path="/*" element={<RequireAuth><Dashboard/></RequireAuth>}/>
 </Routes>; }
export default App;
