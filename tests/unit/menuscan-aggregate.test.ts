import { describe, it, expect } from 'vitest'
import { assessDish, COVERAGE_THRESHOLD } from '@/lib/menuscan-aggregate'
import { matchIngredient } from '@/lib/menuscan-match'
import type { Condition } from '@/schemas/item'

// Verwachte max() voor een aandoening, afgeleid uit de echte database (geen hardgecodeerde
// scores → blijft kloppen als de data verandert).
function expectedMax(ingredients: string[], c: Condition): number | null {
  let max: number | null = null
  for (const raw of ingredients) {
    const s = matchIngredient(raw)?.item.scores[c]
    if (s && (max === null || s.score > max)) max = s.score
  }
  return max
}

describe('assessDish', () => {
  const dish = ['gerookte runderbiefstuk', 'parmezaanse kaas', 'rucola', 'kappertjes']

  it('berekent dekking en onbekend-vlag', () => {
    const a = assessDish([...dish, 'volstrekt onbekend xyzzy'], ['jicht'])
    expect(a.totalCount).toBe(5)
    expect(a.matchedCount).toBe(4)
    expect(a.coverage).toBeCloseTo(0.8)
    expect(a.hasUnknown).toBe(true)
  })

  it('aggregeert per aandoening met max() en het juiste drijvende ingrediënt', () => {
    const a = assessDish(dish, ['migraine'])
    const pc = a.perCondition[0]
    expect(pc.score).toBe(expectedMax(dish, 'migraine'))
    // het drijvende ingrediënt moet zelf die max-score dragen
    const driverScore = matchIngredient(pc.drivingIngredient!)?.item.scores.migraine?.score
    expect(driverScore).toBe(pc.score)
  })

  it('profiel-scoping: alleen actieve aandoeningen, in volgorde', () => {
    const conditions: Condition[] = ['jicht', 'histamine']
    const a = assessDish(dish, conditions)
    expect(a.perCondition.map((p) => p.condition)).toEqual(conditions)
  })

  it('toont gerecht-totaal vanaf de dekkingsdrempel, niet eronder', () => {
    const boven = assessDish(['rucola', 'kappertjes'], ['jicht']) // 100%
    expect(boven.coverage).toBeGreaterThanOrEqual(COVERAGE_THRESHOLD)
    expect(boven.showDishTotal).toBe(true)

    const onder = assessDish(['rucola', 'xyzzy1', 'xyzzy2'], ['jicht']) // 33%
    expect(onder.coverage).toBeLessThan(COVERAGE_THRESHOLD)
    expect(onder.showDishTotal).toBe(false)
  })

  it('alleen onbekende ingrediënten → dekking 0, scores null', () => {
    const a = assessDish(['xyzzy1', 'xyzzy2'], ['jicht', 'migraine'])
    expect(a.coverage).toBe(0)
    expect(a.matchedCount).toBe(0)
    expect(a.perCondition.every((p) => p.score === null)).toBe(true)
  })

  it('lege ingrediëntenlijst → dekking 0', () => {
    const a = assessDish([], ['jicht'])
    expect(a.coverage).toBe(0)
    expect(a.totalCount).toBe(0)
  })
})
