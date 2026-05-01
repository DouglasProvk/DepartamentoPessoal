import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { colaboradorService } from '../../services/colaboradorService'
import type { ColaboradorRequest } from '../../types'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ArrowLeft, Save } from 'lucide-react'

const tiposContrato = [
  { value: 'CLT', label: 'CLT' },
  { value: 'PJ', label: 'PJ' },
  { value: 'Estagio', label: 'Estágio' },
  { value: 'Temporario', label: 'Temporário' },
  { value: 'Aprendiz', label: 'Aprendiz' },
]

const emptyForm: ColaboradorRequest = {
  nome: '', cpf: '', rg: '', dataNascimento: '', email: '', telefone: '',
  cargo: '', departamento: '', dataAdmissao: '', tipoContrato: 'CLT',
  logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '',
  banco: '', agencia: '', contaBancaria: '',
}

export function ColaboradorFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState<ColaboradorRequest>(emptyForm)
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(id)

  useEffect(() => {
    if (isEdit) {
      colaboradorService.getById(Number(id)).then(data => {
        setForm({
          nome: data.nome, cpf: data.cpf, rg: data.rg,
          dataNascimento: data.dataNascimento.split('T')[0],
          email: data.email, telefone: data.telefone,
          cargo: data.cargo, departamento: data.departamento,
          dataAdmissao: data.dataAdmissao.split('T')[0],
          tipoContrato: data.tipoContrato,
          logradouro: data.logradouro, numero: data.numero,
          complemento: data.complemento, bairro: data.bairro,
          cidade: data.cidade, estado: data.estado, cep: data.cep,
          banco: data.banco, agencia: data.agencia, contaBancaria: data.contaBancaria,
        })
      })
    }
  }, [id, isEdit])

  const set = (field: keyof ColaboradorRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) await colaboradorService.update(Number(id), form)
      else await colaboradorService.create(form)
      navigate('/colaboradores')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/colaboradores')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {isEdit ? 'Editar Colaborador' : 'Novo Colaborador'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome completo *" value={form.nome} onChange={set('nome')} required />
            <Input label="CPF *" value={form.cpf} onChange={set('cpf')} required placeholder="000.000.000-00" />
            <Input label="RG" value={form.rg} onChange={set('rg')} />
            <Input label="Data de Nascimento *" type="date" value={form.dataNascimento} onChange={set('dataNascimento')} required />
            <Input label="E-mail" type="email" value={form.email} onChange={set('email')} />
            <Input label="Telefone" value={form.telefone} onChange={set('telefone')} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Dados Profissionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Cargo *" value={form.cargo} onChange={set('cargo')} required />
            <Input label="Departamento *" value={form.departamento} onChange={set('departamento')} required />
            <Input label="Data de Admissão *" type="date" value={form.dataAdmissao} onChange={set('dataAdmissao')} required />
            <Select label="Tipo de Contrato *" value={form.tipoContrato} onChange={set('tipoContrato')} options={tiposContrato} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="CEP" value={form.cep} onChange={set('cep')} className="md:col-span-1" />
            <Input label="Logradouro" value={form.logradouro} onChange={set('logradouro')} className="md:col-span-2" />
            <Input label="Número" value={form.numero} onChange={set('numero')} />
            <Input label="Complemento" value={form.complemento} onChange={set('complemento')} />
            <Input label="Bairro" value={form.bairro} onChange={set('bairro')} />
            <Input label="Cidade" value={form.cidade} onChange={set('cidade')} />
            <Input label="Estado" value={form.estado} onChange={set('estado')} maxLength={2} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Dados Bancários</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Banco" value={form.banco} onChange={set('banco')} />
            <Input label="Agência" value={form.agencia} onChange={set('agencia')} />
            <Input label="Conta" value={form.contaBancaria} onChange={set('contaBancaria')} />
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/colaboradores')}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            <Save size={16} /> {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
