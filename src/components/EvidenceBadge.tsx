import { useTranslation } from 'react-i18next'
import type { EvidenceLevel } from '@/schemas/item'

interface Props {
  level: EvidenceLevel
}

const COLORS: Record<EvidenceLevel, string> = {
  A: 'bg-blue-50 text-blue-700 border-blue-200',
  B: 'bg-purple-50 text-purple-700 border-purple-200',
  C: 'bg-gray-50 text-gray-600 border-gray-200',
  onbekend: 'bg-gray-50 text-gray-400 border-gray-200',
}

export function EvidenceBadge({ level }: Props) {
  const { t } = useTranslation()

  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-mono font-semibold ${COLORS[level]}`}
      title={t(`evidence.${level}`)}
    >
      {level === 'onbekend' ? '?' : level}
    </span>
  )
}
