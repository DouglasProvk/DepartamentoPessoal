import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { usuarioService, type UsuarioOutput, type UsuarioInput } from '../../services/usuarioService'
import { colaboradorService } from '../../services/colaboradorService'
import type { ColaboradorList } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Card } from '../../components/ui/Card'

const perfis = [
  { value: 'Administrador', label: 'Administrador' },
  { value: 'GestorRH', label: 'Gestor RH' },
  { value: 'AnalistaFolha', label: 'Analista de Folha' },
  { value: 'Aprovador', label: 'Aprovador' },
  { value: 'OperadorPonto', label: 'Operador de Ponto' },
  { value: 'Visualizador', label: 'Visualizador' },
  { value: 'Colaborador', label: 'Colaborador (Portal)' },
]

const emptyForm: UsuarioInput = { nome: '', email: '', senha: '', perfil: 'Visualizador' }

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioOutput[]>([])
  const [colaboradores, setColaboradores] = useState<ColaboradorList[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<UsuarioInput>(emptyForm)

  useEffect(() => {
    usuarioService.getAll().then(setUsuarios)
    colaboradorService.getAll().then(setColaboradores)
  }, [])

  const set = (field: keyof UsuarioInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'colaboradorId'
      ? (e.target.value ? Number(e.target.value) : undefined)
      : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const novo = await usuarioService.create(form)
    setUsuarios(prev => [novo, ...prev])
    setForm(emptyForm)
    setShowForm(false)
  }

  const handleToggle = async (id: number) => {
    await usuarioService.toggleAtivo(id)
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, ativo: !u.ativo } : u))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este usuário? Esta ação não pode ser desfeita.')) return
    await usuarioService.delete(id)
    setUsuarios(prev => prev.filter(u => u.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(v => !v)}>
          <Plus size={16} /> Novo Usuário
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Novo Usuário</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Nome *" required value={form.nome} onChange={set('nome')} className="md:col-span-2" />
            <Input label="E-mail *" type="email" required value={form.email} onChange={set('email')} className="md:col-span-2" />
            <Input label="Senha *" type="password" required value={form.senha} onChange={set('senha')} />
            <Select label="Perfil" value={form.perfil} onChange={set('perfil')} options={perfis} />
            {form.perfil === 'Colaborador' && (
              <div className="md:col-span-2">
                <Select
                  label="Vincular Colaborador *"
                  value={String(form.colaboradorId ?? '')}
                  onChange={set('colaboradorId')}
                  options={[
                    { value: '', label: 'Selecione o colaborador...' },
                    ...colaboradores.map(c => ({ value: String(c.id), label: `${c.nome} (${c.matricula})` }))
                  ]}
                />
              </div>
            )}
            <div className="md:col-span-4 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit">Criar Usuário</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Nome', 'E-mail', 'Perfil', 'Colaborador Vinculado', 'Status', 'Último acesso', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{u.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      u.perfil === 'Colaborador'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {u.perfilDescricao}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {u.colaboradorNome ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${u.ativo ? 'text-green-500' : 'text-gray-400'}`}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {u.ultimoAcessoEm ? new Date(u.ultimoAcessoEm).toLocaleString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleToggle(u.id)} title={u.ativo ? 'Inativar' : 'Ativar'}>
                        {u.ativo
                          ? <ToggleRight size={16} className="text-green-500" />
                          : <ToggleLeft size={16} className="text-gray-400" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}>
                        <Trash2 size={14} className="text-red-400" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">Nenhum usuário cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
