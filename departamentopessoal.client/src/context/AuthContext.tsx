import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import api from '../services/api'

export type Perfil =
  | 'Administrador'
  | 'GestorRH'
  | 'AnalistaFolha'
  | 'Aprovador'
  | 'OperadorPonto'
  | 'Visualizador'

interface AuthUser {
  nome: string
  email: string
  perfil: Perfil
  expiracao: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  hasRole: (...roles: Perfil[]) => boolean
}

const AuthContext = createContext<AuthContextValue>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dp_token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('dp_user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem('dp_token', newToken)
    localStorage.setItem('dp_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
  }

  const logout = () => {
    localStorage.removeItem('dp_token')
    localStorage.removeItem('dp_user')
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common['Authorization']
  }

  const hasRole = (...roles: Perfil[]) =>
    user ? roles.includes(user.perfil) : false

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
