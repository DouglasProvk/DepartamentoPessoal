import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { portalService } from '../../services/portalService'
import type { SalarioResponse } from '../../types'

const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function MeusContracheques() {
  const [contracheques, setContracheques] = useState<SalarioResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<number | null>(null)

  useEffect(() => {
    portalService.getContracheques()
      .then(setContracheques)
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (id: number, mes: number, ano: number) => {
    setDownloading(id)
    try {
      const response = await portalService.downloadContracheque(id)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.download = `contracheque_${meses[mes - 1]}_${ano}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setDownloading(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (contracheques.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
      <FileText size={40} />
      <p>Nenhum contracheque disponível.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      {contracheques.map(c => (
        <div
          key={c.id}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                {meses[c.mesReferencia - 1]} / {c.anoReferencia}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pagamento: {new Date(c.dataPagamento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              c.pago
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {c.pago ? 'Pago' : 'Aguardando'}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Salário Base</p>
              <p className="font-medium">{formatCurrency(c.valorBase)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">INSS</p>
              <p className="font-medium text-red-500">- {formatCurrency(c.inss)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">IRRF</p>
              <p className="font-medium text-red-500">- {formatCurrency(c.irrf)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Líquido</p>
              <p className="font-semibold text-emerald-600">{formatCurrency(c.valorLiquido)}</p>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => handleDownload(c.id, c.mesReferencia, c.anoReferencia)}
              disabled={downloading === c.id}
              className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {downloading === c.id ? 'Gerando PDF...' : 'Baixar PDF'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
