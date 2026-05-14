import { useEffect, useState } from 'react'
import { getItemById, getAlternatives } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { recordView } from '@/lib/stats'
import type { Condition } from '@/schemas/item'

// ── Constants ────────────────────────────────────────────────────────────────
const COND_LABELS: Record<Condition, string> = {
  jicht: 'Jicht', migraine: 'Migraine', nierstenen: 'Nierstenen', histamine: 'Histamine',
}

const COND_SHORT: Record<Condition, string> = {
  jicht: 'JCHT', migraine: 'MIGR', nierstenen: 'NIER', histamine: 'HIST',
}

const CAT_LABELS: Record<string, string> = {
  groente: 'Groente', fruit: 'Fruit', granen: 'Granen & brood',
  peulvruchten: 'Peulvruchten', 'noten-zaden': 'Noten & zaden',
  vlees: 'Vlees & gevogelte', 'vis-schaaldieren': 'Vis & schaaldieren',
  zuivel: 'Zuivel & eieren', eieren: 'Eieren',
  'dranken-alcohol': 'Alcohol', 'dranken-non-alcohol': 'Dranken',
  zoetwaren: 'Zoetwaren & snacks', 'sauzen-kruiden': 'Sauzen & kruiden',
}

const SCORE_LABELS: Record<number, string> = {
  0: 'Veilig', 1: 'Matig', 2: 'Voorzichtig', 3: 'Vermijden',
}

const TRIGGER_LABELS: Record<string, string> = {
  'universeel': 'universele trigger',
  'subgroep-bevestigd': 'subgroep-trigger',
  'subgroep-overschat': 'subgroep — overschat',
  'onttrekkings-trigger': 'onttrekkingstrigger',
  'drug-interactie': 'alleen bij medicatie',
  'context-afhankelijk': 'context-afhankelijk',
}

type CellStatus = 'safe' | 'ok' | 'warn' | 'avoid' | 'null'

function scoreToStatus(score: number | null): CellStatus {
  if (score === null) return 'null'
  return (['safe', 'ok', 'warn', 'avoid'] as const)[score] ?? 'null'
}

// ── CondCell — large block for detail page ────────────────────────────────
function CondCell({ status, label }: { status: CellStatus; label: string }) {
  return (
    <div className={`colorblock ${status}`} style={{ flex: 1, minHeight: 44 }}>
      <span className="lbl">{label}</span>
    </div>
  )
}

// ── Pill — small inline status label ─────────────────────────────────────
function ScorePill({ score }: { score: number | null }) {
  const status = scoreToStatus(score)
  const label = score !== null ? SCORE_LABELS[score] : 'Onbekend'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 500,
      background: status !== 'null' ? `var(--${status}-bg)` : 'var(--paper-2)',
      color: status !== 'null' ? `var(--${status}-ink)` : 'var(--muted)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: status !== 'null' ? `var(--${status})` : 'var(--rule)',
      }} />
      {label}
    </span>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────
interface Props {
  id: string
  conditions: Condition[]
  showAlternatives?: boolean
  onNavigate: (id: string) => void
}

// ── ItemDetailPanel ───────────────────────────────────────────────────────
export function ItemDetailPanel({ id, conditions, showAlternatives = false, onNavigate }: Props) {
  const item = getItemById(id)
  const [expandedCond, setExpandedCond] = useState<string | null>(null)

  useEffect(() => {
    if (id) recordView(id)
    setExpandedCond(null)
  }, [id])

  if (!item) return null

  const combined = getCombinedScore(item, conditions)
  const alternatives = getAlternatives(item, conditions, 3)

  // Split name: "Spinazie (rauw)" → main="Spinazie", paren="(rauw)"
  const nm = item.name.nl.match(/^(.*?)(\s*\([^)]+\))$/)
  const nameMain = nm ? nm[1] : item.name.nl
  const nameParen = nm ? nm[2].trim() : null

  return (
    <div style={{ padding: '20px 20px 40px' }}>
      {/* Eyebrow: categorie + portie */}
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        {CAT_LABELS[item.category] ?? item.category}
      </div>

      {/* H1 + italic sub */}
      <h1 className="serif" style={{ fontSize: 34, lineHeight: 1, fontWeight: 500, margin: '8px 0 14px', letterSpacing: -0.8, color: 'var(--ink)' }}>
        {nameMain}
        {nameParen && (
          <><br /><em style={{ fontStyle: 'italic', color: 'var(--muted)', fontWeight: 400 }}>{nameParen}</em></>
        )}
      </h1>

      {/* 4 CondCell blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${conditions.length}, 1fr)`, gap: 6, marginBottom: 16 }}>
        {conditions.map((c) => (
          <CondCell key={c} status={scoreToStatus(item.scores[c]?.score ?? null)} label={COND_SHORT[c]} />
        ))}
      </div>

      {/* Conflict / summary banner */}
      {combined.conflict && (
        <div style={{
          padding: '12px 14px', background: 'var(--warn-bg)', borderRadius: 10,
          fontSize: 12.5, color: 'var(--warn-ink)', lineHeight: 1.5, marginBottom: 16,
        }}>
          <span style={{ fontWeight: 600 }}>Voorzichtig</span>
          {' · advies wisselt per aandoening. Zie details hieronder.'}
        </div>
      )}

      {/* Per-condition detail rows */}
      <div style={{ marginTop: 4 }}>
        {conditions.map((c, i, a) => {
          const s = item.scores[c]
          return (
            <div
              key={c}
              style={{
                display: 'flex', gap: 14, padding: '14px 0',
                borderBottom: i < a.length - 1 ? '1px solid var(--rule-soft)' : 'none',
              }}
            >
              {/* Label column */}
              <div style={{ width: 96, flexShrink: 0 }}>
                <div className="serif" style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)' }}>
                  {COND_LABELS[c]}
                </div>
                <div style={{ marginTop: 6 }}>
                  <ScorePill score={s?.score ?? null} />
                </div>
              </div>

              {/* Content column */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {s ? (
                  <>
                    {s.note?.nl && (
                      <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 6 }}>
                        {s.note.nl}
                      </div>
                    )}
                    {s.sources.slice(0, 1).map((src, si) => (
                      <a
                        key={si}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: 11.5, color: 'var(--brand)', textDecoration: 'none',
                        }}
                      >
                        {src.title}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                          <path d="M7 17L17 7M9 7h8v8" />
                        </svg>
                      </a>
                    ))}
                    {s.evidence && (
                      <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)', marginLeft: s.sources.length > 0 ? 8 : 0 }}>
                        EV·{s.evidence}
                      </span>
                    )}
                    {/* Meer info — technische details ingeklapt */}
                    {((s as any).triggerType || (s as any).primaryModulators?.length > 0 || (s as any).confidence) && (
                      <div style={{ marginTop: 6 }}>
                        <button
                          onClick={() => setExpandedCond(expandedCond === c ? null : c)}
                          style={{
                            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                            fontSize: 11, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 3,
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            style={{ transform: expandedCond === c ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                          {expandedCond === c ? 'minder' : 'meer info'}
                        </button>
                        {expandedCond === c && (
                          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {(s as any).triggerType && (
                              <span style={{
                                fontSize: 11, padding: '2px 8px', borderRadius: 999, alignSelf: 'flex-start',
                                background: 'var(--paper-2)', color: 'var(--ink-soft)',
                                border: '1px solid var(--rule-soft)',
                              }}>
                                {TRIGGER_LABELS[(s as any).triggerType] ?? (s as any).triggerType}
                              </span>
                            )}
                            {(s as any).primaryModulators?.length > 0 && (
                              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                Gevoelig bij: {(s as any).primaryModulators.join(', ')}
                              </div>
                            )}
                            {(s as any).confidence && (
                              <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)' }}>
                                vertrouwen: {(s as any).confidence}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Geen data beschikbaar</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Histamine flags */}
      {item.histamineFlags && conditions.includes('histamine') && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {item.histamineFlags.liberator && (
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--ok-bg)', color: 'var(--ok-ink)' }}>
              Histamineliberator
            </span>
          )}
          {item.histamineFlags.daoBlocker && (
            <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--warn-bg)', color: 'var(--warn-ink)' }}>
              DAO-blokker
            </span>
          )}
        </div>
      )}

      {/* Alternatives (mobile inline) */}
      {showAlternatives && alternatives.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Betere alternatieven · veilig voor jouw profiel
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alternatives.map((alt) => {
              const altNm = alt.name.nl.match(/^(.*?)(\s*\([^)]+\))$/)
              const altMain = altNm ? altNm[1] : alt.name.nl
              const altSub = altNm ? altNm[2].trim() : null
              return (
                <button
                  key={alt.id}
                  onClick={() => onNavigate(alt.id)}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', background: 'var(--paper)', borderRadius: 10,
                    border: '1px solid var(--rule-soft)', cursor: 'pointer', fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{altMain}</div>
                    {altSub && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{altSub}</div>}
                  </div>
                  <ScorePill score={getCombinedScore(alt, conditions).score} />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ── AlternativesPanel — desktop right column ──────────────────────────────
export function AlternativesPanel({ id, conditions, onNavigate }: Omit<Props, 'showAlternatives'>) {
  const item = getItemById(id)
  if (!item) return null

  const alternatives = getAlternatives(item, conditions, 3)
  const nameFirst = item.name.nl.split(' ')[0].toLowerCase()

  // Sources for this item (first source per active condition)
  const sources = conditions
    .map((c) => {
      const s = item.scores[c]
      if (!s || s.sources.length === 0) return null
      return { title: s.sources[0].title, cond: c.toUpperCase().slice(0, 4) }
    })
    .filter(Boolean) as { title: string; cond: string }[]

  return (
    <div style={{ padding: '32px 28px' }}>
      {alternatives.length > 0 && (
        <>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Betere alternatieven</div>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 14px' }}>
            Drie veilige opties die qua gebruik dichtbij {nameFirst} liggen.
          </p>
          <div>
            {alternatives.map((alt) => {
              const altNm = alt.name.nl.match(/^(.*?)(\s*\([^)]+\))$/)
              const altMain = altNm ? altNm[1] : alt.name.nl
              const altSub = altNm ? altNm[2].trim() : null
              return (
                <button
                  key={alt.id}
                  onClick={() => onNavigate(alt.id)}
                  style={{
                    width: '100%', textAlign: 'left', fontFamily: 'inherit',
                    padding: '14px 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'none', border: 'none', borderTop: '1px solid var(--rule-soft)',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div className="serif" style={{ fontSize: 15.5, fontWeight: 500, color: 'var(--ink)' }}>{altMain}</div>
                    {altSub && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{altSub}</div>}
                  </div>
                  <ScorePill score={getCombinedScore(alt, conditions).score} />
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* Sources for this score */}
      {sources.length > 0 && (
        <div style={{
          marginTop: 24, padding: 16, borderRadius: 12,
          background: 'var(--bg)', border: '1px solid var(--rule)',
        }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Bronnen voor deze score</div>
          {sources.map((s, i) => (
            <div
              key={i}
              style={{
                padding: '8px 0', borderTop: i > 0 ? '1px solid var(--rule-soft)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12,
              }}
            >
              <span style={{ color: 'var(--ink-soft)', flex: 1, paddingRight: 8 }}>{s.title}</span>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)' }}>{s.cond}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Keep ScorePill exported for any external usage
export { ScorePill }
