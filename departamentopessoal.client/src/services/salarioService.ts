import api from './api'
import type { SalarioResponse, SalarioRequest } from '../types'

export const salarioService = {
  getByColaborador: (colaboradorId: number) =>
    api.get<SalarioResponse[]>(`/salarios/colaborador/${colaboradorId}`).then(r => r.data),
  getById: (id: number) => api.get<SalarioResponse>(`/salarios/${id}`).then(r => r.data),
  create: (dto: SalarioRequest) => api.post<SalarioResponse>('/salarios', dto).then(r => r.data),
  marcarComoPago: (id: number) => api.patch<SalarioResponse>(`/salarios/${id}/pagar`).then(r => r.data),
  delete: (id: number) => api.delete(`/salarios/${id}`),
}
