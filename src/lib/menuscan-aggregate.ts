// Menuscan-aggregatie (menuscan-herontwerp.md §10.2).
//
// Zet een lijst ingrediënt-strings (uit de AI-extractie) om in een gerecht-beoordeling die
// volledig op de gevalideerde database steunt: per actieve aandoening de `max()` over de
// gematchte ingrediënten, mét het drijvende ingrediënt, plus de databasedekking.
//
// Profiel-scoping (harde regel): perCondition bevat UITSLUITEND de actieve aandoeningen —
// nooit een vast aantal. Onbekende ingrediënten krijgen geen score (de aanroeper toont
// "vraag de ober").

import type { Condition } from '@/schemas/item'
import { matchIngredient, type IngredientMatch } from '@/lib/menuscan-match'

/** Drempel waaronder we géén gerecht-totaal tonen ("te onzeker — vraag de ober"). */
export const COVERAGE_THRESHOLD = 0.5

export interface MatchedIngredient {
  raw: string
  match: IngredientMatch | null
}

export interface DishConditionScore {
  condition: Condition
  /** max() over de gematchte ingrediënten; `null` als geen enkel gematcht item deze as scoort. */
  score: number | null
  /** ruwe naam van het ingrediënt dat de max bepaalt. */
  drivingIngredient: string | null
}

export interface DishAssessment {
  ingredients: MatchedIngredient[]
  matchedCount: number
  totalCount: number
  /** 0..1 — aandeel ingrediënten dat aan een DB-item gekoppeld kon worden. */
  coverage: number
  /** true als minstens één ingrediënt onbekend is. */
  hasUnknown: boolean
  /** alleen de actieve aandoeningen (profiel-scoping). */
  perCondition: DishConditionScore[]
  /** false als de dekking onder COVERAGE_THRESHOLD ligt — dan géén gerecht-totaal tonen. */
  showDishTotal: boolean
}

export function assessDish(ingredients: string[], conditions: Condition[]): DishAssessment {
  const matched: MatchedIngredient[] = ingredients.map((raw) => ({
    raw,
    match: matchIngredient(raw),
  }))

  const totalCount = matched.length
  const matchedCount = matched.filter((m) => m.match !== null).length
  const coverage = totalCount === 0 ? 0 : matchedCount / totalCount

  const perCondition: DishConditionScore[] = conditions.map((condition) => {
    let score: number | null = null
    let drivingIngredient: string | null = null
    for (const m of matched) {
      const s = m.match?.item.scores[condition]
      if (!s) continue
      if (score === null || s.score > score) {
        score = s.score
        drivingIngredient = m.raw
      }
    }
    return { condition, score, drivingIngredient }
  })

  return {
    ingredients: matched,
    matchedCount,
    totalCount,
    coverage,
    hasUnknown: matchedCount < totalCount,
    perCondition,
    showDishTotal: coverage >= COVERAGE_THRESHOLD,
  }
}
