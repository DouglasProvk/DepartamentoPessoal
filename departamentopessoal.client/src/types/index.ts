export interface ColaboradorList {
  id: number
  nome: string
  cpf: string
  cargo: string
  departamento: string
  status: string
  tipoContrato: string
  dataAdmissao: string
  matricula: string
}

export interface ColaboradorResponse {
  id: number
  nome: string
  cpf: string
  rg: string
  dataNascimento: string
  email: string
  telefone: string
  cargo: string
  departamento: string
  dataAdmissao: string
  dataDemissao?: string
  tipoContrato: string
  status: string
  matricula: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  banco: string
  agencia: string
  contaBancaria: string
  criadoEm: string
  atualizadoEm: string
}

export interface ColaboradorRequest {
  nome: string
  cpf: string
  rg: string
  dataNascimento: string
  email: string
  telefone: string
  cargo: string
  departamento: string
  dataAdmissao: string
  tipoContrato: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  banco: string
  agencia: string
  contaBancaria: string
}

export interface SalarioResponse {
  id: number
  colaboradorId: number
  colaboradorNome: string
  valorBase: number
  inss: number
  fgts: number
  irrf: number
  outrosDescontos: number
  outrosAcrescimos: number
  valorLiquido: number
  mesReferencia: number
  anoReferencia: number
  dataPagamento: string
  pago: boolean
  observacao?: string
  criadoEm: string
}

export interface SalarioRequest {
  colaboradorId: number
  valorBase: number
  outrosDescontos: number
  outrosAcrescimos: number
  mesReferencia: number
  anoReferencia: number
  dataPagamento: string
  observacao?: string
}

export interface AbonoResponse {
  id: number
  colaboradorId: number
  colaboradorNome: string
  tipo: string
  tipoDescricao: string
  valor: number
  descricao: string
  mesReferencia: number
  anoReferencia: number
  ativo: boolean
  criadoEm: string
}

export interface AbonoRequest {
  colaboradorId: number
  tipo: string
  valor: number
  descricao: string
  mesReferencia: number
  anoReferencia: number
}

export interface MensagemRHResponse {
  id: number
  colaboradorId: number
  colaboradorNome: string
  assunto: string
  mensagem: string
  resposta?: string
  status: string
  statusDescricao: string
  criadoEm: string
  respondidoEm?: string
}

export interface MensagemRHRequest {
  assunto: string
  mensagem: string
}

export interface SolicitacaoBeneficioResponse {
  id: number
  colaboradorId: number
  colaboradorNome: string
  tipoBeneficio: string
  tipoBeneficioDescricao: string
  descricao: string
  observacaoRH?: string
  status: string
  statusDescricao: string
  criadoEm: string
  atualizadoEm: string
}

export interface SolicitacaoBeneficioRequest {
  tipoBeneficio: string
  descricao: string
}

export interface AtualizarSolicitacaoRequest {
  status: string
  observacaoRH?: string
}

export interface UsuarioResponse {
  id: number
  nome: string
  email: string
  perfil: string
  perfilDescricao: string
  ativo: boolean
  colaboradorId?: number
  colaboradorNome?: string
  criadoEm: string
  ultimoAcessoEm?: string
}

export interface RegistroPontoResponse {
  id: number
  colaboradorId: number
  colaboradorNome: string
  dataHora: string
  tipo: string
  tipoDescricao: string
  ocorrencia: string
  ocorrenciaDescricao: string
  justificativa?: string
  aprovado: boolean
  criadoEm: string
}

export interface PontoDiario {
  data: string
  entrada?: string
  saidaAlmoco?: string
  retornoAlmoco?: string
  saida?: string
  totalTrabalhado: string
  ocorrencia: string
  justificativa?: string
}
