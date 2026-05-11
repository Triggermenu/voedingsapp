import type { FoodItem, Condition } from '@/schemas/item'
import { getCombinedScore } from '@/lib/scoring'

import groenteData from '@/data/groente.json'
import fruitData from '@/data/fruit.json'
import vleesData from '@/data/vlees.json'
import visData from '@/data/vis.json'
import zuivelData from '@/data/zuivel.json'
import granenData from '@/data/granen.json'
import peulvruchtenData from '@/data/peulvruchten.json'
import drankenAlcoholData from '@/data/dranken-alcohol.json'
import drankenNonAlcoholData from '@/data/dranken-non-alcohol.json'
import notenData from '@/data/noten-zaden.json'
import zoetwarenData from '@/data/zoetwaren.json'
import sauzenData from '@/data/sauzen-kruiden.json'

const ALL_ITEMS: FoodItem[] = [
  ...groenteData.items,
  ...fruitData.items,
  ...vleesData.items,
  ...visData.items,
  ...zuivelData.items,
  ...granenData.items,
  ...peulvruchtenData.items,
  ...drankenAlcoholData.items,
  ...drankenNonAlcoholData.items,
  ...notenData.items,
  ...zoetwarenData.items,
  ...sauzenData.items,
] as FoodItem[]

export function getAllItems(): FoodItem[] {
  return ALL_ITEMS
}

export function searchItems(query: string, conditions: Condition[]): FoodItem[] {
  const q = query.toLowerCase().trim()

  return ALL_ITEMS.filter((item) => {
    if (q && !item.name.nl.toLowerCase().includes(q) && !item.name.en.toLowerCase().includes(q)) {
      return false
    }
    // Show item if it has at least one active condition scored
    const hasActiveScore = conditions.some((c) => item.scores[c] !== null)
    return hasActiveScore
  })
}

export function getItemById(id: string): FoodItem | undefined {
  return ALL_ITEMS.find((item) => item.id === id)
}

export function getAlternatives(item: FoodItem, conditions: Condition[], limit = 3): FoodItem[] {
  const currentScore = getCombinedScore(item, conditions).score
  if (currentScore === null || currentScore < 2) return []

  return ALL_ITEMS
    .filter((candidate) => {
      if (candidate.id === item.id) return false
      const sameGroup = (item.subcategory && candidate.subcategory)
        ? candidate.subcategory === item.subcategory
        : candidate.category === item.category
      if (!sameGroup) return false
      const s = getCombinedScore(candidate, conditions)
      return s.score !== null && s.score < currentScore
    })
    .sort((a, b) => {
      const sa = getCombinedScore(a, conditions).score ?? 99
      const sb = getCombinedScore(b, conditions).score ?? 99
      return sa - sb
    })
    .slice(0, limit)
}

export function getDatabaseStats() {
  return {
    totalItems: ALL_ITEMS.length,
    schemaVersion: import.meta.env.VITE_SCHEMA_VERSION ?? '1.0.0',
  }
}
