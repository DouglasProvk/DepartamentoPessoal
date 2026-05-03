import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface PrivateRouteProps {
  requiredRole?: 'admin' | 'colaborador'
}

export function PrivateRoute({ requiredRole }: PrivateRouteProps = {}) {
  const { token, user } = useAuth()

  if (!token) return <Navigate to="/login" replace />

  const isColaborador = user?.perfil === 'Colaborador'

  if (requiredRole === 'colaborador' && !isColaborador)
    return <Navigate to="/" replace />

  if (requiredRole === 'admin' && isColaborador)
    return <Navigate to="/portal" replace />

  // Sem requiredRole: colaborador vai pro portal, admin vai pro dashboard
  if (!requiredRole && isColaborador)
    return <Navigate to="/portal" replace />

  return <Outlet />
}
