import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { abonoService } from '../../services/abonoService'
import { colaboradorService } from '../../services/colaboradorService'
import type { AbonoResponse, AbonoRequest, ColaboradorList } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'

const tiposAbono = [
  'ValeTransporte','ValeAlimentacao','PlanoSaude','PlanoOdontologico',
  'Bonus','ComissaoVendas','AdicionalNoturno','HoraExtra','Outros'
].map(v => ({ value: v, label: v.replace(/([A-Z])/g, ' $1').trim() }))

const meses = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i).toLocaleString('pt-BR', { month: 'long' }),
}))

export function AbonosPage() {
  const { hasRole } = useAuth()
  const canCreate = hasRole('Administrador', 'AnalistaFolha')
  const canDelete = hasRole('Administrador')

  const [colaboradores, setColaboradores] = useState<ColaboradorList[]>([])
  const [abonos, setAbonos] = useState<AbonoResponse[]>([])
  const [colId, setColId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<AbonoRequest>>({
    tipo: 'ValeTransporte',
    mesReferencia: new Date().getMonth() + 1,
    anoReferencia: new Date().getFullYear(),
  })

  const anos = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - 2 + i
    return { value: String(y), label: String(y) }
  })

  useEffect(() => { colaboradorService.getAll().then(setColaboradores) }, [])

  useEffect(() => {
    if (colId) abonoService.getByColaborador(Number(colId)).then(setAbonos)
    else setAbonos([])
  }, [colId])

  const set = (field: keyof AbonoRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const dto = { ...form, colaboradorId: Number(colId) } as AbonoRequest
    const novo = await abonoService.create(dto)
    setAbonos(prev => [novo, ...prev])
    setShowForm(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este abono?')) return
    await abonoService.delete(id)
    setAbonos(prev => prev.filter(a => a.id !== id))
  }

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-72">
          <Select
            label=""
            value={colId}
            onChange={e => setColId(e.target.value)}
            options={[{ value: '', label: 'Selecione um colaborador...' },
              ...colaboradores.map(c => ({ value: String(c.id), label: c.nome }))]}
          />
        </div>
        {colId && canCreate && (
          <Button onClick={() => setShowForm(v => !v)}>
            <Plus size={16} /> Novo Abono
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Novo Abono</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Select label="Tipo *" value={form.tipo} onChange={set('tipo')} options={tiposAbono} />
            <Input label="Valor *" type="number" step="0.01" required onChange={set('valor')} />
            <Input label="Descrição" onChange={set('descricao')} />
            <Select label="Mês" value={String(form.mesReferencia)} onChange={set('mesReferencia')} options={meses} />
            <Select label="Ano" value={String(form.anoReferencia)} onChange={set('anoReferencia')} options={anos} />
            <div className="md:col-span-3 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Card>
      )}

      {abonos.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {['Competência', 'Tipo', 'Descrição', 'Valor', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {abonos.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">{String(a.mesReferencia).padStart(2,'0')}/{a.anoReferencia}</td>
                    <td className="px-4 py-3">{a.tipoDescricao}</td>
                    <td className="px-4 py-3 text-gray-500">{a.descricao}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400">{fmt(a.valor)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${a.ativo ? 'text-green-500' : 'text-gray-400'}`}>
                        {a.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {canDelete && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)}>
                          <Trash2 size={14} className="text-red-400" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
