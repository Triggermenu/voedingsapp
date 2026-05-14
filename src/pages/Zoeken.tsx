import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchItems, getAllItems, getAlternatives } from '@/lib/db'
import { getProfile } from '@/lib/profile'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import { ItemDetailPanel, AlternativesPanel } from '@/components/ItemDetailPanel'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { FoodItem, Condition, Category } from '@/schemas/item'

// ── Constants ────────────────────────────────────────────────────────────────
const COND_SHORT: Record<Condition, string> = {
  jicht:      'JCH',
  migraine:   'MIG',
  nierstenen: 'NIE',
  histamine:  'HIS',
}

const COND_LONG: Record<Condition, string> = {
  jicht:      'Jicht',
  migraine:   'Migraine',
  nierstenen: 'Nieren',
  histamine:  'Histamine',
}

const CATEGORY_LABELS: Partial<Record<Category, string>> = {
  groente:              'Groente',
  fruit:                'Fruit',
  granen:               'Granen & brood',
  peulvruchten:         'Peulvruchten',
  'noten-zaden':        'Noten & zaden',
  vlees:                'Vlees & gevogelte',
  'vis-schaaldieren':   'Vis & schaaldieren',
  zuivel:               'Zuivel & eieren',
  eieren:               'Eieren',
  'dranken-alcohol':    'Alcohol',
  'dranken-non-alcohol':'Dranken',
  zoetwaren:            'Zoetwaren & snacks',
  'sauzen-kruiden':     'Sauzen & kruiden',
}

// ── Score → status ────────────────────────────────────────────────────────
type CellStatus = 'safe' | 'ok' | 'warn' | 'avoid' | 'null'

function scoreToStatus(score: number | null): CellStatus {
  if (score === null) return 'null'
  if (score === 0) return 'safe'
  if (score === 1) return 'ok'
  if (score === 2) return 'warn'
  return 'avoid'
}

// ── CondCell — colored block per condition ────────────────────────────────
function CondCell({ status, label }: { status: CellStatus; label: string }) {
  return (
    <div className={`colorblock ${status}`} style={{ width: 30, minHeight: 38 }}>
      <span className="lbl">{label}</span>
    </div>
  )
}

// ── CardC — expandable search row ─────────────────────────────────────────
function CardC({
  item,
  conditions,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: FoodItem
  conditions: Condition[]
  expanded: boolean
  onToggle: () => void
  onNavigate: (id: string) => void
}) {
  const alternatives = useMemo(() => {
    if (!expanded) return []
    return getAlternatives(item, conditions, 3)
  }, [expanded, item, conditions])

  // Extract subcategory (everything after the first " (" or use name sub-part)
  const nameParts = item.name.nl.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/)
  const baseName = nameParts?.[1]?.trim() ?? item.name.nl
  const sub = nameParts?.[2]?.trim()

  return (
    <div style={{
      padding: `calc(12px * var(--density)) 14px`,
      borderBottom: expanded ? 'none' : '1px solid var(--rule-soft)',
      background: expanded ? 'var(--paper)' : 'transparent',
      borderRadius: expanded ? 12 : 0,
      border: expanded ? '1px solid var(--rule)' : undefined,
      marginBottom: expanded ? 4 : 0,
    }}>
      <div className="flex items-center gap-2.5">
        {/* Name + category */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="serif"
            style={{ fontSize: 17, lineHeight: 1.1, fontWeight: 500, letterSpacing: -0.2, color: 'var(--ink)' }}
          >
            {baseName}
            {sub && (
              <em style={{ fontStyle: 'italic', color: 'var(--muted)', fontWeight: 400 }}> · {sub}</em>
            )}
          </div>
          <div className="eyebrow" style={{ fontSize: 9.5, marginTop: 3 }}>
            {CATEGORY_LABELS[item.category as Category] ?? item.category}
          </div>
        </div>

        {/* 4 condition cells */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${conditions.length}, 30px)`, gap: 4 }}>
          {conditions.map((c) => (
            <CondCell
              key={c}
              status={scoreToStatus(item.scores[c]?.score ?? null)}
              label={COND_SHORT[c]}
            />
          ))}
        </div>

        {/* Chevron */}
        <button
          onClick={onToggle}
          style={{
            background: 'transparent', border: 'none',
            width: 22, height: 22, padding: 0,
            color: 'var(--muted)', cursor: 'pointer', flexShrink: 0,
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform .15s',
          }}
          aria-label={expanded ? 'Inklappen' : 'Uitklappen'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--rule-soft)' }}>
          {/* Per-condition detail */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
            {conditions.map((c) => {
              const scoreObj = item.scores[c]
              const status = scoreToStatus(scoreObj?.score ?? null)
              const statusLabel = { safe: 'Veilig', ok: 'Matig', warn: 'Voorzichtig', avoid: 'Vermijden', null: 'Onbekend' }[status]
              return (
                <div key={c}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span
                      style={{
                        width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                        background: status !== 'null' ? `var(--${status})` : 'var(--rule)',
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{COND_LONG[c]}</span>
                    <span style={{ fontSize: 11, color: status !== 'null' ? `var(--${status}-ink)` : 'var(--muted)' }}>
                      {statusLabel}
                    </span>
                  </div>
                  {scoreObj?.note?.nl && (
                    <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
                      {scoreObj.note.nl}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Alternatives chips */}
          {alternatives.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--rule-soft)' }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Betere alternatieven</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => onNavigate(alt.id)}
                    style={{
                      fontSize: 12, padding: '4px 9px', borderRadius: 999,
                      background: 'var(--safe-bg)', color: 'var(--safe-ink)',
                      border: '1px solid color-mix(in srgb, var(--safe) 25%, transparent)',
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    {alt.name.nl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Detail link */}
          <button
            onClick={() => onNavigate(item.id)}
            style={{
              marginTop: 12, fontSize: 12, color: 'var(--brand)',
              background: 'none', border: 'none', padding: 0,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            Volledige details
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ── EmptyDetail ───────────────────────────────────────────────────────────
function EmptyDetail() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8" style={{ color: 'var(--muted)' }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginBottom: 16, color: 'var(--rule)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-soft)' }}>Selecteer een voedingsmiddel</p>
      <p style={{ fontSize: 12, marginTop: 4 }}>Klik op een item in de lijst voor details.</p>
    </div>
  )
}

// ── LegendBar ─────────────────────────────────────────────────────────────
function LegendBar() {
  return (
    <div style={{
      padding: '10px 20px',
      borderBottom: '1px solid var(--rule-soft)',
      display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
    }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {([['safe', 'Veilig'], ['ok', 'Matig'], ['warn', 'Voorzichtig'], ['avoid', 'Vermijden']] as const).map(([s, l]) => (
          <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--ink-soft)' }}>
            <i style={{ width: 8, height: 8, borderRadius: 2, background: `var(--${s})`, display: 'inline-block' }} />
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────
function getTimeGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'vanochtend'
  if (h >= 12 && h < 17) return 'vandaag'
  return 'vanavond'
}

// ── Main Zoeken ───────────────────────────────────────────────────────────
export function Zoeken() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 1280px)')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const greeting = useMemo(() => getTimeGreeting(), [])

  const allItems = useMemo(() => getAllItems(), [])
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
    const map = new Map<Category, typeof filteredResults>()
    for (const item of filteredResults) {
      const cat = item.category as Category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return map
  }, [filteredResults])

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
      setExpandedId(null)
    } else {
      navigate(`/item/${id}`)
    }
  }

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const conditionLabels = conditions
    .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
    .join(' & ')

  // ── Shared search header ────────────────────────────────────────────────
  const SearchHeader = (
    <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--rule)' }}
      className="sticky top-0 z-10 px-5 pt-safe pt-4 pb-3"
    >
      <div className="flex items-center justify-between mb-3">
        <Logo size={18} />
        <div className="flex items-center gap-2">
          {isDesktop && conditions.length > 0 && (
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {conditions.map((c) => COND_SHORT[c]).join(' · ')}
            </span>
          )}
          <button
            onClick={() => setFilterOpen(true)}
            style={{
              width: 30, height: 30, borderRadius: 8,
              border: `1px solid ${activeCategories.size > 0 ? 'var(--brand)' : 'var(--rule)'}`,
              background: activeCategories.size > 0 ? 'var(--brand-50)' : 'var(--paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: activeCategories.size > 0 ? 'var(--brand)' : 'var(--ink-soft)',
              cursor: 'pointer', position: 'relative',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 6h18M6 12h12M10 18h4" />
            </svg>
            {activeCategories.size > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                width: 14, height: 14, borderRadius: '50%',
                background: 'var(--brand)', color: '#fff',
                fontSize: 8, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {activeCategories.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {!query && (
        <div className="mb-3">
          <h1 className="serif" style={{ fontSize: 26, lineHeight: 1.05, fontWeight: 500, margin: '8px 0 6px', letterSpacing: -0.5, color: 'var(--ink)' }}>
            Wat eet je {greeting}?
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
            {allItems.length} voedingsmiddelen · profiel: {conditionLabels}
          </p>
        </div>
      )}

      {/* Search input */}
      <div style={{
        height: 44, borderRadius: 10,
        background: 'var(--paper)', border: '1px solid var(--rule)',
        display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek een voedingsmiddel…"
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            fontSize: 14, color: 'var(--ink)', fontFamily: 'inherit',
          }}
          autoComplete="off"
          autoCorrect="off"
        />
        {!query && (
          <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', border: '1px solid var(--rule)', padding: '2px 6px', borderRadius: 4 }}>
            ⌘K
          </span>
        )}
      </div>
    </div>
  )

  // ── List content ────────────────────────────────────────────────────────
  const ListContent = (
    <>
      <LegendBar />

      {filteredResults.length === 0 && (query || activeCategories.size > 0) && (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: 'var(--ink-soft)' }}>
          <p style={{ fontWeight: 500, color: 'var(--ink)' }}>
            {query ? `Geen resultaten voor "${query}"` : 'Geen items in geselecteerde categorieën'}
          </p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Probeer een andere zoekterm of filter.</p>
        </div>
      )}

      {/* Grouped list */}
      <div style={{ padding: '8px 14px 110px' }}>
        {Array.from(grouped.entries()).map(([cat, items]) => (
          <div key={cat}>
            <div className="eyebrow" style={{ padding: '12px 6px 6px' }}>
              {CATEGORY_LABELS[cat] ?? cat} · {items.length}
            </div>
            {items.map((item) => (
              <CardC
                key={item.id}
                item={item}
                conditions={conditions}
                expanded={expandedId === item.id}
                onToggle={() => handleToggle(item.id)}
                onNavigate={handleItemClick}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  )

  // ── Filter sheet ────────────────────────────────────────────────────────
  const FilterSheet = filterOpen && (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,.35)' }} onClick={() => setFilterOpen(false)} />
      <div style={{
        position: 'relative', background: 'var(--paper)',
        borderRadius: '16px 16px 0 0', padding: '16px 16px 32px',
        maxHeight: '70vh', overflowY: 'auto',
      }}>
        <div className="flex items-center justify-between mb-4">
          <p className="serif" style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>Filter op categorie</p>
          <div className="flex items-center gap-3">
            {activeCategories.size > 0 && (
              <button
                onClick={() => setActiveCategories(new Set())}
                style={{ fontSize: 12, color: 'var(--brand)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Wis filters
              </button>
            )}
            <button
              onClick={() => setFilterOpen(false)}
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--paper-2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {availableCategories.map((cat) => {
            const isActive = activeCategories.has(cat)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500,
                  background: isActive ? 'var(--ink)' : 'transparent',
                  color: isActive ? 'var(--paper)' : 'var(--ink-soft)',
                  border: isActive ? 'none' : '1px solid var(--rule)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setFilterOpen(false)}
          style={{
            width: '100%', height: 48, borderRadius: 12,
            background: 'var(--brand)', color: '#fff',
            border: 'none', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Toon resultaten{activeCategories.size > 0 ? ` (${filteredResults.length})` : ''}
        </button>
      </div>
    </div>
  )

  // ── Desktop: drie-koloms layout ────────────────────────────────────────
  if (isDesktop) {
    return (
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>
        {/* Desktop header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: '1px solid var(--rule)' }}>
          <Logo size={20} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {['Zoeken', 'Bronnen', 'Profiel'].map((t, i) => (
              <span
                key={t}
                style={{
                  fontSize: 13.5, fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? 'var(--ink)' : 'var(--muted)',
                  position: 'relative', cursor: i > 0 ? 'pointer' : 'default',
                }}
                onClick={i === 1 ? () => navigate('/bronnen') : i === 2 ? () => navigate('/instellingen') : undefined}
              >
                {t}
                {i === 0 && (
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: -22, height: 2, background: 'var(--brand)', borderRadius: 1 }} />
                )}
              </span>
            ))}
          </div>
          {conditions.length > 0 && (
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              {conditions.map((c) => COND_SHORT[c]).join(' · ')}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-hidden" style={{ display: 'grid', gridTemplateColumns: '340px 1fr 380px', borderTop: '1px solid var(--rule)' }}>
          {/* Left: list */}
          <div style={{ borderRight: '1px solid var(--rule)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Search input */}
            <div style={{ padding: 16, borderBottom: '1px solid var(--rule-soft)' }}>
              <div style={{ height: 40, borderRadius: 10, background: 'var(--paper)', border: '1px solid var(--rule)', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Zoek voedingsmiddel…"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--ink)', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Alle', ...availableCategories.slice(0, 5)].map((c) => {
                  const isAll = c === 'Alle'
                  const isActive = isAll ? activeCategories.size === 0 : activeCategories.has(c as Category)
                  return (
                    <span
                      key={c}
                      onClick={() => isAll ? setActiveCategories(new Set()) : toggleCategory(c as Category)}
                      style={{
                        fontSize: 11.5, padding: '5px 10px', borderRadius: 999, cursor: 'pointer',
                        background: isActive ? 'var(--ink)' : 'transparent',
                        color: isActive ? 'var(--paper)' : 'var(--ink-soft)',
                        border: isActive ? 'none' : '1px solid var(--rule)',
                      }}
                    >
                      {isAll ? 'Alle' : CATEGORY_LABELS[c as Category] ?? c}
                    </span>
                  )
                })}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
              {Array.from(grouped.entries()).map(([cat, items]) => (
                <div key={cat}>
                  <div className="eyebrow" style={{ padding: '8px 4px 4px' }}>
                    {CATEGORY_LABELS[cat] ?? cat} · {items.length}
                  </div>
                  {items.map((item) => {
                    const nameParts = item.name.nl.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/)
                    const baseName = nameParts?.[1]?.trim() ?? item.name.nl
                    const sub = nameParts?.[2]?.trim()
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        style={{
                          padding: 12, borderBottom: '1px solid var(--rule-soft)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                          background: selectedId === item.id ? 'var(--brand-50)' : 'transparent',
                          borderRadius: selectedId === item.id ? 8 : 0,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="serif" style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink)' }}>
                            {baseName}
                            {sub && <em style={{ fontStyle: 'italic', color: 'var(--muted)', fontWeight: 400 }}> · {sub}</em>}
                          </div>
                          <div className="eyebrow" style={{ fontSize: 9, marginTop: 2 }}>{CATEGORY_LABELS[cat] ?? cat}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${conditions.length}, 18px)`, gap: 2 }}>
                          {conditions.map((c) => {
                            const s = scoreToStatus(item.scores[c]?.score ?? null)
                            return (
                              <i key={c} style={{ height: 14, borderRadius: 2, background: s !== 'null' ? `var(--${s})` : 'var(--rule)' }} />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Middle: detail */}
          <div style={{ overflowY: 'auto', background: 'var(--paper)' }}>
            {selectedId
              ? <ItemDetailPanel id={selectedId} conditions={conditions} onNavigate={setSelectedId} />
              : <EmptyDetail />
            }
          </div>

          {/* Right: alternatives */}
          <div style={{ overflowY: 'auto', background: 'var(--bg)', borderLeft: '1px solid var(--rule)' }}>
            {selectedId && (
              <AlternativesPanel id={selectedId} conditions={conditions} onNavigate={setSelectedId} />
            )}
          </div>
        </div>

        {FilterSheet}
      </div>
    )
  }

  // ── Mobile ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <div className="sticky top-0">
        {SearchHeader}
      </div>

      {ListContent}

      {FilterSheet}

      <NavBar />
    </div>
  )
}
