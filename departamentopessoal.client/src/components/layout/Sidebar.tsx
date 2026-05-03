import { NavLink } from 'react-router-dom'
import { Users, DollarSign, Gift, Clock, LayoutDashboard, ShieldCheck, MessageSquare } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/colaboradores', icon: Users, label: 'Colaboradores' },
  { to: '/salarios', icon: DollarSign, label: 'Salários' },
  { to: '/abonos', icon: Gift, label: 'Abonos' },
  { to: '/ponto', icon: Clock, label: 'Ponto' },
]

const navClass = (isActive: boolean) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
  }`

export function Sidebar() {
  const { hasRole } = useAuth()

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DP Sistema</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Departamento Pessoal</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => navClass(isActive)}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {hasRole('Administrador', 'GestorRH', 'AnalistaFolha') && (
          <NavLink to="/mensagensrh" className={({ isActive }) => navClass(isActive)}>
            <MessageSquare size={18} />
            Mensagens RH
          </NavLink>
        )}

        {hasRole('Administrador') && (
          <NavLink to="/usuarios" className={({ isActive }) => navClass(isActive)}>
            <ShieldCheck size={18} />
            Usuários
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
