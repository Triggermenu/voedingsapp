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
      <div style={{ padding: '16px 22px 4px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Mijn profiel</div>
        <h1 className="serif" style={{ fontSize: 20, lineHeight: 1.1, fontWeight: 500, margin: '4px 0 3px', letterSpacing: -0.3, color: 'var(--ink)' }}>
          Voor wie advies?
        </h1>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>
          Zoekresultaten passen zich aan jouw selectie aan.
        </p>
      </div>

      {/* Condition toggles */}
      <div style={{ padding: '10px 22px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {CONDITIONS.map((c) => {
          const meta = COND_META[c]
          const isOn = selected.includes(c)
          return (
            <button
              key={c}
              onClick={() => toggle(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', borderRadius: 9, cursor: 'pointer',
                background: isOn ? 'var(--brand-50)' : 'var(--paper)',
                border: isOn ? '1px solid var(--brand)' : '1px solid var(--rule)',
                fontFamily: 'inherit', textAlign: 'left',
              }}
            >
              <span className="mono" style={{ fontSize: 9.5, color: isOn ? 'var(--brand-2)' : 'var(--muted)', width: 30 }}>
                {meta.short}
              </span>
              <span className="serif" style={{ fontSize: 14.5, fontWeight: 500, flex: 1, color: 'var(--ink)' }}>
                {meta.label}
              </span>
              <span style={{
                width: 16, height: 16, borderRadius: 5, flexShrink: 0,
                background: isOn ? 'var(--brand)' : 'transparent',
                border: isOn ? 'none' : '1.5px solid var(--rule)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isOn && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 5l2 2 4-4" />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
      </div>

      {/* Save button */}
      <div style={{ padding: '4px 22px 10px' }}>
        <button
          onClick={handleSave}
          disabled={selected.length === 0}
          style={{
            width: '100%', height: 40, borderRadius: 9, fontFamily: 'inherit',
            background: selected.length === 0 ? 'var(--rule)' : 'var(--brand)',
            color: selected.length === 0 ? 'var(--muted)' : '#fff',
            border: 'none', fontSize: 13.5, fontWeight: 600, cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {saved ? '✓ Opgeslagen' : 'Opslaan'}
        </button>
      </div>

      {/* Onderbouwing — bronnen & methodologie, prominent */}
      <div style={{ padding: '8px 22px 4px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Onderbouwing</div>
        <Link
          to="/bronnen"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            padding: '14px 16px', borderRadius: 10, textDecoration: 'none',
            background: 'var(--brand-50)', border: '1px solid color-mix(in srgb, var(--brand) 20%, transparent)',
          }}
        >
          <div>
            <div className="serif" style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>De wetenschap achter elke score</div>
            <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, lineHeight: 1.4 }}>
              Datasets, richtlijnen en peer-reviewed studies — per aandoening, met evidence-grade.
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
        <Link
          to="/methodologie"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            marginTop: 8, padding: '14px 16px', borderRadius: 10, textDecoration: 'none',
            background: 'var(--paper)', border: '1px solid var(--rule)',
          }}
        >
          <div>
            <div className="serif" style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>Hoe een stoplicht tot stand komt</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>
              De methodologie: drempels, afwegingen en uitzonderingen per aandoening.
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
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
