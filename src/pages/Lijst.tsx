import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getList, clearList, toggleList } from '@/lib/list'
import { getItemById } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { getProfile } from '@/lib/profile'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import type { Condition, Category } from '@/schemas/item'

const CATEGORY_LABELS: Partial<Record<Category, string>> = {
  groente: 'Groente', fruit: 'Fruit', granen: 'Granen & brood',
  peulvruchten: 'Peulvruchten', 'noten-zaden': 'Noten & zaden',
  vlees: 'Vlees & gevogelte', 'vis-schaaldieren': 'Vis & schaaldieren',
  zuivel: 'Zuivel', eieren: 'Eieren', 'dranken-alcohol': 'Alcohol',
  'dranken-non-alcohol': 'Dranken', zoetwaren: 'Zoetwaren & snacks',
  'sauzen-kruiden': 'Sauzen & kruiden', 'bereid-gerecht': 'Bereide gerechten', overig: 'Overig',
}

type CellStatus = 'safe' | 'ok' | 'warn' | 'avoid' | 'null'

function scoreToStatus(score: number | null): CellStatus {
  if (score === null) return 'null'
  return (['safe', 'ok', 'warn', 'avoid'] as const)[score] ?? 'null'
}

const COND_SHORT: Record<Condition, string> = {
  jicht: 'JCH', migraine: 'MIG', nierstenen: 'NIE', histamine: 'HIS',
}

function MiniCondDot({ status, label }: { status: CellStatus; label: string }) {
  const colors: Record<CellStatus, string> = {
    safe: 'var(--safe)', ok: 'var(--ok)', warn: 'var(--warn)', avoid: 'var(--avoid)', null: 'var(--rule)',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status] }} />
      <span className="mono" style={{ fontSize: 7.5, color: 'var(--muted)', lineHeight: 1 }}>{label}</span>
    </div>
  )
}

export function Lijst() {
  const navigate = useNavigate()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const [ids, setIds] = useState<string[]>(() => getList())
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const items = ids.map((id) => getItemById(id)).filter(Boolean) as NonNullable<ReturnType<typeof getItemById>>[]

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleClear = () => {
    if (window.confirm('Lijst leegmaken?')) {
      clearList()
      setIds([])
      setChecked(new Set())
    }
  }

  const handleRemove = (id: string) => {
    toggleList(id) // staat in de lijst → verwijdert
    setIds(getList())
    setChecked((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  // Groepeer op categorie, binnen elke groep: afgevinkt onderaan
  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>()
    const sorted = [...items].sort((a, b) => {
      const ac = checked.has(a.id) ? 1 : 0
      const bc = checked.has(b.id) ? 1 : 0
      return ac - bc
    })
    for (const item of sorted) {
      const cat = item.category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return map
  }, [items, checked])

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '8px 22px 0' }} className="pt-safe">
        <Logo size={18} to="/zoeken" />
      </div>
      <div style={{ padding: '18px 22px 8px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Mijn lijstje</div>
        <h1 className="serif" style={{ fontSize: 26, lineHeight: 1.05, fontWeight: 500, margin: '8px 0 4px', letterSpacing: -0.5, color: 'var(--ink)' }}>
          Te checken in de winkel.
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
          Tik op een item om het af te vinken.
        </p>
      </div>

      {/* Meta bar */}
      {items.length > 0 && (
        <div style={{
          padding: '10px 22px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid var(--rule-soft)', borderTop: '1px solid var(--rule-soft)',
          marginTop: 4,
        }}>
          <span className="eyebrow">
            {checked.size}/{items.length} afgevinkt
          </span>
          <button
            onClick={handleClear}
            style={{ fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Lijst wissen
          </button>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ padding: '48px 22px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>♡</div>
          <p className="serif" style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 8, fontWeight: 500 }}>
            Je lijst is leeg
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, maxWidth: 260, margin: '0 auto 24px' }}>
            Tik op het hartje op een productpagina om items toe te voegen.
          </p>
          <button
            onClick={() => navigate('/zoeken')}
            style={{
              padding: '10px 20px', borderRadius: 8, background: 'var(--brand)',
              color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
            }}
          >
            Naar zoeken
          </button>
        </div>
      )}

      {/* List — gegroepeerd per categorie */}
      {items.length > 0 && (
        <div style={{ padding: '4px 22px 16px' }}>
          {Array.from(grouped.entries()).map(([cat, catItems]) => (
            <div key={cat}>
              <div className="eyebrow" style={{ padding: '14px 0 6px', fontSize: 10 }}>
                {CATEGORY_LABELS[cat as Category] ?? cat} · {catItems.length}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {catItems.map((item) => {
                  const isDone = checked.has(item.id)
                  const combined = getCombinedScore(item, conditions)
                  const status = scoreToStatus(combined.score)
                  const nm = item.name.nl.match(/^(.*?)(\s*\([^)]+\))$/)
                  const nameMain = nm ? nm[1] : item.name.nl
                  const nameSub = nm ? nm[2].trim() : null

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10,
                        background: 'var(--paper)', border: '1px solid var(--rule)',
                        opacity: isDone ? 0.45 : 1, transition: 'opacity 0.15s',
                      }}
                    >
                      <button
                        onClick={() => toggleCheck(item.id)}
                        aria-label={isDone ? 'Afgevinkt' : 'Vink af'}
                        style={{
                          flexShrink: 0, width: 24, height: 24, borderRadius: 6,
                          border: isDone ? 'none' : '2px solid var(--rule)',
                          background: isDone ? 'var(--brand)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {isDone && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                            <path d="M2 6l3 3 5-5" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => navigate(`/item/${item.id}`)}
                        style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', minWidth: 0 }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', textDecoration: isDone ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {nameMain}
                        </div>
                        {nameSub && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 1 }}>{nameSub}</div>}
                      </button>

                      <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: status !== 'null' ? `var(--${status})` : 'var(--rule)' }} />

                      {conditions.length > 1 && (
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          {conditions.map((c) => (
                            <MiniCondDot key={c} status={scoreToStatus(item.scores[c]?.score ?? null)} label={COND_SHORT[c]} />
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => handleRemove(item.id)}
                        aria-label="Verwijder van lijstje"
                        style={{
                          flexShrink: 0, width: 28, height: 28, borderRadius: 6,
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Checked count feedback */}
      {checked.size > 0 && checked.size === items.length && (
        <div style={{ padding: '0 22px 16px', textAlign: 'center' }}>
          <p className="serif" style={{ fontSize: 15, color: 'var(--brand)', fontWeight: 500 }}>
            Alles afgevinkt ✓
          </p>
        </div>
      )}

      <NavBar />
    </div>
  )
}
