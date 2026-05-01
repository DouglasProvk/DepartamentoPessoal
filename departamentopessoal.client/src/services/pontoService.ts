import api from './api'
import type { RegistroPontoResponse, PontoDiario } from '../types'

export const pontoService = {
  getByColaborador: (colaboradorId: number, inicio?: string, fim?: string) =>
    api.get<RegistroPontoResponse[]>(`/ponto/colaborador/${colaboradorId}`, { params: { inicio, fim } }).then(r => r.data),
  getEspelho: (colaboradorId: number, mes: number, ano: number) =>
    api.get<PontoDiario[]>(`/ponto/colaborador/${colaboradorId}/espelho`, { params: { mes, ano } }).then(r => r.data),
  registrar: (dto: { colaboradorId: number; dataHora: string; tipo: string; justificativa?: string }) =>
    api.post<RegistroPontoResponse>('/ponto', dto).then(r => r.data),
  aprovar: (id: number) => api.patch<RegistroPontoResponse>(`/ponto/${id}/aprovar`).then(r => r.data),
  delete: (id: number) => api.delete(`/ponto/${id}`),
}
