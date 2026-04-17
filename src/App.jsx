import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Free from './pages/Free'
import Starter from './pages/Starter'
import Playbook from './pages/Playbook'
import Operator from './pages/Operator'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ResetPassword from './pages/ResetPassword'
import AuthCallback from './pages/AuthCallback'
import Upgrade from './pages/Upgrade'
import ZapierSetup from './pages/ZapierSetup'
import Verify from './pages/Verify'
import Registry from './pages/Registry'
import ProtectedRoute from './components/ProtectedRoute'
import Adonis from './components/Adonis'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user } = useAuth()
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/upgrade" element={<Upgrade />} />
        <Route path="/free" element={<ProtectedRoute requiredTier="free"><Free /></ProtectedRoute>} />
        <Route path="/starter" element={<ProtectedRoute requiredTier="starter"><Starter /></ProtectedRoute>} />
        <Route path="/playbook" element={<ProtectedRoute requiredTier="playbook"><Playbook /></ProtectedRoute>} />
        <Route path="/operator" element={<ProtectedRoute requiredTier="operator"><Operator /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/zapier-setup" element={<ProtectedRoute><ZapierSetup /></ProtectedRoute>} />
        <Route path="/verify/:credential_id" element={<Verify />} />
        <Route path="/registry" element={<Registry />} />
      </Routes>
      {user && <Adonis />}
    </>
  )
}
