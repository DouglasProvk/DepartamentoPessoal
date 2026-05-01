import { Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const perfilBadge: Record<string, string> = {
  Administrador: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  GestorRH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  AnalistaFolha: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Aprovador: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  OperadorPonto: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Visualizador: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const perfilLabel: Record<string, string> = {
  Administrador: 'Administrador',
  GestorRH: 'Gestor RH',
  AnalistaFolha: 'Analista de Folha',
  Aprovador: 'Aprovador',
  OperadorPonto: 'Operador de Ponto',
  Visualizador: 'Visualizador',
}

export function Header({ title }: { title: string }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h2>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{user.nome}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${perfilBadge[user.perfil] ?? ''}`}>
              {perfilLabel[user.perfil] ?? user.perfil}
            </span>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Alternar tema"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  )
}
