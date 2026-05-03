import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { portalService } from '../../services/portalService'
import type { AbonoResponse } from '../../types'

const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const tipoLabel: Record<string, string> = {
  ValeTransporte: 'Vale Transporte',
  ValeAlimentacao: 'Vale Alimentação',
  PlanoSaude: 'Plano de Saúde',
  PlanoOdontologico: 'Plano Odontológico',
  Bonus: 'Bônus',
  ComissaoVendas: 'Comissão de Vendas',
  AdicionalNoturno: 'Adicional Noturno',
  HoraExtra: 'Hora Extra',
  Outros: 'Outros',
}

const tipoColor: Record<string, string> = {
  ValeTransporte: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  ValeAlimentacao: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  PlanoSaude: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  PlanoOdontologico: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  Bonus: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  ComissaoVendas: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  AdicionalNoturno: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  HoraExtra: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  Outros: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export function MeusBeneficios() {
  const [beneficios, setBeneficios] = useState<AbonoResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portalService.getBeneficios().then(setBeneficios).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (beneficios.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
      <Gift size={40} />
      <p>Nenhum benefício ativo no momento.</p>
    </div>
  )

  const total = beneficios.reduce((s, b) => s + b.valor, 0)

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Total em benefícios ativos</span>
        <span className="text-xl font-bold text-emerald-600">
          {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {beneficios.map(b => (
          <div
            key={b.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoColor[b.tipo] ?? tipoColor.Outros}`}>
                {tipoLabel[b.tipo] ?? b.tipo}
              </span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                {b.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            {b.descricao && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{b.descricao}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Referência: {meses[b.mesReferencia - 1]}/{b.anoReferencia}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
