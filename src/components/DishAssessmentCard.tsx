// Ingrediënt-centrische gerecht-kaart voor de menuscan (menuscan-herontwerp.md §9).
//
// De ingrediënten zijn de ruggengraat; per ingrediënt: z'n trigger(s) voor de ACTIEVE
// aandoeningen + de uitleg-met-bron uit de DB-note. Onbekende ingrediënten krijgen géén
// score, maar een ober-vraag. Het gerecht-totaal (stoplichten + ring) is de samenvatting,
// alleen getoond vanaf de dekkingsdrempel. Alles profiel-gescopet.

import type { Condition } from '@/schemas/item'
import { assessDish } from '@/lib/menuscan-aggregate'
import { MenuscanRing } from './MenuscanRing'

const COND_LABEL: Record<Condition, string> = {
  jicht: 'Jicht', migraine: 'Migraine', nierstenen: 'Nierstenen', histamine: 'Histamine',
}
const COND_SHORT: Record<Condition, string> = {
  jicht: 'JCH', migraine: 'MIG', nierstenen: 'NIE', histamine: 'HIS',
}
const SCORE_LABEL: Record<number, string> = {
  0: 'Gunstig', 1: 'Met mate', 2: 'Spaarzaam', 3: 'Liever niet',
}
const CHIP: Record<number, { bg: string; ink: string }> = {
  1: { bg: 'var(--ok-bg)', ink: 'var(--ok-ink)' },
  2: { bg: 'var(--warn-bg)', ink: 'var(--warn-ink)' },
  3: { bg: 'var(--avoid-bg)', ink: 'var(--avoid-ink)' },
}
const SQUARE: Record<number, string> = {
  0: 'var(--safe)', 1: 'var(--ok)', 2: 'var(--warn)', 3: 'var(--avoid)',
}

interface Props {
  dish: string
  ingredients: string[]
  conditions: Condition[]
}

export function DishAssessmentCard({ dish, ingredients, conditions }: Props) {
  const a = assessDish(ingredients, conditions)

  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--rule)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="serif" style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3 }}>{dish}</div>
          {a.showDishTotal && (
            <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
              {a.perCondition.map((pc) => (
                pc.score === null ? null : (
                  <span
                    key={pc.condition}
                    aria-label={`${COND_LABEL[pc.condition]} ${SCORE_LABEL[pc.score]}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 24, borderRadius: 6, fontSize: 10, fontWeight: 500,
                      background: SQUARE[pc.score], color: pc.score === 1 ? '#241800' : '#fff',
                    }}
                  >{COND_SHORT[pc.condition]}</span>
                )
              ))}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <MenuscanRing coverage={a.coverage} />
          <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 2 }}>dekking</div>
        </div>
      </div>

      {!a.showDishTotal && (
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 8 }}>
          Te weinig herkend voor een gerecht-oordeel — bekijk de ingrediënten hieronder.
        </div>
      )}

      <div className="eyebrow" style={{ fontSize: 10, marginTop: 16, marginBottom: 2 }}>Ingrediënten</div>

      {a.ingredients.map((mi, i) => {
        if (!mi.match) {
          return (
            <div key={i} style={{ background: 'var(--warn-bg)', borderRadius: 8, padding: '9px 11px', marginTop: 6 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{mi.raw}</span>
                <span style={{ fontSize: 11, color: 'var(--warn-ink)', flexShrink: 0 }}>niet bekend</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 5 }}>
                Niet in de database — geen score. Vraag het na: <span style={{ color: 'var(--ink)', fontWeight: 500 }}>"Kan dit zonder {mi.raw.toLowerCase()}?"</span>
              </div>
            </div>
          )
        }

        const item = mi.match.item
        const approx = mi.match.approximate
        const triggers = conditions
          .map((c) => ({ c, s: item.scores[c] }))
          .filter((x) => x.s !== null && x.s.score >= 1)

        return (
          <div key={i} style={{ borderTop: '0.5px solid var(--rule-soft)', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>
                {approx ? mi.raw : item.name.nl}
                {triggers.length === 0 && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--safe-ink)' }}> · geen trigger</span>}
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>{approx ? '≈ database' : 'database'}</span>
            </div>
            {approx && (
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', marginTop: 3, fontStyle: 'italic' }}>
                ≈ beoordeeld als {item.name.nl} — representatief, de werkelijke variant kan afwijken
              </div>
            )}

            {triggers.map(({ c, s }) => (
              <div key={c} style={{ marginTop: 6 }}>
                <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 6, background: CHIP[s!.score].bg, color: CHIP[s!.score].ink }}>
                  {COND_LABEL[c]} · {SCORE_LABEL[s!.score]}
                </span>
                <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 5 }}>
                  {s!.note?.nl ? `${s!.note.nl} ` : ''}
                  {s!.sources.map((src, j) => (
                    <a key={j} href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>{src.title} ↗</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
