import { useEffect, useState } from 'react'
import { Plus, CheckCircle, Trash2, Download } from 'lucide-react'
import { salarioService } from '../../services/salarioService'
import { colaboradorService } from '../../services/colaboradorService'
import { contrachequeService } from '../../services/contrachequeService'
import type { SalarioResponse, SalarioRequest, ColaboradorList } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'

const meses = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i).toLocaleString('pt-BR', { month: 'long' }),
}))

const anos = Array.from({ length: 5 }, (_, i) => {
  const y = new Date().getFullYear() - 2 + i
  return { value: String(y), label: String(y) }
})

export function SalariosPage() {
  const { hasRole } = useAuth()
  const canCreate = hasRole('Administrador', 'AnalistaFolha')
  const canApprove = hasRole('Administrador', 'GestorRH', 'Aprovador')
  const canDelete = hasRole('Administrador')

  const [colaboradores, setColaboradores] = useState<ColaboradorList[]>([])
  const [salarios, setSalarios] = useState<SalarioResponse[]>([])
  const [colId, setColId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<SalarioRequest>>({
    outrosDescontos: 0, outrosAcrescimos: 0,
    mesReferencia: new Date().getMonth() + 1,
    anoReferencia: new Date().getFullYear(),
  })

  useEffect(() => { colaboradorService.getAll().then(setColaboradores) }, [])

  useEffect(() => {
    if (colId) salarioService.getByColaborador(Number(colId)).then(setSalarios)
    else setSalarios([])
  }, [colId])

  const set = (field: keyof SalarioRequest) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const dto = { ...form, colaboradorId: Number(colId) } as SalarioRequest
    const novo = await salarioService.create(dto)
    setSalarios(prev => [novo, ...prev])
    setShowForm(false)
  }

  const handlePagar = async (id: number) => {
    const updated = await salarioService.marcarComoPago(id)
    setSalarios(prev => prev.map(s => s.id === id ? updated : s))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este lançamento?')) return
    await salarioService.delete(id)
    setSalarios(prev => prev.filter(s => s.id !== id))
  }

  const handleDownloadPdf = async (s: SalarioResponse) => {
    const response = await contrachequeService.download(s.id)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const mes = String(s.mesReferencia).padStart(2, '0')
    link.download = `contracheque_${s.colaboradorNome.replace(/\s+/g,'_')}_${mes}_${s.anoReferencia}.pdf`
    link.click()
    window.URL.revokeObjectURL(url)
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
            <Plus size={16} /> Lançar Salário
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Novo Lançamento</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Salário Base *" type="number" step="0.01" required onChange={set('valorBase')} />
            <Input label="Outros Descontos" type="number" step="0.01" defaultValue="0" onChange={set('outrosDescontos')} />
            <Input label="Outros Acréscimos" type="number" step="0.01" defaultValue="0" onChange={set('outrosAcrescimos')} />
            <Input label="Data Pagamento *" type="date" required onChange={set('dataPagamento')} />
            <Select label="Mês" value={String(form.mesReferencia)} onChange={set('mesReferencia')} options={meses} />
            <Select label="Ano" value={String(form.anoReferencia)} onChange={set('anoReferencia')} options={anos} />
            <Input label="Observação" onChange={set('observacao')} className="md:col-span-2" />
            <div className="md:col-span-4 flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </Card>
      )}

      {salarios.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {['Competência', 'Salário Base', 'INSS', 'IRRF', 'FGTS', 'Líquido', 'Pagamento', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {salarios.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">{String(s.mesReferencia).padStart(2,'0')}/{s.anoReferencia}</td>
                    <td className="px-4 py-3">{fmt(s.valorBase)}</td>
                    <td className="px-4 py-3 text-red-500">-{fmt(s.inss)}</td>
                    <td className="px-4 py-3 text-red-500">-{fmt(s.irrf)}</td>
                    <td className="px-4 py-3 text-gray-500">{fmt(s.fgts)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">{fmt(s.valorLiquido)}</td>
                    <td className="px-4 py-3">{new Date(s.dataPagamento).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${s.pago ? 'text-green-500' : 'text-yellow-500'}`}>
                        {s.pago ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleDownloadPdf(s)} title="Baixar contracheque PDF">
                          <Download size={14} className="text-blue-500" />
                        </Button>
                        {!s.pago && canApprove && (
                          <Button variant="ghost" size="sm" onClick={() => handlePagar(s.id)}>
                            <CheckCircle size={14} className="text-green-500" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                            <Trash2 size={14} className="text-red-400" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {colId && salarios.length === 0 && !showForm && (
        <p className="text-center text-gray-400 py-8">Nenhum lançamento encontrado para este colaborador.</p>
      )}
    </div>
  )
}
