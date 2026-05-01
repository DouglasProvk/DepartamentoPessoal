import api from './api'
import type { ColaboradorList, ColaboradorResponse, ColaboradorRequest } from '../types'

export const colaboradorService = {
  getAll: () => api.get<ColaboradorList[]>('/colaboradores').then(r => r.data),
  getById: (id: number) => api.get<ColaboradorResponse>(`/colaboradores/${id}`).then(r => r.data),
  create: (dto: ColaboradorRequest) => api.post<ColaboradorResponse>('/colaboradores', dto).then(r => r.data),
  update: (id: number, dto: ColaboradorRequest) => api.put<ColaboradorResponse>(`/colaboradores/${id}`, dto).then(r => r.data),
  inativar: (id: number) => api.patch(`/colaboradores/${id}/inativar`),
  delete: (id: number) => api.delete(`/colaboradores/${id}`),
}
