import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchItems, getAllItems } from '@/lib/db'
import { getProfile } from '@/lib/profile'
import { getCombinedScore } from '@/lib/scoring'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import type { Condition, Category } from '@/schemas/item'

const CONDITION_SHORT: Record<Condition, string> = {
  jicht: 'JIC',
  migraine: 'MIG',
  nierstenen: 'NIE',
  histamine: 'HIS',
}

const CATEGORY_LABELS: Partial<Record<Category, string>> = {
  groente: 'Groente',
  fruit: 'Fruit',
  granen: 'Granen & brood',
  peulvruchten: 'Peulvruchten',
  'noten-zaden': 'Noten & zaden',
  vlees: 'Vlees & gevogelte',
  'vis-schaaldieren': 'Vis & schaaldieren',
  zuivel: 'Zuivel & eieren',
  eieren: 'Eieren',
  'dranken-alcohol': 'Alcohol',
  'dranken-non-alcohol': 'Dranken',
  zoetwaren: 'Zoetwaren & snacks',
  'sauzen-kruiden': 'Sauzen & kruiden',
}

function getTimeGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'vanochtend'
  if (h >= 12 && h < 17) return 'vandaag'
  return 'vanavond'
}

function ScoreChip({ score, label }: { score: number | null; label: string }) {
  const bg =
    score === 0 ? 'bg-[#c6e3d5]' :
    score === 1 ? 'bg-[#e8ddb5]' :
    score === 2 ? 'bg-[#f0c4a0]' :
    score === 3 ? 'bg-[#f0adad]' :
    'bg-[#e0dfd7]'
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`w-[22px] h-[22px] rounded-[5px] ${bg}`} />
      <span className="text-[8px] font-semibold tracking-wide text-[#9c9a92] uppercase">{label}</span>
    </div>
  )
}

export function Zoeken() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const greeting = useMemo(() => getTimeGreeting(), [])

  const allItems = useMemo(() => getAllItems(), [])
  const results = useMemo(() => searchItems(query, conditions), [query, conditions])

  const grouped = useMemo(() => {
    if (query) return null
    const map = new Map<Category, typeof results>()
    for (const item of results) {
      const cat = item.category as Category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return map
  }, [query, results])

  const conditionLabels = conditions.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' & ')

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#f8f7f4] z-10 px-4 pt-safe pt-4 pb-3 border-b border-[#e0dfd7]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-serif font-semibold text-[#1a1a18] text-base">Triggermenu</span>
          </div>
          <button className="w-8 h-8 rounded-full border border-[#e0dfd7] bg-white flex items-center justify-center">
            <svg className="w-4 h-4 text-[#73726c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
          </button>
        </div>

        {!query && (
          <div className="mb-3">
            <h1 className="font-serif text-[1.7rem] leading-tight font-semibold text-[#1a1a18]">
              Wat eet je <em className="not-italic italic text-[#1d9e75]">{greeting}</em>?
            </h1>
            <p className="text-xs text-[#9c9a92] mt-0.5">
              {allItems.length} items · advies voor {conditionLabels}
            </p>
          </div>
        )}

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9a92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zoek een voedingsmiddel..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e0dfd7] rounded-xl text-sm text-[#1a1a18] placeholder-[#9c9a92] focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75]"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
          <span className="text-[10px] text-[#9c9a92] tracking-widest uppercase font-semibold">Stoplicht</span>
          {[
            { label: 'Veilig', color: 'bg-[#c6e3d5]' },
            { label: 'Matig', color: 'bg-[#e8ddb5]' },
            { label: 'Voorzichtig', color: 'bg-[#f0c4a0]' },
            { label: 'Vermijden', color: 'bg-[#f0adad]' },
          ].map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1 text-[10px] text-[#73726c] tracking-wide">
              <span className={`w-2 h-2 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* No results */}
      {results.length === 0 && query && (
        <div className="text-center py-16 px-4 text-[#73726c]">
          <p className="font-medium text-[#3d3d3a]">Geen resultaten voor &ldquo;{query}&rdquo;</p>
          <p className="text-sm mt-1">Probeer een andere zoekterm.</p>
        </div>
      )}

      {/* Search results */}
      {query && results.length > 0 && (
        <div className="px-4 py-3 divide-y divide-[#f0efe8]">
          {results.map((item) => {
            const combined = getCombinedScore(item, conditions)
            const hasConflict = combined.conflict
            const firstNote = !hasConflict
              ? conditions.map((c) => item.scores[c]?.note?.nl).find(Boolean)
              : undefined
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)}
                className="w-full text-left py-3.5 flex items-center justify-between gap-3 hover:bg-[#f0efe8] -mx-4 px-4 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-serif font-semibold text-[1.05rem] text-[#1a1a18] leading-snug">{item.name.nl}</p>
                  <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase mt-0.5">
                    {CATEGORY_LABELS[item.category as Category] ?? item.category}
                    {hasConflict && ' · Tegenstrijdig advies'}
                    {firstNote && ` · ${firstNote}`}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  {conditions.map((c) => {
                    const s = item.scores[c]
                    return <ScoreChip key={c} score={s?.score ?? null} label={CONDITION_SHORT[c]} />
                  })}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Grouped */}
      {!query && grouped && (
        <div>
          {Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat}>
              <div className="px-4 pt-5 pb-2">
                <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold">
                  {CATEGORY_LABELS[cat] ?? cat} · {items.length}
                </p>
              </div>
              <div className="divide-y divide-[#f0efe8]">
                {items.map((item) => {
                  const combined = getCombinedScore(item, conditions)
                  const hasConflict = combined.conflict
                  const firstNote = !hasConflict
                    ? conditions.map((c) => item.scores[c]?.note?.nl).find(Boolean)
                    : undefined
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="w-full text-left py-3.5 px-4 flex items-center justify-between gap-3 hover:bg-[#f0efe8] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-serif font-semibold text-[1.05rem] text-[#1a1a18] leading-snug">{item.name.nl}</p>
                        <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase mt-0.5">
                          {CATEGORY_LABELS[cat] ?? cat}
                          {hasConflict && ' · Tegenstrijdig advies'}
                          {firstNote && ` · ${firstNote}`}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {conditions.map((c) => {
                          const s = item.scores[c]
                          return <ScoreChip key={c} score={s?.score ?? null} label={CONDITION_SHORT[c]} />
                        })}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <NavBar />
    </div>
  )
}
