import { Outlet, useLocation } from 'react-router-dom'
import { PortalSidebar } from './PortalSidebar'
import { Header } from './Header'

const titles: Record<string, string> = {
  '/portal': 'Início',
  '/portal/contracheques': 'Meus Contracheques',
  '/portal/dados': 'Meus Dados',
  '/portal/beneficios': 'Meus Benefícios',
  '/portal/mensagens': 'Falar com RH',
  '/portal/solicitacoes': 'Solicitar Benefício',
}

export function PortalLayout() {
  const { pathname } = useLocation()
  const title = titles[pathname] ?? 'Portal do Colaborador'

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <PortalSidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
