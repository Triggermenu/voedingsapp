import { getDatabaseStats } from '@/lib/db'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'

type SourceType = 'DATASET' | 'GUIDELINE' | 'REVIEW' | 'CONSENSUS' | 'STUDIE'
type CondKey = 'jicht' | 'migraine' | 'nierstenen' | 'histamine'

interface Source {
  title: string
  org: string
  year: number
  items?: number
  type: SourceType
  use: string
  url: string
}

const COND_ORDER: { id: CondKey; label: string; status: 'safe' | 'ok' | 'warn' | 'avoid' }[] = [
  { id: 'jicht',      label: 'Jicht',      status: 'ok' },
  { id: 'migraine',   label: 'Migraine',   status: 'ok' },
  { id: 'nierstenen', label: 'Nierstenen', status: 'warn' },
  { id: 'histamine',  label: 'Histamine',  status: 'avoid' },
]

const SOURCES: Record<CondKey, Source[]> = {
  jicht: [
    {
      title: 'USDA Purine Database, Release 2.0',
      org: 'U.S. Department of Agriculture',
      year: 2025, items: 312, type: 'DATASET',
      use: 'Purinegehalte (mg / 100g) per voedingsmiddel.',
      url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf',
    },
    {
      title: '2020 ACR Guideline for Management of Gout',
      org: 'American College of Rheumatology',
      year: 2020, type: 'GUIDELINE',
      use: 'Drempelwaarden < 50 / 100 / 200 mg purine.',
      url: 'https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/acr.24180',
    },
  ],
  migraine: [
    {
      title: 'Hindiyeh et al. — The role of diet and nutrition in migraine triggers',
      org: 'Headache Journal, 60(7)',
      year: 2020, type: 'REVIEW',
      use: 'Bewezen voedingstriggers: tyramine, MSG, nitraten.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
    },
  ],
  nierstenen: [
    {
      title: 'Harvard School of Public Health — Oxalate Content List',
      org: 'Harvard SPH',
      year: 2023, items: 750, type: 'DATASET',
      use: 'Oxalaat (mg / 100g) — basis voor nierstenen-score.',
      url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx',
    },
    {
      title: 'AUA Medical Management of Kidney Stones',
      org: 'American Urological Association',
      year: 2014, type: 'GUIDELINE',
      use: 'Natrium, eiwit en oxalaat drempelwaarden.',
      url: 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-medical-mangement-guideline',
    },
  ],
  histamine: [
    {
      title: 'SIGHI Histamine Food Compatibility List',
      org: 'Swiss Interest Group Histamine Intolerance',
      year: 2023, items: 396, type: 'DATASET',
      use: 'Score 0–3 per voedingsmiddel + DAO-remmers.',
      url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf',
    },
    {
      title: 'Gloria et al. — Histamine in Brazilian Foods: A Comprehensive Review',
      org: 'Food Science & Nutrition',
      year: 2024, items: 343, type: 'REVIEW',
      use: 'Histaminegehalte in 343 voedingsmiddelen, risicobeoordeling intolerantie.',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12620675/',
    },
  ],
}

const totalSources = Object.values(SOURCES).reduce((n, arr) => n + arr.length, 0)

export function Bronnen() {
  const stats = getDatabaseStats()
  const dateStr = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ padding: '8px 22px 0' }} className="pt-safe">
        <Logo size={18} />
      </div>
      <div style={{ padding: '18px 22px 8px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Bronnen</div>
        <h1 className="serif" style={{ fontSize: 26, lineHeight: 1.05, fontWeight: 500, margin: '8px 0 4px', letterSpacing: -0.5, color: 'var(--ink)' }}>
          De wetenschap achter elke score.
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
          Iedere kleur in Triggermenu komt uit één van de onderstaande datasets, richtlijnen of peer-reviewed studies.
        </p>
      </div>

      {/* Meta bar */}
      <div style={{
        padding: '12px 22px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--rule-soft)', borderTop: '1px solid var(--rule-soft)',
        marginTop: 4,
      }}>
        <span className="eyebrow">{totalSources} bronnen · {stats.totalItems} items</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>BIJGEWERKT {dateStr}</span>
      </div>

      {/* Per-condition source sections */}
      <div style={{ padding: '0 22px 16px' }}>
        {COND_ORDER.map((cond) => {
          const srcs = SOURCES[cond.id]
          return (
            <div key={cond.id}>
              {/* Condition header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 0 10px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: `var(--${cond.status})`, flexShrink: 0 }} />
                <span className="serif" style={{ fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>{cond.label}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>· {srcs.length} bronnen</span>
              </div>

              {/* Source cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {srcs.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', padding: '12px 14px',
                      background: 'var(--paper)', borderRadius: 10,
                      border: '1px solid var(--rule)', textDecoration: 'none', color: 'inherit',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div className="serif" style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.25, flex: 1, color: 'var(--ink)' }}>
                        {s.title}
                      </div>
                      <span className="mono" style={{
                        fontSize: 9.5, color: 'var(--muted)', padding: '2px 5px',
                        border: '1px solid var(--rule)', borderRadius: 3, whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {s.type}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                      {s.org} · {s.year}{s.items ? ` · ${s.items} items` : ''}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.4 }}>
                      {s.use}
                    </div>
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--brand)' }}>
                      Open bron
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div style={{ padding: '0 22px 16px' }}>
        <p style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
          MDR-status: in onderzoek · SIGHI commerciële licentie: aangevraagd
        </p>
      </div>

      <NavBar />
    </div>
  )
}
