import { useEffect, useState } from 'react'
import { Clock, Plus } from 'lucide-react'
import { pontoService } from '../../services/pontoService'
import { colaboradorService } from '../../services/colaboradorService'
import type { PontoDiario, ColaboradorList } from '../../types'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'

const tiposPonto = [
  { value: 'Entrada', label: 'Entrada' },
  { value: 'SaidaAlmoco', label: 'Saída Almoço' },
  { value: 'RetornoAlmoco', label: 'Retorno Almoço' },
  { value: 'Saida', label: 'Saída' },
]

const meses = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i).toLocaleString('pt-BR', { month: 'long' }),
}))

export function PontoPage() {
  const { hasRole } = useAuth()
  const canRegister = hasRole('Administrador', 'GestorRH', 'OperadorPonto')

  const [colaboradores, setColaboradores] = useState<ColaboradorList[]>([])
  const [espelho, setEspelho] = useState<PontoDiario[]>([])
  const [colId, setColId] = useState('')
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [showForm, setShowForm] = useState(false)
  const [tipoPonto, setTipoPonto] = useState('Entrada')
  const [dataHora, setDataHora] = useState('')

  const anos = Array.from({ length: 3 }, (_, i) => {
    const y = new Date().getFullYear() - 1 + i
    return { value: String(y), label: String(y) }
  })

  useEffect(() => { colaboradorService.getAll().then(setColaboradores) }, [])

  const buscarEspelho = () => {
    if (colId) pontoService.getEspelho(Number(colId), mes, ano).then(setEspelho)
  }

  useEffect(() => { buscarEspelho() }, [colId, mes, ano])

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault()
    await pontoService.registrar({ colaboradorId: Number(colId), dataHora, tipo: tipoPonto })
    setShowForm(false)
    buscarEspelho()
  }

  const ocorrenciaColor = (o: string) => {
    switch (o) {
      case 'Atraso': return 'text-yellow-500'
      case 'FaltaJustificada': return 'text-orange-500'
      case 'FaltaInjustificada': return 'text-red-500'
      case 'HoraExtra': return 'text-blue-500'
      default: return 'text-gray-400 dark:text-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-64">
          <Select
            label=""
            value={colId}
            onChange={e => setColId(e.target.value)}
            options={[{ value: '', label: 'Selecione colaborador...' },
              ...colaboradores.map(c => ({ value: String(c.id), label: c.nome }))]}
          />
        </div>
        <Select label="" value={String(mes)} onChange={e => setMes(Number(e.target.value))} options={meses} />
        <Select label="" value={String(ano)} onChange={e => setAno(Number(e.target.value))} options={anos} />
        {colId && canRegister && (
          <Button onClick={() => setShowForm(v => !v)}>
            <Plus size={16} /> Registrar
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleRegistrar} className="flex gap-4 items-end">
            <Select label="Tipo" value={tipoPonto} onChange={e => setTipoPonto(e.target.value)} options={tiposPonto} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</label>
              <input
                type="datetime-local"
                value={dataHora}
                onChange={e => setDataHora(e.target.value)}
                required
                className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm"
              />
            </div>
            <Button type="submit"><Clock size={16} /> Registrar</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
          </form>
        </Card>
      )}

      {espelho.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {['Data', 'Entrada', 'S. Almoço', 'R. Almoço', 'Saída', 'Total', 'Ocorrência'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {espelho.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-2 font-medium">
                      {new Date(d.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="px-4 py-2 font-mono text-green-600 dark:text-green-400">{d.entrada ?? '--:--'}</td>
                    <td className="px-4 py-2 font-mono text-gray-500">{d.saidaAlmoco ?? '--:--'}</td>
                    <td className="px-4 py-2 font-mono text-gray-500">{d.retornoAlmoco ?? '--:--'}</td>
                    <td className="px-4 py-2 font-mono text-red-500">{d.saida ?? '--:--'}</td>
                    <td className="px-4 py-2 font-mono font-semibold">{d.totalTrabalhado}</td>
                    <td className={`px-4 py-2 text-xs font-medium ${ocorrenciaColor(d.ocorrencia)}`}>{d.ocorrencia}</td>
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
