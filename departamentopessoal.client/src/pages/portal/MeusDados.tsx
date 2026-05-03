import { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { portalService } from '../../services/portalService'
import type { ColaboradorResponse } from '../../types'

function Campo({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 dark:text-gray-100">{value || '—'}</p>
    </div>
  )
}

function Secao({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  )
}

export function MeusDados() {
  const [dados, setDados] = useState<ColaboradorResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    portalService.getMe().then(setDados).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!dados) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
      <User size={40} />
      <p>Dados não encontrados.</p>
    </div>
  )

  const formatDate = (d: string) => new Date(d).toLocaleDateString('pt-BR')
  const formatCPF = (cpf: string) =>
    cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
          {dados.nome.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold">{dados.nome}</h2>
          <p className="text-emerald-100">{dados.cargo} · {dados.departamento}</p>
        </div>
      </div>

      <Secao title="Dados Profissionais">
        <Campo label="Matrícula" value={dados.matricula} />
        <Campo label="Cargo" value={dados.cargo} />
        <Campo label="Departamento" value={dados.departamento} />
        <Campo label="Data de Admissão" value={formatDate(dados.dataAdmissao)} />
        <Campo label="Tipo de Contrato" value={dados.tipoContrato} />
        <Campo label="Status" value={dados.status} />
      </Secao>

      <Secao title="Dados Pessoais">
        <Campo label="Nome Completo" value={dados.nome} />
        <Campo label="CPF" value={formatCPF(dados.cpf)} />
        <Campo label="RG" value={dados.rg} />
        <Campo label="Data de Nascimento" value={formatDate(dados.dataNascimento)} />
        <Campo label="E-mail" value={dados.email} />
        <Campo label="Telefone" value={dados.telefone} />
      </Secao>

      <Secao title="Endereço">
        <Campo label="Logradouro" value={dados.logradouro} />
        <Campo label="Número" value={dados.numero} />
        <Campo label="Complemento" value={dados.complemento} />
        <Campo label="Bairro" value={dados.bairro} />
        <Campo label="Cidade" value={dados.cidade} />
        <Campo label="Estado" value={dados.estado} />
        <Campo label="CEP" value={dados.cep} />
      </Secao>

      <Secao title="Dados Bancários">
        <Campo label="Banco" value={dados.banco} />
        <Campo label="Agência" value={dados.agencia} />
        <Campo label="Conta" value={dados.contaBancaria} />
      </Secao>

      <p className="text-xs text-gray-400 text-center">
        Para alterar seus dados, entre em contato com o RH.
      </p>
    </div>
  )
}
