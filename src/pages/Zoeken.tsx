import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { searchItems } from '@/lib/db'
import { getProfile } from '@/lib/profile'
import { ItemCard } from '@/components/ItemCard'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import type { Condition, Category } from '@/schemas/item'

const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht',
  migraine: 'Migraine',
  nierstenen: 'Nierstenen',
  histamine: 'Histamine',
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
  'dranken-alcohol': 'Dranken — alcohol',
  'dranken-non-alcohol': 'Dranken — non-alcohol',
  zoetwaren: 'Zoetwaren & snacks',
  'sauzen-kruiden': 'Sauzen & kruiden',
  'bereid-gerecht': 'Bereide gerechten',
  overig: 'Overig',
}

const SCORE_LEGEND = [
  { score: 0, label: 'Veilig', color: 'bg-emerald-500' },
  { score: 1, label: 'Matig', color: 'bg-yellow-400' },
  { score: 2, label: 'Voorzichtig', color: 'bg-orange-500' },
  { score: 3, label: 'Vermijden', color: 'bg-red-600' },
]

export function Zoeken() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const profile = getProfile()
  const conditions = profile?.conditions ?? []

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

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#f8f7f4] border-b border-[#e0dfd7] z-10 px-4 pt-safe pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <Logo size={28} />
          <div>
            <h1 className="text-base font-semibold text-[#1a1a18] leading-tight">{t('app.name')}</h1>
            <p className="text-[10px] text-[#9c9a92] leading-tight">{t('app.tagline')}</p>
          </div>
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9a92]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('zoeken.placeholder')}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e0dfd7] rounded-xl text-sm text-[#1a1a18] placeholder-[#9c9a92] focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75]"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-[#9c9a92]">
            {query
              ? results.length === 0
                ? t('zoeken.noResults', { query })
                : `${results.length} resultaten`
              : t('zoeken.allItems', { count: results.length })}
          </p>
          {conditions.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end">
              {conditions.map((c) => (
                <span
                  key={c}
                  className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full px-2 py-0.5 leading-none"
                >
                  {CONDITION_LABELS[c]}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* No results */}
      {results.length === 0 && query && (
        <div className="text-center py-16 px-4 text-[#73726c]">
          <svg className="w-12 h-12 mx-auto mb-3 text-[#c8c7bf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="font-medium text-[#3d3d3a]">{t('zoeken.noResults', { query })}</p>
          <p className="text-sm mt-1">{t('zoeken.noResultsHint')}</p>
        </div>
      )}

      {/* Search results — flat list */}
      {query && results.length > 0 && (
        <div className="px-4 py-3 space-y-2">
          {results.map((item) => (
            <ItemCard key={item.id} item={item} activeConditions={conditions} />
          ))}
        </div>
      )}

      {/* No query — grouped by category */}
      {!query && grouped && (
        <>
          {/* Score legend */}
          <div className="mx-4 mt-3 mb-1 flex items-center gap-3 flex-wrap">
            {SCORE_LEGEND.map(({ score, label, color }) => (
              <div key={score} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
                <span className="text-[10px] text-[#73726c]">{label}</span>
              </div>
            ))}
          </div>

          {Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat} className="px-4 pt-4">
              <h2 className="text-xs font-semibold text-[#9c9a92] uppercase tracking-widest mb-2">
                {CATEGORY_LABELS[cat] ?? cat}
                <span className="font-normal ml-1.5 normal-case tracking-normal">({items.length})</span>
              </h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} activeConditions={conditions} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <NavBar />
    </div>
  )
}
