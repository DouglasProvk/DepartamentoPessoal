import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, User, Gift, MessageSquare, PlusCircle } from 'lucide-react'

const links = [
  { to: '/portal', icon: LayoutDashboard, label: 'Início' },
  { to: '/portal/contracheques', icon: FileText, label: 'Meus Contracheques' },
  { to: '/portal/dados', icon: User, label: 'Meus Dados' },
  { to: '/portal/beneficios', icon: Gift, label: 'Meus Benefícios' },
  { to: '/portal/mensagens', icon: MessageSquare, label: 'Falar com RH' },
  { to: '/portal/solicitacoes', icon: PlusCircle, label: 'Solicitar Benefício' },
]

export function PortalSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Portal RH</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Área do Colaborador</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/portal'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
