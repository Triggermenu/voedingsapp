import { useEffect } from 'react'
import { getItemById, getAlternatives } from '@/lib/db'
import { getCombinedScore, scoreColorClasses, scoreDotClass } from '@/lib/scoring'
import { recordView } from '@/lib/stats'
import type { Condition } from '@/schemas/item'

const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht',
  migraine: 'Migraine',
  nierstenen: 'Nierstenen',
  histamine: 'Histamine',
}

const CATEGORY_LABELS: Record<string, string> = {
  groente: 'Groente', fruit: 'Fruit', granen: 'Granen & brood',
  peulvruchten: 'Peulvruchten', 'noten-zaden': 'Noten & zaden',
  vlees: 'Vlees & gevogelte', 'vis-schaaldieren': 'Vis & schaaldieren',
  zuivel: 'Zuivel & eieren', eieren: 'Eieren',
  'dranken-alcohol': 'Alcohol', 'dranken-non-alcohol': 'Dranken',
  zoetwaren: 'Zoetwaren & snacks', 'sauzen-kruiden': 'Sauzen & kruiden',
}

const SCORE_LABELS: Record<number, string> = {
  0: 'Veilig', 1: 'Matig', 2: 'Voorzichtig', 3: 'Vermijden',
}

export function ScorePill({ score, suffix }: { score: number | null; suffix?: string }) {
  const label = score !== null ? SCORE_LABELS[score] : 'Onbekend'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border ${scoreColorClasses(score)}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${scoreDotClass(score)}`} />
      {label}{suffix}
    </span>
  )
}

interface Props {
  id: string
  conditions: Condition[]
  /** Als meegegeven: toon alternatieven inline (mobiel). Op desktop staan ze in de rechterkolom. */
  showAlternatives?: boolean
  onNavigate: (id: string) => void
}

export function ItemDetailPanel({ id, conditions, showAlternatives = false, onNavigate }: Props) {
  const item = getItemById(id)

  useEffect(() => {
    if (id) recordView(id)
  }, [id])

  if (!item) return null

  const combined = getCombinedScore(item, conditions)
  const alternatives = getAlternatives(item, conditions, 3)

  const nameParts = item.name.nl.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/)
  const displayName = nameParts?.[1]?.trim() ?? item.name.nl
  const displayNote = nameParts?.[2]?.trim()

  return (
    <div className="px-4 pt-2 pb-10">
      {/* Categorie */}
      <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">
        {CATEGORY_LABELS[item.category] ?? item.category}
      </p>

      {/* Naam */}
      <h1 className="font-serif text-[2.4rem] leading-[1.05] font-semibold text-[#1a1a18]">
        {displayName}
      </h1>
      {displayNote && (
        <p className="font-serif italic text-[1.2rem] text-[#73726c] mt-0.5">{displayNote}</p>
      )}

      {/* Gecombineerde score */}
      <div className="mt-3 mb-1">
        <ScorePill
          score={combined.score}
          suffix={combined.conflict ? ' — advies wisselt per aandoening' : undefined}
        />
      </div>

      {/* Conflictmelding */}
      {combined.conflict && (
        <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800">
          Dit voedingsmiddel heeft een ander advies per aandoening. Zie hieronder.
        </div>
      )}

      {/* Per-aandoening */}
      <div className="mt-5 divide-y divide-[#f0efe8]">
        {conditions.map((condition) => {
          const s = item.scores[condition]
          if (!s) return (
            <div key={condition} className="py-4">
              <p className="font-semibold text-sm text-[#9c9a92]">{CONDITION_LABELS[condition]}</p>
              <p className="text-xs text-[#9c9a92] mt-1">Geen data beschikbaar</p>
            </div>
          )
          return (
            <div key={condition} className="py-4">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <p className="font-serif font-semibold text-base text-[#1a1a18]">{CONDITION_LABELS[condition]}</p>
                <ScorePill score={s.score} />
                <span className="text-xs bg-[#f0efe8] text-[#5f5e5a] rounded px-1.5 py-0.5 font-medium">
                  EV·{s.evidence}
                </span>
              </div>
              {s.note && (
                <p className="text-sm text-[#5f5e5a] leading-relaxed mb-2">{s.note.nl}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {s.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#1d9e75] hover:underline flex items-center gap-0.5"
                  >
                    {src.title}
                    <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Histamine flags */}
      {item.histamineFlags && conditions.includes('histamine') && (
        <div className="mt-1 flex gap-2 flex-wrap">
          {item.histamineFlags.liberator && (
            <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1">
              Histamineliberator
            </span>
          )}
          {item.histamineFlags.daoBlocker && (
            <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1">
              DAO-blokker
            </span>
          )}
        </div>
      )}

      {/* Alternatieven — alleen op mobiel inline */}
      {showAlternatives && alternatives.length > 0 && (
        <div className="mt-6">
          <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Betere alternatieven · veilig voor jouw profiel
          </p>
          <div className="space-y-2">
            {alternatives.map((alt) => {
              const altScore = getCombinedScore(alt, conditions)
              const altNote = alt.name.nl.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/)
              return (
                <button
                  key={alt.id}
                  onClick={() => onNavigate(alt.id)}
                  className="w-full bg-white border border-[#e0dfd7] rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-[#1d9e75] transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-sm text-[#1a1a18]">{altNote?.[1]?.trim() ?? alt.name.nl}</p>
                    {altNote?.[2] && <p className="text-xs text-[#9c9a92]">{altNote[2]}</p>}
                  </div>
                  <ScorePill score={altScore.score} />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/** Rechterkolom op desktop: alleen alternatieven */
export function AlternativesPanel({ id, conditions, onNavigate }: Omit<Props, 'showAlternatives'>) {
  const item = getItemById(id)
  if (!item) return null

  const alternatives = getAlternatives(item, conditions, 3)
  if (alternatives.length === 0) return null

  return (
    <div className="px-5 py-6">
      <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">
        Betere alternatieven
      </p>
      <p className="text-xs text-[#73726c] mb-4">
        Drie veilige opties die qua textuur en gebruik dichtbij {item.name.nl.split(' ')[0].toLowerCase()} liggen.
      </p>
      <div className="space-y-2">
        {alternatives.map((alt) => {
          const altScore = getCombinedScore(alt, conditions)
          const altNote = alt.name.nl.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/)
          return (
            <button
              key={alt.id}
              onClick={() => onNavigate(alt.id)}
              className="w-full bg-white border border-[#e0dfd7] rounded-xl px-4 py-3 flex items-center justify-between gap-3 hover:border-[#1d9e75] transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#1a1a18] truncate">{altNote?.[1]?.trim() ?? alt.name.nl}</p>
                {altNote?.[2] && <p className="text-xs text-[#9c9a92]">{altNote[2]}</p>}
              </div>
              <ScorePill score={altScore.score} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
