import api from './api'
import type { AbonoResponse, AbonoRequest } from '../types'

export const abonoService = {
  getByColaborador: (colaboradorId: number) =>
    api.get<AbonoResponse[]>(`/abonos/colaborador/${colaboradorId}`).then(r => r.data),
  getByPeriodo: (mes: number, ano: number) =>
    api.get<AbonoResponse[]>('/abonos/periodo', { params: { mes, ano } }).then(r => r.data),
  getById: (id: number) => api.get<AbonoResponse>(`/abonos/${id}`).then(r => r.data),
  create: (dto: AbonoRequest) => api.post<AbonoResponse>('/abonos', dto).then(r => r.data),
  update: (id: number, dto: AbonoRequest) => api.put<AbonoResponse>(`/abonos/${id}`, dto).then(r => r.data),
  delete: (id: number) => api.delete(`/abonos/${id}`),
}
