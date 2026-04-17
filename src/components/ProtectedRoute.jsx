import { Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuth } from '../hooks/useAuth'
import { useTierAccess } from '../hooks/useTierAccess'

export default function ProtectedRoute({ children, requiredTier }) {
  const { user, profile, loading } = useAuth()
  const hasAccess = useTierAccess(profile, requiredTier)

  if (loading) {
    return (
      <div
        style={{ backgroundColor: '#111118', minHeight: '100vh' }}
        className="flex flex-col"
      >
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (requiredTier && !hasAccess) return <Navigate to="/upgrade" replace />

  return children
}
