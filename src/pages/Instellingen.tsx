import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { getProfile, saveProfile, clearProfile } from '@/lib/profile'
import { getTodayStats } from '@/lib/stats'
import { getAllItems } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'

const COND_META: Record<Condition, { label: string; short: string }> = {
  jicht:      { label: 'Jicht',      short: 'JCHT' },
  migraine:   { label: 'Migraine',   short: 'MIGR' },
  nierstenen: { label: 'Nierstenen', short: 'NIER' },
  histamine:  { label: 'Histamine',  short: 'HIST' },
}

export function Instellingen() {
  const navigate = useNavigate()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const [selected, setSelected] = useState<Condition[]>(conditions)
  const [saved, setSaved] = useState(false)

  const todayStats = getTodayStats()
  const allItems = getAllItems()
  const viewedItems = allItems.filter((i) => todayStats.viewed.includes(i.id))

  const scoreCounts = viewedItems.reduce(
    (acc, item) => {
      const s = getCombinedScore(item, conditions).score
      if (s === 0) acc.veilig++
      else if (s === 1) acc.matig++
      else if (s === 2) acc.voorzichtig++
      else if (s === 3) acc.vermijden++
      return acc
    },
    { veilig: 0, matig: 0, voorzichtig: 0, vermijden: 0 }
  )

  const safePercent =
    viewedItems.length > 0 ? Math.round((scoreCounts.veilig / viewedItems.length) * 100) : null

  const toggle = (c: Condition) => {
    setSaved(false)
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const handleSave = () => {
    if (selected.length === 0) return
    saveProfile({ conditions: selected })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm('Weet je het zeker? Je profiel en instellingen worden gewist.')) {
      clearProfile()
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '8px 22px 0' }} className="pt-safe">
        <Logo size={18} to="/zoeken" />
      </div>
      <div style={{ padding: '18px 22px 6px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Mijn profiel</div>
        <h1 className="serif" style={{ fontSize: 26, lineHeight: 1.05, fontWeight: 500, margin: '8px 0 4px', letterSpacing: -0.5, color: 'var(--ink)' }}>
          Voor wie advies?
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Zoekresultaten passen zich aan jouw selectie aan.
        </p>
      </div>

      {/* Condition toggles */}
      <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONDITIONS.map((c) => {
          const meta = COND_META[c]
          const isOn = selected.includes(c)
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
                background: isOn ? 'var(--brand-50)' : 'var(--paper)',
                border: isOn ? '1px solid var(--brand)' : '1px solid var(--rule)',
                fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <span className="mono" style={{ fontSize: 10, color: isOn ? 'var(--brand-2)' : 'var(--muted)', width: 36 }}>
                {meta.short}
              </span>
              <span className="serif" style={{ fontSize: 16, fontWeight: 500, flex: 1, color: 'var(--ink)' }}>
                {meta.label}
              </span>
              <span style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                background: isOn ? 'var(--brand)' : 'transparent',
                border: isOn ? 'none' : '1.5px solid var(--rule)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isOn && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 5l2 2 4-4" />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Save button */}
      <div style={{ padding: '4px 22px 12px' }}>
        <button
          onClick={handleSave}
          disabled={selected.length === 0}
          style={{
            width: '100%', height: 46, borderRadius: 10, fontFamily: 'inherit',
            background: selected.length === 0 ? 'var(--rule)' : 'var(--brand)',
            color: selected.length === 0 ? 'var(--muted)' : '#fff',
            border: 'none', fontSize: 14, fontWeight: 600, cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {saved ? '✓ Opgeslagen' : 'Opslaan'}
        </button>
      </div>

      {/* Today stats */}
      {viewedItems.length > 0 && (
        <div style={{ padding: '0 22px 4px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Vandaag</div>
          <div className="tm-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 500, color: 'var(--ink)' }}>
                  {viewedItems.length} {viewedItems.length === 1 ? 'item' : 'items'} bekeken
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {scoreCounts.veilig} veilig · {scoreCounts.matig} matig · {scoreCounts.vermijden} vermijden
                </div>
              </div>
              {safePercent !== null && (
                <div className="mono" style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 600 }}>
                  {safePercent}<span style={{ color: 'var(--muted)', fontSize: 14 }}>%</span>
                </div>
              )}
            </div>
            {/* Stripe bar */}
            <div className="stripe-bar" style={{ marginTop: 12 }}>
              <span className="swatch-safe" style={{ flex: scoreCounts.veilig }} />
              <span className="swatch-ok"   style={{ flex: scoreCounts.matig }} />
              <span className="swatch-warn" style={{ flex: scoreCounts.voorzichtig }} />
              <span className="swatch-avoid"style={{ flex: scoreCounts.vermijden }} />
            </div>
          </div>
        </div>
      )}

      {/* Bronnen */}
      <div style={{ padding: '16px 22px 0' }}>
        <Link
          to="/bronnen"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 10, textDecoration: 'none',
            background: 'var(--paper)', border: '1px solid var(--rule)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h11a3 3 0 013 3v13a2 2 0 00-2-2H4z" />
              <path d="M4 4v14h12" />
            </svg>
            <span className="serif" style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>Bronnen</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      {/* Footer links */}
      <div style={{ padding: '20px 22px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <button
          onClick={handleReset}
          style={{ fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Profiel wissen
        </button>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link to="/privacy" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>
            Privacybeleid
          </Link>
          <span style={{ fontSize: 12, color: 'var(--rule)' }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Triggermenu v0.1</span>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
