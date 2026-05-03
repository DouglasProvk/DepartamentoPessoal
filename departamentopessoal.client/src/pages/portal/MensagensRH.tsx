import { useEffect, useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { portalService } from '../../services/portalService'
import type { MensagemRHResponse } from '../../types'

const statusColor: Record<string, string> = {
  Aberta: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Respondida: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Fechada: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function MensagensRH() {
  const [mensagens, setMensagens] = useState<MensagemRHResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [assunto, setAssunto] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)

  const carregar = () =>
    portalService.getMensagens().then(setMensagens).finally(() => setLoading(false))

  useEffect(() => { carregar() }, [])

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assunto.trim() || !mensagem.trim()) return
    setEnviando(true)
    try {
      await portalService.enviarMensagem({ assunto, mensagem })
      setAssunto('')
      setMensagem('')
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
          Envie dúvidas ou mensagens para o RH. Nossa equipe responderá em breve.
        </p>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Send size={15} />
          Nova Mensagem
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleEnviar} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 space-y-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Nova Mensagem para o RH</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assunto</label>
            <input
              value={assunto}
              onChange={e => setAssunto(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Qual é o assunto?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem</label>
            <textarea
              value={mensagem}
              onChange={e => setMensagem(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Descreva sua dúvida ou mensagem..."
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
              <Send size={15} />
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      )}

      {mensagens.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-3">
          <MessageSquare size={36} />
          <p>Nenhuma mensagem ainda. Envie sua primeira dúvida!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mensagens.map(m => (
            <div key={m.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">{m.assunto}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${statusColor[m.statusDescricao] ?? ''}`}>
                  {m.statusDescricao}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{m.mensagem}</p>
              {m.resposta && (
                <div className="mt-3 pl-4 border-l-2 border-emerald-400">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Resposta do RH:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{m.resposta}</p>
                  {m.respondidoEm && (
                    <p className="text-xs text-gray-400 mt-1">
                      Respondido em {new Date(m.respondidoEm).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Enviado em {new Date(m.criadoEm).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
