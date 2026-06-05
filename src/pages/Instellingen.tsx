import { useNavigate, Link } from 'react-router-dom'
import type { Condition } from '@/schemas/item'
import { getProfile, clearProfile } from '@/lib/profile'
import { getTodayStats } from '@/lib/stats'
import { getAllItems } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import { METHODOLOGY_VERSION } from '@/lib/version'

const COND_LABEL: Record<Condition, string> = {
  jicht: 'Jicht',
  migraine: 'Migraine',
  nierstenen: 'Nierstenen',
  histamine: 'Histamine',
}

// Chevron voor lijst-items.
function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rule)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

// Eén rij in een hub-lijstkaart.
function HubItem({
  to, icon, title, desc, value,
}: { to: string; icon: React.ReactNode; title: string; desc?: string; value?: string }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '14px 15px', textDecoration: 'none', color: 'inherit',
        borderBottom: '1px solid var(--rule-soft)',
      }}
      className="hub-item"
    >
      <span style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: 'var(--brand-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--brand-2)',
      }}>
        {icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="serif" style={{ display: 'block', fontSize: 14.5, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.2 }}>
          {title}
        </span>
        {desc && (
          <span style={{ display: 'block', fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{desc}</span>
        )}
      </span>
      {value && (
        <span style={{ fontSize: 12, color: 'var(--brand-2)', fontWeight: 500, flexShrink: 0, whiteSpace: 'nowrap' }}>
          {value}
        </span>
      )}
      <Chevron />
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow" style={{ margin: '20px 0 9px' }}>{children}</div>
}

export function Instellingen() {
  const navigate = useNavigate()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []

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

  const profileValue =
    conditions.length === 0
      ? 'Niet ingesteld'
      : conditions.length <= 2
        ? conditions.map((c) => COND_LABEL[c]).join(' · ')
        : `${conditions.length} aandoeningen`

  const handleReset = () => {
    if (window.confirm('Weet je het zeker? Je profiel en instellingen worden gewist.')) {
      clearProfile()
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ padding: '8px 22px 0' }} className="pt-safe">
          <Logo size={18} to="/zoeken" />
        </div>
        <div style={{ padding: '16px 22px 0' }}>
          <h1 className="serif" style={{ fontSize: 22, lineHeight: 1.1, fontWeight: 500, margin: 0, letterSpacing: -0.3, color: 'var(--ink)' }}>
            Meer
          </h1>
        </div>

        <div style={{ padding: '0 22px' }}>
          {/* Profiel */}
          <SectionLabel>Profiel</SectionLabel>
          <div className="tm-hubcard">
            <HubItem
              to="/instellingen/profiel"
              value={profileValue}
              title="Mijn profiel"
              desc="Voor welke aandoeningen"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.3 3.1-5 7-5s7 1.7 7 5" />
                </svg>
              }
            />
          </div>

          {/* Onderbouwing */}
          <SectionLabel>Onderbouwing</SectionLabel>
          <div className="tm-hubcard">
            <HubItem
              to="/methodologie"
              title="Hoe een stoplicht tot stand komt"
              desc="De methode: drempels, afwegingen en uitzonderingen"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3h6M10 3v5l-4 9a2 2 0 002 3h8a2 2 0 002-3l-4-9V3" />
                </svg>
              }
            />
            <HubItem
              to="/bronnen"
              title="Bronnen &amp; datasets"
              desc="Alle datasets, richtlijnen en studies per aandoening"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3" />
                </svg>
              }
            />
          </div>

          {/* Vandaag */}
          {viewedItems.length > 0 && (
            <>
              <SectionLabel>Vandaag</SectionLabel>
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
                <div className="stripe-bar" style={{ marginTop: 12 }}>
                  <span className="swatch-safe" style={{ flex: scoreCounts.veilig }} />
                  <span className="swatch-ok"   style={{ flex: scoreCounts.matig }} />
                  <span className="swatch-warn" style={{ flex: scoreCounts.voorzichtig }} />
                  <span className="swatch-avoid"style={{ flex: scoreCounts.vermijden }} />
                </div>
              </div>
            </>
          )}

          {/* App */}
          <SectionLabel>App</SectionLabel>
          <div className="tm-hubcard">
            <HubItem
              to="/privacy"
              title="Privacybeleid"
              desc="Wat we opslaan — en wat niet"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" />
                </svg>
              }
            />
          </div>

          {/* Footer */}
          <div style={{ padding: '22px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button
              onClick={handleReset}
              style={{ fontSize: 12.5, color: 'var(--avoid)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            >
              Profiel wissen
            </button>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Triggermenu · methodologie v{METHODOLOGY_VERSION}</span>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
