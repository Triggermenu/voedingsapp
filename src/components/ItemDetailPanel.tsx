import { useEffect, useState } from 'react'
import { getItemById, getAlternatives } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { recordView } from '@/lib/stats'
import { isInList, toggleList } from '@/lib/list'
import type { Condition } from '@/schemas/item'

// ── Constants ────────────────────────────────────────────────────────────────
const COND_LABELS: Record<Condition, string> = {
  jicht: 'Jicht', migraine: 'Migraine', nierstenen: 'Nierstenen', histamine: 'Histamine',
}

const COND_SHORT: Record<Condition, string> = {
  jicht: 'JCHT', migraine: 'MIGR', nierstenen: 'NIER', histamine: 'HIST',
}

// 3-letter labels voor de compacte stoplicht-strip op alternatieven
const COND_ABBR: Record<Condition, string> = {
  jicht: 'JCH', migraine: 'MIG', nierstenen: 'NIE', histamine: 'HIS',
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
  0: 'Veilig', 1: 'Met mate', 2: 'Spaarzaam', 3: 'Vermijden',
}

const EVIDENCE_LABELS: Record<string, string> = {
  A: 'Sterk bewijs (A)', B: 'Redelijk bewijs (B)', C: 'Beperkt bewijs (C)', onbekend: 'Geen bewijs',
}

const TRIGGER_LABELS: Record<string, string> = {
  'populatiebreed': 'populatiebrede trigger',
  'subgroep-bevestigd': 'subgroep-trigger',
  'subgroep-overschat': 'subgroep — overschat',
  'onttrekkings-trigger': 'onttrekkingstrigger',
  'drug-interactie': 'alleen bij medicatie',
  'context-afhankelijk': 'context-afhankelijk',
  'individueel-variabel': 'individueel variabel',
  'dosis-afhankelijk': 'dosis-afhankelijk',
}

// Migraine-triggerTypes waarbij de respons sterk per persoon verschilt — toont
// een expliciete hint zodat de score niet als individueel verdict wordt gelezen
// (RISKS.md R-009: populatie- vs individuniveau).
const VARIABLE_RESPONSE_TRIGGERS = new Set<string>([
  'subgroep-bevestigd', 'subgroep-overschat', 'individueel-variabel',
])

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

// ── CondDots — stoplicht per aandoening, voor alternatieven ────────────────
// Maakt expliciet welke aandoening welke score heeft (i.p.v. één gecombineerde
// pill waarvan onduidelijk is voor welke aandoening die geldt).
function CondDots({ item, conditions }: { item: ReturnType<typeof getItemById>; conditions: Condition[] }) {
  if (!item) return null
  return (
    <div style={{ display: 'flex', gap: 9, flexShrink: 0 }}>
      {conditions.map((c) => {
        const status = scoreToStatus(item.scores[c]?.score ?? null)
        return (
          <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <span style={{
              width: 11, height: 11, borderRadius: 3, flexShrink: 0,
              background: status !== 'null' ? `var(--${status})` : 'var(--rule)',
            }} />
            <span className="mono" style={{ fontSize: 8, letterSpacing: 0.3, color: 'var(--muted)' }}>
              {COND_ABBR[c]}
            </span>
          </div>
        )
      })}
    </div>
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
  const [saved, setSaved] = useState(() => isInList(id))
  const [showTip, setShowTip] = useState(() => {
    try { return localStorage.getItem('voedingsapp_detail_tip_v1') !== 'true' } catch { return false }
  })

  const dismissTip = () => {
    try { localStorage.setItem('voedingsapp_detail_tip_v1', 'true') } catch { /* ignore */ }
    setShowTip(false)
  }

  useEffect(() => {
    if (id) recordView(id)
    setExpandedCond(null)
    setSaved(isInList(id))
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
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${conditions.length}, 1fr)`, gap: 6, marginBottom: 12 }}>
        {conditions.map((c) => (
          <CondCell key={c} status={scoreToStatus(item.scores[c]?.score ?? null)} label={COND_SHORT[c]} />
        ))}
      </div>

      {/* E3 — eenmalige uitleg hoe je een resultaat leest */}
      {showTip && (
        <div style={{
          position: 'relative', padding: '12px 32px 12px 14px', marginBottom: 16,
          background: 'var(--brand-50)', borderRadius: 10,
          border: '1px solid color-mix(in srgb, var(--brand) 20%, transparent)',
          fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          Elke gekleurde balk is één aandoening uit jouw profiel. Groen = veilig, rood = vermijden.
          Tik op <strong style={{ color: 'var(--ink)' }}>meer info</strong> voor de onderbouwing en
          het bewijsniveau (sterk/redelijk/beperkt).
          <button
            onClick={dismissTip}
            aria-label="Tip sluiten"
            style={{
              position: 'absolute', top: 8, right: 8, background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--muted)', padding: 2, lineHeight: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Op-lijstje-knop — kernactie, prominent onder de stoplichten */}
      <button
        onClick={() => setSaved(toggleList(item.id))}
        aria-pressed={saved}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 10, marginBottom: 16,
          border: saved ? '1px solid var(--rule)' : 'none',
          background: saved ? 'var(--paper-2)' : 'var(--brand)',
          color: saved ? 'var(--ink-soft)' : '#fff',
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7z" />
        </svg>
        {saved ? 'Op je lijstje ✓' : 'Op lijstje zetten'}
      </button>

      {/* Conflict / summary banner */}
      {combined.conflict && (
        <div style={{
          padding: '12px 14px', background: 'var(--warn-bg)', borderRadius: 10,
          fontSize: 12.5, color: 'var(--warn-ink)', lineHeight: 1.5, marginBottom: 16,
        }}>
          <span style={{ fontWeight: 600 }}>Let op</span>
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
                    {s.triggerType && VARIABLE_RESPONSE_TRIGGERS.has(s.triggerType) && (
                      <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: 6 }}>
                        ↳ Populatie-inschatting — de respons hierop verschilt per persoon.
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
                      <span style={{ fontSize: 10.5, color: 'var(--muted)', marginLeft: s.sources.length > 0 ? 8 : 0 }}>
                        {EVIDENCE_LABELS[s.evidence] ?? s.evidence}
                      </span>
                    )}
                    {/* Meer info — technische details ingeklapt */}
                    {(s.triggerType || !!s.primaryModulators?.length || s.confidence) && (
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
                            {s.triggerType && (
                              <span style={{
                                fontSize: 11, padding: '2px 8px', borderRadius: 999, alignSelf: 'flex-start',
                                background: 'var(--paper-2)', color: 'var(--ink-soft)',
                                border: '1px solid var(--rule-soft)',
                              }}>
                                {TRIGGER_LABELS[s.triggerType] ?? s.triggerType}
                              </span>
                            )}
                            {s.primaryModulators && s.primaryModulators.length > 0 && (
                              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                                Gevoelig bij: {s.primaryModulators.join(', ')}
                              </div>
                            )}
                            {s.confidence && (
                              <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted)' }}>
                                vertrouwen: {s.confidence}
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
                {/* Vocht-waarschuwing (CLAUDE.md §2.3) — apart van de per-item score:
                    voldoende vocht is bij nierstenen even bepalend als oxalaat beperken. */}
                {c === 'nierstenen' && (
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.5, marginTop: s ? 8 : 6 }}>
                    ↳ Drink minstens 2,5 liter vocht per dag — bij nierstenen even belangrijk als het beperken van oxalaat.
                  </div>
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

      {/* Suiker-hint: informatief, niet-scorend, niet aandoeningsspecifiek (CLAUDE.md §2.5) */}
      {item.highAddedSugar && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <span
            title="Hoog gehalte toegevoegde suiker (>22,5 g/100 g). De stoplichten beoordelen alleen triggers voor jouw aandoening(en), niet algemene gezondheid — een groen licht betekent dus niet 'onbeperkt'."
            style={{ fontSize: 12, padding: '4px 10px', borderRadius: 999, background: 'var(--warn-bg)', color: 'var(--warn-ink)' }}
          >
            Suikerrijk · geen gezondheidsoordeel
          </span>
        </div>
      )}

      {/* Alternatives (mobile inline) */}
      {showAlternatives && alternatives.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>
            Betere alternatieven · gunstiger voor jouw profiel
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
                  <CondDots item={alt} conditions={conditions} />
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
            Drie gunstigere opties die qua gebruik dichtbij {nameFirst} liggen.
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
                  <CondDots item={alt} conditions={conditions} />
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
