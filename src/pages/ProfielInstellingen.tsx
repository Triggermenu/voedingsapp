import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { getProfile, saveProfile } from '@/lib/profile'
import { NavBar } from '@/components/NavBar'

// Subscherm van "Meer": het eigenlijke profiel bewerken.
// Bereikbaar via de hub-lijst op /instellingen.
const COND_META: Record<Condition, { label: string; short: string }> = {
  jicht:      { label: 'Jicht',      short: 'JCHT' },
  migraine:   { label: 'Migraine',   short: 'MIGR' },
  nierstenen: { label: 'Nierstenen', short: 'NIER' },
  histamine:  { label: 'Histamine',  short: 'HIST' },
}

export function ProfielInstellingen() {
  const navigate = useNavigate()
  const profile = getProfile()
  const [selected, setSelected] = useState<Condition[]>(profile?.conditions ?? [])
  const [saved, setSaved] = useState(false)

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

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Back header */}
        <div style={{ padding: '8px 20px 4px' }} className="pt-safe">
          <button
            onClick={() => navigate('/instellingen')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'inherit',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
            Terug
          </button>
        </div>

        <div style={{ padding: '12px 22px 4px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Mijn profiel</div>
          <h1 className="serif" style={{ fontSize: 22, lineHeight: 1.1, fontWeight: 500, margin: '4px 0 3px', letterSpacing: -0.3, color: 'var(--ink)' }}>
            Voor wie advies?
          </h1>
          <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>
            Kies één of meer aandoeningen. Zoekresultaten passen zich hierop aan.
          </p>
        </div>

        {/* Condition toggles */}
        <div style={{ padding: '12px 22px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          {CONDITIONS.map((c) => {
            const meta = COND_META[c]
            const isOn = selected.includes(c)
            return (
              <button
                key={c}
                onClick={() => toggle(c)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                  background: isOn ? 'var(--brand-50)' : 'var(--paper)',
                  border: isOn ? '1px solid var(--brand)' : '1px solid var(--rule)',
                  fontFamily: 'inherit', textAlign: 'left',
                }}
              >
                <span className="mono" style={{ fontSize: 9.5, color: isOn ? 'var(--brand-2)' : 'var(--muted)', width: 30 }}>
                  {meta.short}
                </span>
                <span className="serif" style={{ fontSize: 15, fontWeight: 500, flex: 1, color: 'var(--ink)' }}>
                  {meta.label}
                </span>
                <span style={{
                  width: 18, height: 18, borderRadius: 6, flexShrink: 0,
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
        <div style={{ padding: '4px 22px 10px' }}>
          <button
            onClick={handleSave}
            disabled={selected.length === 0}
            style={{
              width: '100%', height: 44, borderRadius: 10, fontFamily: 'inherit',
              background: selected.length === 0 ? 'var(--rule)' : 'var(--brand)',
              color: selected.length === 0 ? 'var(--muted)' : '#fff',
              border: 'none', fontSize: 14, fontWeight: 600, cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {saved ? '✓ Opgeslagen' : 'Opslaan'}
          </button>
          {selected.length === 0 && (
            <p style={{ fontSize: 11.5, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
              Kies minstens één aandoening.
            </p>
          )}
        </div>
      </div>

      <NavBar />
    </div>
  )
}
