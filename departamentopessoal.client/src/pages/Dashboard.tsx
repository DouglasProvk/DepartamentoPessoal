import { useEffect, useState } from 'react'
import { Users, DollarSign, Gift, Clock } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { colaboradorService } from '../services/colaboradorService'

export function Dashboard() {
  const [total, setTotal] = useState(0)
  const [ativos, setAtivos] = useState(0)

  useEffect(() => {
    colaboradorService.getAll().then(data => {
      setTotal(data.length)
      setAtivos(data.filter(c => c.status === 'Ativo').length)
    })
  }, [])

  const stats = [
    { label: 'Total de Colaboradores', value: total, icon: Users, color: 'text-blue-500' },
    { label: 'Colaboradores Ativos', value: ativos, icon: Users, color: 'text-green-500' },
    { label: 'Módulo Salários', value: 'Disponível', icon: DollarSign, color: 'text-yellow-500' },
    { label: 'Controle de Ponto', value: 'Disponível', icon: Clock, color: 'text-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Bem-vindo ao DP Sistema</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gestão completa de colaboradores e folha de pagamento</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-4">
              <s.icon className={`${s.color} shrink-0`} size={28} />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{s.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Acesso Rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Novo Colaborador', href: '/colaboradores/novo', icon: Users },
            { label: 'Lançar Salário', href: '/salarios', icon: DollarSign },
            { label: 'Lançar Abono', href: '/abonos', icon: Gift },
            { label: 'Registrar Ponto', href: '/ponto', icon: Clock },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <item.icon size={22} className="text-blue-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
