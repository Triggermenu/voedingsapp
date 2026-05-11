import type { FoodItem, Condition, ScoreObject } from '@/schemas/item'

export interface CombinedScore {
  score: number | null
  conflict: boolean
  perCondition: Partial<Record<Condition, ScoreObject | null>>
}

export type ScoreLabel = 'groen' | 'geel' | 'oranje' | 'rood' | 'onbekend'

export function getCombinedScore(item: FoodItem, conditions: Condition[]): CombinedScore {
  const perCondition: Partial<Record<Condition, ScoreObject | null>> = {}
  const activeScores: number[] = []

  // Guard: item has no scores object at all
  const scoresObj = item?.scores ?? {}

  for (const condition of conditions) {
    const s = scoresObj[condition] ?? null
    perCondition[condition] = s
    // Use loose null-check so undefined (missing key) is also skipped
    if (s != null) activeScores.push(s.score)
  }

  if (activeScores.length === 0) {
    return { score: null, conflict: false, perCondition }
  }

  const max = Math.max(...activeScores)
  const min = Math.min(...activeScores)
  const conflict = activeScores.length > 1 && max - min >= 2

  return { score: max, conflict, perCondition }
}

export function getScoreLabel(score: number | null): ScoreLabel {
  if (score === null) return 'onbekend'
  if (score === 0) return 'groen'
  if (score === 1) return 'geel'
  if (score === 2) return 'oranje'
  return 'rood'
}

export function scoreColorClasses(score: number | null): string {
  switch (score) {
    case 0: return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 2: return 'bg-orange-100 text-orange-800 border-orange-200'
    case 3: return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-500 border-gray-200'
  }
}

export function scoreDotClass(score: number | null): string {
  switch (score) {
    case 0: return 'bg-emerald-500'
    case 1: return 'bg-yellow-400'
    case 2: return 'bg-orange-500'
    case 3: return 'bg-red-600'
    default: return 'bg-gray-300'
  }
}

export function scoreEmoji(score: number | null): string {
  switch (score) {
    case 0: return '🟢'
    case 1: return '🟡'
    case 2: return '🟠'
    case 3: return '🔴'
    default: return '⚪'
  }
}
