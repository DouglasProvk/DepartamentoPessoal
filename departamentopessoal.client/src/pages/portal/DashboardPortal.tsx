import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, User, Gift, MessageSquare, PlusCircle, Clock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { portalService } from '../../services/portalService'
import type { ColaboradorResponse, SalarioResponse } from '../../types'

export function DashboardPortal() {
  const { user } = useAuth()
  const [colaborador, setColaborador] = useState<ColaboradorResponse | null>(null)
  const [ultimoContracheque, setUltimoContracheque] = useState<SalarioResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

  useEffect(() => {
    Promise.all([
      portalService.getMe(),
      portalService.getContracheques(),
    ]).then(([c, cs]) => {
      setColaborador(c)
      setUltimoContracheque(cs[0] ?? null)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const cards = [
    { to: '/portal/contracheques', icon: FileText, label: 'Meus Contracheques', color: 'emerald' },
    { to: '/portal/dados', icon: User, label: 'Meus Dados', color: 'blue' },
    { to: '/portal/beneficios', icon: Gift, label: 'Meus Benefícios', color: 'purple' },
    { to: '/portal/mensagens', icon: MessageSquare, label: 'Falar com RH', color: 'orange' },
    { to: '/portal/solicitacoes', icon: PlusCircle, label: 'Solicitar Benefício', color: 'pink' },
  ]

  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300',
    purple: 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300',
    orange: 'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300',
    pink: 'bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-900/20 dark:text-pink-300',
  }

  return (
    <div className="space-y-6">
      {/* Boas-vindas */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white">
        <p className="text-emerald-100 text-sm">Bem-vindo(a) ao seu portal,</p>
        <h1 className="text-2xl font-bold mt-1">{user?.nome}</h1>
        {colaborador && (
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-emerald-100">
            <span>{colaborador.cargo} · {colaborador.departamento}</span>
            <span>Matrícula: {colaborador.matricula}</span>
          </div>
        )}
      </div>

      {/* Último contracheque */}
      {ultimoContracheque && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" />
              <span className="font-semibold text-gray-800 dark:text-gray-100">Último Contracheque</span>
            </div>
            <Link
              to="/portal/contracheques"
              className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
            >
              Ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Competência</p>
              <p className="font-semibold">{meses[ultimoContracheque.mesReferencia - 1]}/{ultimoContracheque.anoReferencia}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Salário Bruto</p>
              <p className="font-semibold">{ultimoContracheque.valorBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Descontos</p>
              <p className="font-semibold text-red-600">{(ultimoContracheque.inss + ultimoContracheque.irrf + ultimoContracheque.outrosDescontos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Líquido</p>
              <p className="font-semibold text-emerald-600">{ultimoContracheque.valorLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${
              ultimoContracheque.pago
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {ultimoContracheque.pago ? 'Pago' : 'Aguardando Pagamento'}
            </span>
          </div>
        </div>
      )}

      {/* Menu de atalhos */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Acesso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cards.map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-colors ${colorMap[color]}`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
