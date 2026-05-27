import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { getProfile, saveProfile, acceptDisclaimer } from '@/lib/profile'
import { getAllItems } from '@/lib/db'
import { track } from '@/lib/analytics'
import { Logo } from '@/components/Logo'

// ── Condition metadata ──────────────────────────────────────────────────────
const COND_META: Record<Condition, { label: string; short: string; desc: string }> = {
  jicht:      { label: 'Jicht',      short: 'JCHT', desc: 'Purine-arm advies' },
  migraine:   { label: 'Migraine',   short: 'MIGR', desc: 'Triggers vermijden' },
  nierstenen: { label: 'Nierstenen', short: 'NIER', desc: 'Oxalaat-monitoring' },
  histamine:  { label: 'Histamine',  short: 'HIST', desc: 'SIGHI-compatibel' },
}

// ── CondCell — saturated stoplicht block ────────────────────────────────────
type ScoreStatus = 'safe' | 'ok' | 'warn' | 'avoid'

function CondCell({ status, label }: { status: ScoreStatus; label: string }) {
  return (
    <div className={`colorblock ${status}`} style={{ width: 28, minHeight: 36 }}>
      <span className="lbl">{label}</span>
    </div>
  )
}

// ── Step dots ──────────────────────────────────────────────────────────────
function StepDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-1.5 mb-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            height: 4,
            borderRadius: 2,
            width: i === step ? 22 : 6,
            background: i === step ? 'var(--ink)' : i < step ? 'rgba(26,24,21,.35)' : 'var(--rule)',
            transition: 'all .2s',
          }}
        />
      ))}
    </div>
  )
}

// ── PhoneShell — shared outer frame ────────────────────────────────────────
function PhoneShell({ children, stepLabel }: { children: React.ReactNode; stepLabel: string }) {
  return (
    <div className="min-h-screen flex flex-col max-w-sm mx-auto" style={{ background: 'var(--bg)' }}>
      {/* Status bar area */}
      <div className="flex items-center justify-between px-[22px] pt-safe pt-3 pb-1">
        <Logo size={18} />
        <span className="eyebrow">{stepLabel}</span>
      </div>
      {children}
    </div>
  )
}

// ── Step 1: Welkom (OnbMedisch) ────────────────────────────────────────────
function StepWelkom({ onNext }: { onNext: () => void }) {
  const itemCount = getAllItems().length
  const [storyOpen, setStoryOpen] = useState(false)
  return (
    <PhoneShell stepLabel="01 — Triggermenu">
      {/* Hero */}
      <div className="px-[26px] pt-7 pb-4">
        <div className="eyebrow mb-2">Voor mensen met</div>
        <h1
          className="serif"
          style={{
            fontSize: 32,
            lineHeight: 1.06,
            fontWeight: 500,
            margin: '8px 0 14px',
            letterSpacing: -0.6,
            color: 'var(--ink)',
          }}
        >
          Jicht · Migraine ·<br />Nierstenen · Histamine
        </h1>
        <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--ink-soft)', margin: 0, maxWidth: 320 }}>
          Zoek een voedingsmiddel en zie direct of het voor jouw aandoening veilig is.
          Indicatief advies, transparant onderbouwd.
        </p>
      </div>

      {/* Voorbeeld card */}
      <div className="px-[26px] mt-2">
        <div className="tm-card" style={{ padding: 16 }}>
          <div className="eyebrow">Voorbeeld · zoekresultaat</div>
          <div className="flex items-center gap-2.5 mt-2.5">
            <div className="flex-1">
              <div className="serif" style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>
                Tonijn{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--muted)', fontWeight: 400 }}>· in blik</em>
              </div>
              <div className="eyebrow" style={{ fontSize: 9.5, marginTop: 2 }}>Vis · 100 g</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 28px)', gap: 4 }}>
              <CondCell status="warn"  label="JCH" />
              <CondCell status="ok"    label="MIG" />
              <CondCell status="safe"  label="NIE" />
              <CondCell status="avoid" label="HIS" />
            </div>
          </div>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--muted)', margin: '8px 2px 0', lineHeight: 1.4 }}>
          Elke kleur staat voor één aandoening uit jouw profiel.
        </p>
      </div>

      {/* Feature list */}
      <div className="px-[26px] pt-6">
        {[
          { t: `Zoek ${itemCount} voedingsmiddelen`,  d: 'Producten, ingrediënten en bereidingen — rauw, gekookt, gebakken.' },
          { t: 'Eén stoplicht per aandoening', d: 'Veilig · Met mate · Spaarzaam · Vermijden. Op één rij zichtbaar.' },
          { t: 'Met bron en bewijs-niveau',  d: 'USDA, SIGHI, EULAR. Iedere score linkt naar de gebruikte studie.' },
        ].map((it, i, a) => (
          <div
            key={it.t}
            className="flex gap-3.5 items-start"
            style={{
              padding: '12px 0',
              borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--brand-50)', color: 'var(--brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: 1,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12l5 5L20 6" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{it.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>{it.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Van de maker */}
      <div className="px-[26px] pt-7">
        <div className="tm-card" style={{ padding: 16, background: 'var(--brand-50)', border: '1px solid color-mix(in srgb, var(--brand) 22%, transparent)' }}>
          <div className="eyebrow" style={{ marginBottom: 7 }}>Van de maker</div>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
            Ik bouwde Triggermenu voor mijn vriend Jerry. Hij heeft jicht én migraine, en toen we
            met onze vrouwen uit eten waren zat hij te twijfelen over zo'n beetje elk gerecht op de
            kaart. Toen dachten we: dit moet makkelijker kunnen. Dit is het resultaat — nog volop in
            ontwikkeling. Probeer 'm uit en laat me weten wat er beter kan, via de{' '}
            <strong style={{ color: 'var(--ink)' }}>Feedback</strong>-knop.
          </p>
          {storyOpen && (
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, margin: '10px 0 0' }}>
              Jerry en ik kennen elkaar al jaren. Hij kreeg eerst migraine, later ook jicht — en
              merkte hoe ingewikkeld eten dan wordt: het ene advies spreekt het andere tegen, en in
              de supermarkt of het restaurant heb je daar niks aan. Ik wilde iets dat in één
              oogopslag laat zien waar je op moet letten, mét de bron erbij, zodat je het zelf kunt
              nalezen of aan je arts kunt laten zien. Geen dieetschema, geen medisch oordeel — gewoon
              een eerlijk hulpje. Het is nog lang niet af, en jouw feedback bepaalt mee waar het
              heen gaat.
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span className="serif" style={{ fontSize: 13.5, fontStyle: 'italic', color: 'var(--muted)' }}>— Peter</span>
            <button
              onClick={() => setStoryOpen((v) => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, color: 'var(--brand)' }}
            >
              {storyOpen ? 'Minder' : 'Lees het hele verhaal'}
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-[26px] pt-5 pb-8">
        <StepDots step={0} />
        <button
          onClick={onNext}
          style={{
            width: '100%', height: 50, borderRadius: 12,
            background: 'var(--ink)', color: 'var(--paper)',
            border: 'none', fontSize: 15, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          Beginnen
        </button>
        <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', margin: '12px 0 0' }}>
          Indicatief · geen vervanging voor medisch advies
        </p>
      </div>
    </PhoneShell>
  )
}

// ── Step 2: Aandoeningen ───────────────────────────────────────────────────
function StepAandoeningen({
  selected,
  onToggle,
  onNext,
  error,
}: {
  selected: Condition[]
  onToggle: (c: Condition) => void
  onNext: () => void
  error: string
}) {
  return (
    <PhoneShell stepLabel="02 — Profiel">
      <div className="px-6 pt-6 pb-3.5">
        <div className="eyebrow mb-2">Stap 2 van 3</div>
        <h2
          className="serif"
          style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 500, margin: '8px 0 6px', letterSpacing: -0.6, color: 'var(--ink)' }}
        >
          Voor welke aandoening<br />
          geef ik{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--brand)' }}>advies</em>?
        </h2>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0 }}>Kies één of meer. Je kunt dit later wijzigen.</p>
      </div>

      <div className="px-6 flex flex-col gap-2.5">
        {CONDITIONS.map((c) => {
          const meta = COND_META[c]
          const isOn = selected.includes(c)
          return (
            <button
              key={c}
              onClick={() => onToggle(c)}
              style={{
                background: isOn ? 'var(--brand-50)' : 'var(--paper)',
                border: isOn ? '1.5px solid var(--brand)' : '1px solid var(--rule)',
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 10, color: isOn ? 'var(--brand-2)' : 'var(--muted)', letterSpacing: .06, width: 36, flexShrink: 0 }}
              >
                {meta.short}
              </span>
              <div style={{ flex: 1 }}>
                <div className="serif" style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.2, color: 'var(--ink)' }}>
                  {meta.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{meta.desc}</div>
              </div>
              <span style={{
                width: 20, height: 20, borderRadius: 6,
                background: isOn ? 'var(--brand)' : 'transparent',
                border: isOn ? 'none' : '1.5px solid var(--rule)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isOn && (
                  <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M2 5l2 2 4-4" />
                  </svg>
                )}
              </span>
            </button>
          )
        })}
        {error && <p style={{ fontSize: 13, color: 'var(--avoid)', margin: '4px 0 0' }}>{error}</p>}
      </div>

      <div className="px-6 pt-6 pb-8">
        <StepDots step={1} />
        <button
          onClick={onNext}
          style={{
            width: '100%', height: 50, borderRadius: 12,
            background: 'var(--ink)', color: 'var(--paper)',
            border: 'none', fontSize: 15, fontWeight: 500,
            fontFamily: 'inherit', cursor: 'pointer',
          }}
        >
          {selected.length > 0 ? `Doorgaan · ${selected.length} gekozen` : 'Doorgaan'}
        </button>
      </div>
    </PhoneShell>
  )
}

// ── Step 3: Disclaimer ─────────────────────────────────────────────────────
function StepDisclaimer({
  checked,
  onToggle,
  onStart,
}: {
  checked: boolean
  onToggle: () => void
  onStart: () => void
}) {
  return (
    <PhoneShell stepLabel="03 — Disclaimer">
      <div className="px-6 pt-6 pb-4.5">
        <div className="eyebrow mb-2">Belangrijk</div>
        <h2
          className="serif"
          style={{ fontSize: 28, lineHeight: 1.06, fontWeight: 500, margin: '8px 0 4px', letterSpacing: -0.5, color: 'var(--ink)' }}
        >
          Een kompas,<br />geen recept.
        </h2>
      </div>

      <div className="px-6">
        <div className="tm-card" style={{ padding: '6px 18px 10px' }}>
          {[
            { t: 'Indicatief, niet medisch advies', d: 'Bespreek wijzigingen met je arts of diëtist.' },
            { t: 'Per persoon verschillend',         d: 'Reacties op voeding variëren. Houd zo nodig een dagboek bij.' },
            { t: 'Transparant onderbouwd',           d: 'Iedere score linkt naar de gebruikte studie of dataset.' },
          ].map((it, i, a) => (
            <div
              key={it.t}
              style={{ padding: '14px 0', borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none' }}
            >
              <div className="serif" style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>{it.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.45, marginTop: 2 }}>{it.d}</div>
            </div>
          ))}
        </div>

        <label
          onClick={onToggle}
          style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 18, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.45, cursor: 'pointer' }}
        >
          <span style={{
            width: 18, height: 18, borderRadius: 5,
            background: checked ? 'var(--brand)' : 'transparent',
            border: checked ? 'none' : '1.5px solid var(--rule)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 1,
          }}>
            {checked && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M2 5l2 2 4-4" />
              </svg>
            )}
          </span>
          <span>Ik begrijp dat Triggermenu een hulpmiddel is en geen medisch advies vervangt.</span>
        </label>
      </div>

      <div className="px-6 pt-6 pb-8">
        <StepDots step={2} />
        <button
          onClick={onStart}
          disabled={!checked}
          style={{
            width: '100%', height: 50, borderRadius: 12,
            background: checked ? 'var(--brand)' : 'var(--rule)',
            color: checked ? '#fff' : 'var(--muted)',
            border: 'none', fontSize: 15, fontWeight: 600,
            fontFamily: 'inherit', cursor: checked ? 'pointer' : 'not-allowed',
            transition: 'background .15s',
          }}
        >
          Aan de slag
        </button>
      </div>
    </PhoneShell>
  )
}

// ── Root Onboarding ────────────────────────────────────────────────────────
export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Condition[]>(() => getProfile()?.conditions ?? [])
  const [disclaimerChecked, setDisclaimerChecked] = useState(false)
  const [error, setError] = useState('')

  const toggle = (c: Condition) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const handleNext = () => {
    if (step === 1 && selected.length === 0) { setError('Kies minstens één aandoening'); return }
    setError('')
    setStep((s) => s + 1)
  }

  const handleStart = () => {
    if (!disclaimerChecked) return
    saveProfile({ conditions: selected })
    acceptDisclaimer()
    track('onboarding_voltooid', { aantal: selected.length })
    navigate('/zoeken', { replace: true })
  }

  if (step === 0) return <StepWelkom onNext={handleNext} />
  if (step === 1) return <StepAandoeningen selected={selected} onToggle={toggle} onNext={handleNext} error={error} />
  return <StepDisclaimer checked={disclaimerChecked} onToggle={() => setDisclaimerChecked((v) => !v)} onStart={handleStart} />
}
