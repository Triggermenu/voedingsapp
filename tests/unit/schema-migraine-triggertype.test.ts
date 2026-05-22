import { describe, it, expect } from 'vitest'
import { FoodItemSchema } from '@/schemas/item'

const SRC = { url: 'https://example.com', title: 'Test', type: 'database' as const, accessedAt: '2026-01-01' }

function makeItem(scores: Record<string, unknown>) {
  return {
    id: 'nl-test-item',
    name: { nl: 'Test', en: 'Test' },
    category: 'groente',
    scores: { jicht: null, migraine: null, nierstenen: null, histamine: null, ...scores },
    meta: { addedAt: '2026-01-01', schemaVersion: '1.0.0', lastReviewed: '2026-01-01' },
  }
}

// CLAUDE.md §3.3: triggerType is verplicht bij een migraine-score >= 2.
// De regel geldt uitsluitend voor de migraine-as.
describe('CLAUDE.md §3.3 — triggerType verplicht bij migraine score >= 2', () => {
  it('weigert migraine score 2 zonder triggerType', () => {
    const item = makeItem({
      jicht: { score: 0, evidence: 'A', sources: [SRC] },
      migraine: { score: 2, evidence: 'B', sources: [SRC] },
    })
    expect(FoodItemSchema.safeParse(item).success).toBe(false)
  })

  it('weigert migraine score 3 zonder triggerType', () => {
    const item = makeItem({
      jicht: { score: 0, evidence: 'A', sources: [SRC] },
      migraine: { score: 3, evidence: 'B', sources: [SRC] },
    })
    expect(FoodItemSchema.safeParse(item).success).toBe(false)
  })

  it('accepteert migraine score 2 met triggerType', () => {
    const item = makeItem({
      jicht: { score: 0, evidence: 'A', sources: [SRC] },
      migraine: { score: 2, evidence: 'B', sources: [SRC], triggerType: 'subgroep-overschat' },
    })
    expect(FoodItemSchema.safeParse(item).success).toBe(true)
  })

  it('accepteert migraine score 1 zonder triggerType', () => {
    const item = makeItem({
      jicht: { score: 0, evidence: 'A', sources: [SRC] },
      migraine: { score: 1, evidence: 'B', sources: [SRC] },
    })
    expect(FoodItemSchema.safeParse(item).success).toBe(true)
  })

  it('laat jicht score 3 zonder triggerType ongemoeid (regel is migraine-only)', () => {
    const item = makeItem({
      jicht: { score: 3, evidence: 'A', sources: [SRC] },
      nierstenen: { score: 2, evidence: 'A', sources: [SRC] },
    })
    expect(FoodItemSchema.safeParse(item).success).toBe(true)
  })
})
