import api from './api'

interface LoginInput {
  email: string
  senha: string
}

interface LoginOutput {
  token: string
  nome: string
  email: string
  perfil: string
  expiracao: string
  colaboradorId?: number
}

export const authService = {
  login: (data: LoginInput) =>
    api.post<LoginOutput>('/auth/login', data).then(r => r.data),
}
