import api from './api'
import type { SalarioResponse, AbonoResponse, MensagemRHRequest, MensagemRHResponse, SolicitacaoBeneficioRequest, SolicitacaoBeneficioResponse } from '../types'
import type { ColaboradorResponse } from '../types'

export const portalService = {
  getMe: () => api.get<ColaboradorResponse>('/portal/me').then(r => r.data),
  getContracheques: () => api.get<SalarioResponse[]>('/portal/contracheques').then(r => r.data),
  downloadContracheque: (salarioId: number) =>
    api.get(`/portal/contracheques/${salarioId}/pdf`, { responseType: 'blob' }),
  getBeneficios: () => api.get<AbonoResponse[]>('/portal/beneficios').then(r => r.data),
  getMensagens: () => api.get<MensagemRHResponse[]>('/portal/mensagens').then(r => r.data),
  enviarMensagem: (data: MensagemRHRequest) =>
    api.post<MensagemRHResponse>('/portal/mensagens', data).then(r => r.data),
  getSolicitacoes: () => api.get<SolicitacaoBeneficioResponse[]>('/portal/solicitacoes').then(r => r.data),
  criarSolicitacao: (data: SolicitacaoBeneficioRequest) =>
    api.post<SolicitacaoBeneficioResponse>('/portal/solicitacoes', data).then(r => r.data),
}
