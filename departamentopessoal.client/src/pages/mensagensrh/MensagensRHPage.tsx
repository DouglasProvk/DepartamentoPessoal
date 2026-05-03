import { useEffect, useState } from 'react'
import { MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { mensagensRHService } from '../../services/mensagensRHService'
import type { MensagemRHResponse, SolicitacaoBeneficioResponse } from '../../types'

const statusColor: Record<string, string> = {
  Aberta: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Respondida: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Fechada: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Pendente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Aprovada: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Negada: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export function MensagensRHPage() {
  const [aba, setAba] = useState<'mensagens' | 'solicitacoes'>('mensagens')
  const [mensagens, setMensagens] = useState<MensagemRHResponse[]>([])
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoBeneficioResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [respostaAberta, setRespostaAberta] = useState<number | null>(null)
  const [resposta, setResposta] = useState('')
  const [solAberta, setSolAberta] = useState<number | null>(null)
  const [novaSolStatus, setNovaSolStatus] = useState('Aprovada')
  const [observacaoRH, setObservacaoRH] = useState('')
  const [salvando, setSalvando] = useState(false)

  const carregar = async () => {
    setLoading(true)
    const [m, s] = await Promise.all([
      mensagensRHService.getMensagens(),
      mensagensRHService.getSolicitacoes(),
    ])
    setMensagens(m)
    setSolicitacoes(s)
    setLoading(false)
  }

  useEffect(() => { carregar() }, [])

  const handleResponder = async (id: number) => {
    if (!resposta.trim()) return
    setSalvando(true)
    await mensagensRHService.responder(id, resposta)
    setRespostaAberta(null)
    setResposta('')
    await carregar()
    setSalvando(false)
  }

  const handleAtualizarSolicitacao = async (id: number) => {
    setSalvando(true)
    await mensagensRHService.atualizarSolicitacao(id, { status: novaSolStatus, observacaoRH })
    setSolAberta(null)
    setObservacaoRH('')
    await carregar()
    setSalvando(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const abertas = mensagens.filter(m => m.statusDescricao === 'Aberta').length
  const pendentes = solicitacoes.filter(s => s.statusDescricao === 'Pendente').length

  return (
    <div className="space-y-4">
      {/* Abas */}
      <div className="flex gap-2">
        <button
          onClick={() => setAba('mensagens')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aba === 'mensagens'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <MessageSquare size={16} />
          Mensagens
          {abertas > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {abertas}
            </span>
          )}
        </button>
        <button
          onClick={() => setAba('solicitacoes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aba === 'solicitacoes'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
        >
          <Clock size={16} />
          Solicitações de Benefício
          {pendentes > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendentes}
            </span>
          )}
        </button>
      </div>

      {/* Mensagens */}
      {aba === 'mensagens' && (
        mensagens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
            <MessageSquare size={36} />
            <p>Nenhuma mensagem de colaboradores.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mensagens.map(m => (
              <div key={m.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{m.assunto}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.colaboradorNome} · {new Date(m.criadoEm).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[m.statusDescricao] ?? ''}`}>
                    {m.statusDescricao}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{m.mensagem}</p>

                {m.resposta && (
                  <div className="mt-3 pl-4 border-l-2 border-emerald-400">
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Sua resposta:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{m.resposta}</p>
                  </div>
                )}

                {m.statusDescricao === 'Aberta' && (
                  respostaAberta === m.id ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={resposta}
                        onChange={e => setResposta(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Digite sua resposta..."
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setRespostaAberta(null); setResposta('') }}
                          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                          Cancelar
                        </button>
                        <button onClick={() => handleResponder(m.id)} disabled={salvando}
                          className="flex items-center gap-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                          <CheckCircle size={14} />
                          {salvando ? 'Salvando...' : 'Responder'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setRespostaAberta(m.id)}
                      className="mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400">
                      Responder
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Solicitações */}
      {aba === 'solicitacoes' && (
        solicitacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
            <Clock size={36} />
            <p>Nenhuma solicitação de benefício.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {solicitacoes.map(s => (
              <div key={s.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{s.tipoBeneficioDescricao}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.colaboradorNome} · {new Date(s.criadoEm).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[s.statusDescricao] ?? ''}`}>
                    {s.statusDescricao}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{s.descricao}</p>

                {s.observacaoRH && (
                  <div className="mt-3 pl-4 border-l-2 border-blue-400">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Observação do RH:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{s.observacaoRH}</p>
                  </div>
                )}

                {s.statusDescricao === 'Pendente' && (
                  solAberta === s.id ? (
                    <div className="mt-3 space-y-2">
                      <select
                        value={novaSolStatus}
                        onChange={e => setNovaSolStatus(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none"
                      >
                        <option value="Aprovada">Aprovar</option>
                        <option value="Negada">Negar</option>
                      </select>
                      <textarea
                        value={observacaoRH}
                        onChange={e => setObservacaoRH(e.target.value)}
                        rows={2}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none resize-none"
                        placeholder="Observação (opcional)..."
                      />
                      <div className="flex gap-2">
                        <button onClick={() => { setSolAberta(null); setObservacaoRH('') }}
                          className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800">
                          Cancelar
                        </button>
                        <button onClick={() => handleAtualizarSolicitacao(s.id)} disabled={salvando}
                          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                          {salvando ? 'Salvando...' : 'Confirmar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setSolAberta(s.id)}
                      className="mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400">
                      Analisar Solicitação
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
