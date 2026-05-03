import { useEffect, useState } from 'react'
import { PlusCircle, Clock } from 'lucide-react'
import { portalService } from '../../services/portalService'
import type { SolicitacaoBeneficioResponse } from '../../types'

const tiposDisponiveis = [
  { value: 'ValeTransporte', label: 'Vale Transporte' },
  { value: 'ValeAlimentacao', label: 'Vale Alimentação' },
  { value: 'PlanoSaude', label: 'Plano de Saúde' },
  { value: 'PlanoOdontologico', label: 'Plano Odontológico' },
  { value: 'Bonus', label: 'Bônus' },
  { value: 'HoraExtra', label: 'Hora Extra' },
  { value: 'AdicionalNoturno', label: 'Adicional Noturno' },
  { value: 'Outros', label: 'Outros' },
]

const statusColor: Record<string, string> = {
  Pendente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Aprovada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Negada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function SolicitarBeneficio() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoBeneficioResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [tipo, setTipo] = useState('ValeTransporte')
  const [descricao, setDescricao] = useState('')
  const [enviando, setEnviando] = useState(false)

  const carregar = () =>
    portalService.getSolicitacoes().then(setSolicitacoes).finally(() => setLoading(false))

  useEffect(() => { carregar() }, [])

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!descricao.trim()) return
    setEnviando(true)
    try {
      await portalService.criarSolicitacao({ tipoBeneficio: tipo, descricao })
      setDescricao('')
      setTipo('ValeTransporte')
      setMostrarForm(false)
      await carregar()
    } finally {
      setEnviando(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Solicite novos benefícios. O RH analisará e responderá sua solicitação.
        </p>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle size={15} />
          Nova Solicitação
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleEnviar} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Nova Solicitação de Benefício</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Benefício</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {tiposDisponiveis.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Justificativa / Descrição</label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Explique o motivo da solicitação..."
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setMostrarForm(false)}
              className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
              Cancelar
            </button>
            <button type="submit" disabled={enviando}
              className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
              <PlusCircle size={15} />
              {enviando ? 'Enviando...' : 'Solicitar'}
            </button>
          </div>
        </form>
      )}

      {solicitacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
          <Clock size={36} />
          <p>Nenhuma solicitação ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {solicitacoes.map(s => (
            <div key={s.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{s.tipoBeneficioDescricao}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[s.statusDescricao] ?? ''}`}>
                  {s.statusDescricao}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{s.descricao}</p>
              {s.observacaoRH && (
                <div className="mt-3 pl-4 border-l-2 border-blue-400">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Observação do RH:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{s.observacaoRH}</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Solicitado em {new Date(s.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
