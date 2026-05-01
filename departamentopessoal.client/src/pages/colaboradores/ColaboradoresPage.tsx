import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, UserX } from 'lucide-react'
import { colaboradorService } from '../../services/colaboradorService'
import type { ColaboradorList } from '../../types'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'

export function ColaboradoresPage() {
  const { hasRole } = useAuth()
  const canCreate = hasRole('Administrador', 'GestorRH')
  const canEdit = hasRole('Administrador', 'GestorRH')
  const canInativar = hasRole('Administrador', 'GestorRH')

  const [colaboradores, setColaboradores] = useState<ColaboradorList[]>([])
  const [busca, setBusca] = useState('')
  const [deptoAtivo, setDeptoAtivo] = useState('Todos')
  const navigate = useNavigate()

  useEffect(() => { colaboradorService.getAll().then(setColaboradores) }, [])

  const departamentos = useMemo(() => {
    const unicos = [...new Set(colaboradores.map(c => c.departamento))].sort()
    return ['Todos', ...unicos]
  }, [colaboradores])

  const filtrados = useMemo(() => colaboradores.filter(c => {
    const matchDepto = deptoAtivo === 'Todos' || c.departamento === deptoAtivo
    const matchBusca = !busca ||
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.cpf.includes(busca) ||
      c.matricula.includes(busca)
    return matchDepto && matchBusca
  }), [colaboradores, deptoAtivo, busca])

  const contagemPorDepto = useMemo(() =>
    Object.fromEntries(
      departamentos.slice(1).map(d => [d, colaboradores.filter(c => c.departamento === d).length])
    ), [colaboradores, departamentos])

  const handleInativar = async (id: number) => {
    if (!confirm('Inativar este colaborador?')) return
    await colaboradorService.inativar(id)
    setColaboradores(prev => prev.map(c => c.id === id ? { ...c, status: 'Inativo' } : c))
  }

  return (
    <div className="space-y-4">
      {/* Barra de ações */}
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Buscar por nome, CPF ou matrícula..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="max-w-72"
        />
        {canCreate && (
          <Button onClick={() => navigate('/colaboradores/novo')}>
            <Plus size={16} /> Novo Colaborador
          </Button>
        )}
      </div>

      {/* Tabs de departamento */}
      <div className="flex gap-2 flex-wrap">
        {departamentos.map(d => {
          const count = d === 'Todos' ? colaboradores.length : contagemPorDepto[d] ?? 0
          const ativo = deptoAtivo === d
          return (
            <button
              key={d}
              onClick={() => setDeptoAtivo(d)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                ativo
                  ? 'bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400'
              }`}
            >
              {d}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                ativo
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tabela */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Matrícula', 'Nome', 'Cargo', 'Departamento', 'Contrato', 'Admissão', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtrados.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{c.matricula}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.cargo}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.departamento}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.tipoContrato}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(c.dataAdmissao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3"><Badge label={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {canEdit && (
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/colaboradores/${c.id}`)}>
                          <Pencil size={14} />
                        </Button>
                      )}
                      {canInativar && c.status === 'Ativo' && (
                        <Button variant="ghost" size="sm" onClick={() => handleInativar(c.id)}>
                          <UserX size={14} className="text-red-400" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                    Nenhum colaborador encontrado{deptoAtivo !== 'Todos' ? ` em "${deptoAtivo}"` : ''}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
          {filtrados.length} colaborador{filtrados.length !== 1 ? 'es' : ''}
          {deptoAtivo !== 'Todos' ? ` em ${deptoAtivo}` : ' no total'}
        </div>
      </Card>
    </div>
  )
}
