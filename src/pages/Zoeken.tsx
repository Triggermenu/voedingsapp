import { useState, useMemo } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { searchItems, getAllItems } from '@/lib/db'
import { getProfile } from '@/lib/profile'
import { getCombinedScore } from '@/lib/scoring'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import { ItemDetailPanel, AlternativesPanel } from '@/components/ItemDetailPanel'
import { useMediaQuery } from '@/hooks/useMediaQuery'
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

function EmptyDetail() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 text-[#9c9a92]">
      <svg className="w-12 h-12 mb-4 text-[#e0dfd7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-sm font-medium text-[#73726c]">Selecteer een voedingsmiddel</p>
      <p className="text-xs mt-1">Klik op een item in de lijst voor details.</p>
    </div>
  )
}

export function Zoeken() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const profile = useMemo(() => getProfile(), [])
  const conditions = profile?.conditions ?? []
  const greeting = useMemo(() => getTimeGreeting(), [])

  const allItems = getAllItems()
  const results = useMemo(() => searchItems(query, conditions), [query, conditions])

  const availableCategories = useMemo(() => {
    const cats = new Set<Category>()
    for (const item of results) cats.add(item.category as Category)
    return Array.from(cats)
  }, [results])

  const filteredResults = useMemo(() => {
    if (activeCategories.size === 0) return results
    return results.filter((item) => activeCategories.has(item.category as Category))
  }, [results, activeCategories])

  const grouped = useMemo(() => {
    if (query) return null
    const map = new Map<Category, typeof filteredResults>()
    for (const item of filteredResults) {
      const cat = item.category as Category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return map
  }, [query, filteredResults])

  const toggleCategory = (cat: Category) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  const handleItemClick = (id: string) => {
    if (isDesktop) {
      setSelectedId(id)
    } else {
      navigate(`/item/${id}`)
    }
  }

  const conditionLabels = conditions.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' & ')

  // ── Zoeklijst (gedeeld tussen mobile en desktop linkerkolom) ──────────────
  const ListContent = (
    <>
      {/* Geen resultaten */}
      {filteredResults.length === 0 && (query || activeCategories.size > 0) && (
        <div className="text-center py-16 px-4 text-[#73726c]">
          <p className="font-medium text-[#3d3d3a]">
            {query ? `Geen resultaten voor "${query}"` : 'Geen items in geselecteerde categorieën'}
          </p>
          <p className="text-sm mt-1">Probeer een andere zoekterm of filter.</p>
        </div>
      )}

      {/* Zoekresultaten (platte lijst) */}
      {query && filteredResults.length > 0 && (
        <div className="px-4 py-3 divide-y divide-[#f0efe8]">
          {filteredResults.map((item) => {
            const combined = getCombinedScore(item, conditions)
            const hasConflict = combined.conflict
            const firstNote = !hasConflict
              ? conditions.map((c) => item.scores[c]?.note?.nl).find(Boolean)
              : undefined
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left py-3.5 flex items-center justify-between gap-3 -mx-4 px-4 transition-colors ${
                  selectedId === item.id && isDesktop
                    ? 'bg-[#f0faf5]'
                    : 'hover:bg-[#f0efe8]'
                }`}
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

      {/* Gecategoriseerd (browse-modus) */}
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
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full text-left py-3.5 px-4 flex items-center justify-between gap-3 transition-colors ${
                        selectedId === item.id && isDesktop
                          ? 'bg-[#f0faf5]'
                          : 'hover:bg-[#f0efe8]'
                      }`}
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
    </>
  )

  // ── Gedeelde header ───────────────────────────────────────────────────────
  const Header = (
    <div className="bg-[#f8f7f4] z-10 px-4 pt-safe pt-4 pb-3 border-b border-[#e0dfd7]">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => { setQuery(''); setSelectedId(null); setActiveCategories(new Set()) }}
          className="flex items-center gap-2"
        >
          <Logo size={28} />
          <span className="font-serif font-semibold text-[#1a1a18] text-base">Triggermenu</span>
        </button>
        <div className="flex items-center gap-2">
          {/* Desktop navigatie */}
          {isDesktop && (
            <nav className="hidden lg:flex items-center gap-0.5 mr-1">
              {([
                { to: '/scan', label: 'Scan' },
                { to: '/bronnen', label: 'Bronnen' },
                { to: '/instellingen', label: 'Profiel' },
              ] as const).map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#1d9e75] bg-[#f0faf5]'
                        : 'text-[#73726c] hover:text-[#1a1a18] hover:bg-[#f0efe8]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
          {/* Profielindicator — desktop */}
          {isDesktop && conditions.length > 0 && (
            <span className="hidden lg:flex items-center gap-1.5 text-xs text-[#5f5e5a] bg-white border border-[#e0dfd7] rounded-full px-3 py-1">
              {conditionLabels}
            </span>
          )}
          <button
            onClick={() => setFilterOpen(true)}
            className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
              activeCategories.size > 0 ? 'border-[#1d9e75] bg-[#f0faf5]' : 'border-[#e0dfd7] bg-white'
            }`}
          >
            <svg className={`w-4 h-4 ${activeCategories.size > 0 ? 'text-[#1d9e75]' : 'text-[#73726c]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            {activeCategories.size > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#1d9e75] text-white text-[8px] font-bold flex items-center justify-center">
                {activeCategories.size}
              </span>
            )}
          </button>
        </div>
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

      {/* Legenda */}
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
  )

  // ── Filter sheet (gedeeld) ────────────────────────────────────────────────
  const FilterSheet = filterOpen && (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => setFilterOpen(false)} />
      <div className="relative bg-white rounded-t-2xl px-4 pt-4 pb-8 space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="font-serif font-semibold text-[#1a1a18]">Filter op categorie</p>
          <div className="flex items-center gap-3">
            {activeCategories.size > 0 && (
              <button
                onClick={() => setActiveCategories(new Set())}
                className="text-xs text-[#1d9e75] font-medium"
              >
                Wis filters
              </button>
            )}
            <button onClick={() => setFilterOpen(false)} className="w-7 h-7 rounded-full bg-[#f0efe8] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#73726c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((cat) => {
            const isActive = activeCategories.has(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  isActive
                    ? 'bg-[#1d9e75] border-[#1d9e75] text-white'
                    : 'bg-white border-[#e0dfd7] text-[#1a1a18]'
                }`}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setFilterOpen(false)}
          className="w-full bg-[#1d9e75] text-white font-medium py-3 rounded-xl"
        >
          Toon resultaten{activeCategories.size > 0 ? ` (${filteredResults.length})` : ''}
        </button>
      </div>
    </div>
  )

  // ── Desktop: drie-koloms layout ───────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="h-screen flex flex-col bg-[#f8f7f4] overflow-hidden">
        {Header}

        <div className="flex-1 overflow-hidden grid grid-cols-[340px_1fr_300px] divide-x divide-[#e0dfd7]">
          {/* Linkerkolom: zoeklijst */}
          <div className="overflow-y-auto">
            {ListContent}
          </div>

          {/* Middelste kolom: itemdetail */}
          <div className="overflow-y-auto bg-white">
            {selectedId
              ? <ItemDetailPanel
                  id={selectedId}
                  conditions={conditions}
                  onNavigate={setSelectedId}
                />
              : <EmptyDetail />
            }
          </div>

          {/* Rechterkolom: alternatieven */}
          <div className="overflow-y-auto bg-[#fafaf8]">
            {selectedId && (
              <AlternativesPanel
                id={selectedId}
                conditions={conditions}
                onNavigate={setSelectedId}
              />
            )}
          </div>
        </div>

        {FilterSheet}
      </div>
    )
  }

  // ── Mobiel: bestaande layout ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      <div className="sticky top-0">
        {Header}
      </div>

      {ListContent}

      {FilterSheet}

      <NavBar />
    </div>
  )
}
