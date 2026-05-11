import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FoodItem, Condition } from '@/schemas/item'
import { getCombinedScore } from '@/lib/scoring'
import { StoplichtBadge } from './StoplichtBadge'
import { EvidenceBadge } from './EvidenceBadge'

function scoreAccentClass(score: number | null): string {
  switch (score) {
    case 0: return 'border-l-4 border-l-emerald-400'
    case 1: return 'border-l-4 border-l-yellow-400'
    case 2: return 'border-l-4 border-l-orange-400'
    case 3: return 'border-l-4 border-l-red-500'
    default: return 'border-l-4 border-l-gray-200'
  }
}

interface Props {
  item: FoodItem
  activeConditions: Condition[]
}

const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht',
  migraine: 'Migraine',
  nierstenen: 'Nierstenen',
  histamine: 'Histamine',
}

export function ItemCard({ item, activeConditions }: Props) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const combined = getCombinedScore(item, activeConditions)

  return (
    <div className={`rounded-xl border border-[#e0dfd7] bg-white overflow-hidden ${scoreAccentClass(combined.score)}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-center gap-3"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-[#1a1a18] text-sm">{item.name.nl}</span>
            {combined.conflict && (
              <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
                {t('zoeken.conflict')}
              </span>
            )}
          </div>
          {activeConditions.length > 1 && (
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              {activeConditions.map((c) => {
                const s = combined.perCondition[c]
                return (
                  <span key={c} className="flex items-center gap-1 text-xs text-[#73726c]">
                    <StoplichtBadge score={s?.score ?? null} size="sm" showLabel={false} />
                    {CONDITION_LABELS[c]}
                  </span>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StoplichtBadge score={combined.score} size="md" />
          <svg
            className={`w-4 h-4 text-[#9c9a92] transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#e0dfd7] bg-[#f8f7f4] px-4 py-3 space-y-3">
          {combined.conflict && (
            <div className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
              {t('zoeken.conflictHelp')}
            </div>
          )}

          {activeConditions.map((condition) => {
            const s = item.scores[condition]
            if (s === null) {
              return (
                <div key={condition} className="text-xs text-[#9c9a92]">
                  <span className="font-medium text-[#5f5e5a]">{CONDITION_LABELS[condition]}:</span>{' '}
                  {t('zoeken.noData')}
                </div>
              )
            }
            return (
              <div key={condition} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-[#5f5e5a]">{CONDITION_LABELS[condition]}</span>
                  <StoplichtBadge score={s.score} size="sm" />
                  <EvidenceBadge level={s.evidence} />
                </div>
                {s.note && (
                  <p className="text-xs text-[#73726c] leading-relaxed">{s.note.nl}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {s.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {src.title}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}

          {item.histamineFlags && activeConditions.includes('histamine') && (
            <div className="flex gap-2 flex-wrap pt-1">
              {item.histamineFlags.liberator && (
                <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded px-2 py-0.5">
                  Histamineliberator
                </span>
              )}
              {item.histamineFlags.daoBlocker && (
                <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded px-2 py-0.5">
                  DAO-blokker
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
