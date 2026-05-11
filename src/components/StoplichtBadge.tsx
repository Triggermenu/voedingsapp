import { scoreColorClasses, scoreDotClass, getScoreLabel } from '@/lib/scoring'
import { useTranslation } from 'react-i18next'

interface Props {
  score: number | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function StoplichtBadge({ score, size = 'md', showLabel = true }: Props) {
  const { t } = useTranslation()
  const label = t(`scores.${getScoreLabel(score)}`)

  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${scoreColorClasses(score)} ${textSize} ${padding}`}
      aria-label={label}
    >
      <span className={`rounded-full flex-shrink-0 ${dotSize} ${scoreDotClass(score)}`} />
      {showLabel && label}
    </span>
  )
}
