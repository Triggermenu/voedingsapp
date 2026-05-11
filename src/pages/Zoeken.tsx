import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { searchItems } from '@/lib/db'
import { getProfile } from '@/lib/profile'
import { ItemCard } from '@/components/ItemCard'
import { NavBar } from '@/components/NavBar'

export function Zoeken() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const profile = getProfile()
  const conditions = profile?.conditions ?? []

  const results = useMemo(() => searchItems(query, conditions), [query, conditions])

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-[#f8f7f4] border-b border-[#e0dfd7] z-10 px-4 pt-safe pt-4 pb-3">
        <h1 className="text-base font-medium text-[#1a1a18] mb-3">{t('app.name')}</h1>
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
        <p className="text-xs text-[#9c9a92] mt-2">
          {query
            ? results.length === 0
              ? t('zoeken.noResults', { query })
              : `${results.length} resultaten`
            : t('zoeken.allItems', { count: results.length })}
        </p>
      </div>

      {/* Results */}
      <div className="px-4 py-3 space-y-2">
        {results.length === 0 && query && (
          <div className="text-center py-12 text-[#73726c]">
            <div className="text-3xl mb-3">🔍</div>
            <p className="font-medium">{t('zoeken.noResults', { query })}</p>
            <p className="text-sm mt-1">{t('zoeken.noResultsHint')}</p>
          </div>
        )}
        {results.map((item) => (
          <ItemCard key={item.id} item={item} activeConditions={conditions} />
        ))}
      </div>

      <NavBar />
    </div>
  )
}
