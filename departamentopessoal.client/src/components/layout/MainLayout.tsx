import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/colaboradores': 'Colaboradores',
  '/salarios': 'Salários',
  '/abonos': 'Abonos',
  '/ponto': 'Ponto Eletrônico',
}

export function MainLayout() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = titles[base] ?? 'DP Sistema'

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
