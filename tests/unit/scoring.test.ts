import { describe, it, expect } from 'vitest'
import { getCombinedScore, getScoreLabel } from '@/lib/scoring'
import type { FoodItem } from '@/schemas/item'

const SRC = { url: 'https://example.com', title: 'Test', type: 'database' as const, accessedAt: '2026-01-01' }

function makeItem(overrides: Partial<FoodItem['scores']>): FoodItem {
  return {
    id: '999',
    name: { nl: 'Test', en: 'Test' },
    category: 'groente',
    scores: {
      jicht: null,
      migraine: null,
      nierstenen: null,
      histamine: null,
      ...overrides,
    },
    meta: { addedAt: '2026-01-01', schemaVersion: '1.0.0', lastReviewed: '2026-01-01' },
  }
}

describe('getCombinedScore', () => {
  it('returns max score when no conflict', () => {
    const item = makeItem({
      jicht: { score: 1, evidence: 'A', sources: [SRC] },
      migraine: { score: 2, evidence: 'B', sources: [SRC] },
    })
    const result = getCombinedScore(item, ['jicht', 'migraine'])
    expect(result.score).toBe(2)
    expect(result.conflict).toBe(false)
  })

  it('detects conflict when scores differ by 2+', () => {
    const item = makeItem({
      jicht: { score: 0, evidence: 'A', sources: [SRC] },
      migraine: { score: 3, evidence: 'B', sources: [SRC] },
    })
    const result = getCombinedScore(item, ['jicht', 'migraine'])
    expect(result.conflict).toBe(true)
    expect(result.score).toBe(3)
  })

  it('returns null when all active conditions are null', () => {
    const item = makeItem({})
    const result = getCombinedScore(item, ['jicht', 'migraine'])
    expect(result.score).toBeNull()
  })

  it('ignores inactive conditions', () => {
    const item = makeItem({
      jicht: { score: 3, evidence: 'A', sources: [SRC] },
      migraine: { score: 0, evidence: 'B', sources: [SRC] },
    })
    // Only jicht is active
    const result = getCombinedScore(item, ['jicht'])
    expect(result.score).toBe(3)
    expect(result.conflict).toBe(false)
  })
})

describe('getScoreLabel', () => {
  it('maps scores correctly', () => {
    expect(getScoreLabel(0)).toBe('groen')
    expect(getScoreLabel(1)).toBe('geel')
    expect(getScoreLabel(2)).toBe('oranje')
    expect(getScoreLabel(3)).toBe('rood')
    expect(getScoreLabel(null)).toBe('onbekend')
  })
})

describe('Regression: koffie jicht', () => {
  it('koffie has max jicht score 1', async () => {
    const { getAllItems } = await import('@/lib/db')
    const items = getAllItems()
    const koffie = items.filter((i) => i.name.nl.toLowerCase().includes('koffie'))
    expect(koffie.length).toBeGreaterThan(0)
    for (const item of koffie) {
      if (item.scores.jicht !== null) {
        expect(item.scores.jicht.score).toBeLessThanOrEqual(1)
      }
    }
  })
})

describe('Regression: chocolade migraine', () => {
  it('chocolade has migraine score <= 2', async () => {
    const { getAllItems } = await import('@/lib/db')
    const items = getAllItems()
    const choc = items.filter((i) => i.name.nl.toLowerCase().includes('chocolade'))
    for (const item of choc) {
      if (item.scores.migraine !== null) {
        expect(item.scores.migraine.score).not.toBe(3)
      }
    }
  })
})

describe('Regression: hoog-calcium nierstenen', () => {
  it('melk en yoghurt hebben nierstenen score <= 1', async () => {
    const { getAllItems } = await import('@/lib/db')
    const items = getAllItems()
    // Zuivel-categorie = hoog calcium; amandelmelk etc. vallen onder noten-zaden en zijn uitgesloten
    const highCalcium = items.filter((i) =>
      i.category === 'zuivel' &&
      (i.name.nl.toLowerCase().includes('melk') || i.name.nl.toLowerCase().includes('yoghurt'))
    )
    expect(highCalcium.length).toBeGreaterThan(0)
    for (const item of highCalcium) {
      if (item.scores.nierstenen !== null) {
        expect(item.scores.nierstenen.score).toBeLessThanOrEqual(1)
      }
    }
  })
})
