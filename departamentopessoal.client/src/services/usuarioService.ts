import api from './api'

export interface UsuarioOutput {
  id: number
  nome: string
  email: string
  perfil: string
  perfilDescricao: string
  ativo: boolean
  colaboradorId?: number
  colaboradorNome?: string
  criadoEm: string
  ultimoAcessoEm: string | null
}

export interface UsuarioInput {
  nome: string
  email: string
  senha: string
  perfil: string
  colaboradorId?: number
}

export interface AlterarSenhaInput {
  senhaAtual: string
  novaSenha: string
}

export const usuarioService = {
  getAll: () => api.get<UsuarioOutput[]>('/usuarios').then(r => r.data),
  getById: (id: number) => api.get<UsuarioOutput>(`/usuarios/${id}`).then(r => r.data),
  create: (data: UsuarioInput) => api.post<UsuarioOutput>('/usuarios', data).then(r => r.data),
  update: (id: number, data: UsuarioInput) => api.put<UsuarioOutput>(`/usuarios/${id}`, data).then(r => r.data),
  toggleAtivo: (id: number) => api.patch<UsuarioOutput>(`/usuarios/${id}/toggle-ativo`).then(r => r.data),
  alterarSenha: (id: number, data: AlterarSenhaInput) => api.patch(`/usuarios/${id}/senha`, data),
  delete: (id: number) => api.delete(`/usuarios/${id}`),
}
