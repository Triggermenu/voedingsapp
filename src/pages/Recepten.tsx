import { useState, useMemo, useRef, useEffect } from 'react'
import { getProfile } from '@/lib/profile'
import { getAllItems } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { ItemCard } from '@/components/ItemCard'
import { NavBar } from '@/components/NavBar'
import { StoplichtBadge } from '@/components/StoplichtBadge'
import { Logo } from '@/components/Logo'
import type { FoodItem, Condition } from '@/schemas/item'

const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht',
  migraine: 'Migraine',
  nierstenen: 'Nierstenen',
  histamine: 'Histamine',
}

export function Recepten() {
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const allItems = useMemo(() => getAllItems(), [])

  const [selected, setSelected] = useState<FoodItem[]>([])
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allItems
      .filter((item) => {
        const hasCondition = conditions.some((c) => item.scores[c] !== null)
        const matchesQuery = item.name.nl.toLowerCase().includes(q) || item.name.en.toLowerCase().includes(q)
        const notAlreadyAdded = !selected.some((s) => s.id === item.id)
        return hasCondition && matchesQuery && notAlreadyAdded
      })
      .slice(0, 8)
  }, [query, allItems, conditions, selected])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function addItem(item: FoodItem) {
    setSelected((prev) => [...prev, item])
    setQuery('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  function removeItem(id: string) {
    setSelected((prev) => prev.filter((i) => i.id !== id))
  }

  // Worst score per condition across all selected items
  const recipeSummary = useMemo(() => {
    if (selected.length === 0) return null
    const result: Partial<Record<Condition, number>> = {}
    for (const condition of conditions) {
      let worst = -1
      for (const item of selected) {
        const s = item.scores[condition]
        if (s !== null && s !== undefined && s.score > worst) worst = s.score
      }
      if (worst >= 0) result[condition] = worst
    }
    const scores = Object.values(result)
    const overallWorst = scores.length > 0 ? Math.max(...scores) : null
    return { perCondition: result, overall: overallWorst }
  }, [selected, conditions])

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#f8f7f4] border-b border-[#e0dfd7] z-10 px-4 pt-safe pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <Logo size={28} />
          <div>
            <h1 className="text-base font-semibold text-[#1a1a18] leading-tight">Recept checken</h1>
            <p className="text-[10px] text-[#9c9a92] leading-tight">Voeg ingrediënten toe en zie het totaalplaatje</p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9a92]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true) }}
            onFocus={() => { if (query) setShowDropdown(true) }}
            placeholder="Ingrediënt toevoegen..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e0dfd7] rounded-xl text-sm text-[#1a1a18] placeholder-[#9c9a92] focus:outline-none focus:border-[#1d9e75] focus:ring-1 focus:ring-[#1d9e75]"
            autoComplete="off"
            autoCorrect="off"
          />

          {/* Dropdown suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e0dfd7] rounded-xl shadow-lg z-20 overflow-hidden">
              {suggestions.map((item) => {
                const score = getCombinedScore(item, conditions)
                return (
                  <button
                    key={item.id}
                    onMouseDown={(e) => { e.preventDefault(); addItem(item) }}
                    className="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 hover:bg-[#f8f7f4] border-b border-[#f0efe8] last:border-0 transition-colors"
                  >
                    <span className="text-sm text-[#1a1a18]">{item.name.nl}</span>
                    <StoplichtBadge score={score.score} size="sm" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Empty state */}
      {selected.length === 0 && (
        <div className="text-center py-16 px-6 text-[#73726c]">
          <div className="text-4xl mb-3">🥗</div>
          <p className="font-medium text-[#3d3d3a] mb-1">Voeg ingrediënten toe</p>
          <p className="text-sm">Zoek hierboven naar voedingsmiddelen om je recept samen te stellen.</p>
        </div>
      )}

      {/* Recipe summary */}
      {recipeSummary && selected.length > 0 && (
        <div className="mx-4 mt-4 bg-white rounded-xl border border-[#e0dfd7] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0dfd7] flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1a1a18]">Recept totaal</span>
            <StoplichtBadge score={recipeSummary.overall} size="md" />
          </div>
          {conditions.length > 1 && (
            <div className="px-4 py-2.5 flex gap-3 flex-wrap">
              {conditions.map((c) => {
                const s = recipeSummary.perCondition[c]
                return s !== undefined ? (
                  <span key={c} className="flex items-center gap-1.5 text-xs text-[#73726c]">
                    <StoplichtBadge score={s} size="sm" showLabel={false} />
                    {CONDITION_LABELS[c]}
                  </span>
                ) : null
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected items */}
      {selected.length > 0 && (
        <div className="px-4 pt-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-[#9c9a92]">{selected.length} ingrediënt{selected.length !== 1 ? 'en' : ''}</p>
            <button
              onClick={() => setSelected([])}
              className="text-xs text-[#9c9a92] hover:text-red-500 transition-colors"
            >
              Alles wissen
            </button>
          </div>
          {selected.map((item) => (
            <div key={item.id} className="relative">
              <ItemCard item={item} activeConditions={conditions} />
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-3 right-10 w-5 h-5 rounded-full bg-[#e0dfd7] hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors z-10"
                aria-label={`${item.name.nl} verwijderen`}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <NavBar />
    </div>
  )
}
