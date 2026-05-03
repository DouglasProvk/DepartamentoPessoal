import api from './api'
import type { MensagemRHResponse, SolicitacaoBeneficioResponse, AtualizarSolicitacaoRequest } from '../types'

export const mensagensRHService = {
  getMensagens: () => api.get<MensagemRHResponse[]>('/mensagensrh').then(r => r.data),
  responder: (id: number, resposta: string) =>
    api.put<MensagemRHResponse>(`/mensagensrh/${id}/responder`, { resposta }).then(r => r.data),
  getSolicitacoes: () => api.get<SolicitacaoBeneficioResponse[]>('/mensagensrh/solicitacoes').then(r => r.data),
  atualizarSolicitacao: (id: number, data: AtualizarSolicitacaoRequest) =>
    api.put<SolicitacaoBeneficioResponse>(`/mensagensrh/solicitacoes/${id}`, data).then(r => r.data),
}
