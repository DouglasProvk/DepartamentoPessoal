const variants: Record<string, string> = {
  Ativo: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Inativo: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  Afastado: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Ferias: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Demitido: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  default: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

export function Badge({ label }: { label: string }) {
  const cls = variants[label] ?? variants.default
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
