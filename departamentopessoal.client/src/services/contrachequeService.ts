import api from './api'

export const contrachequeService = {
  download: (salarioId: number) =>
    api.get(`/contracheque/${salarioId}`, { responseType: 'blob' }),
}
