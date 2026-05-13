import type { FoodItem, Condition, Category } from '@/schemas/item'
import { getCombinedScore } from '@/lib/scoring'

const CATEGORY_FALLBACKS: Partial<Record<Category, Category>> = {
  'dranken-alcohol': 'dranken-non-alcohol',
}

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

const _seen = new Set<string>()
const ALL_ITEMS: FoodItem[] = ([
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
] as FoodItem[]).filter((item) => {
  if (_seen.has(item.id)) return false
  _seen.add(item.id)
  return true
})

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
  // Validate id format before lookup to avoid matching on unexpected input
  if (!/^(\d+|nl-[a-z0-9-]+)$/.test(id)) return undefined
  return ALL_ITEMS.find((item) => item.id === id)
}

export function getAlternatives(item: FoodItem, conditions: Condition[], limit = 3): FoodItem[] {
  const currentScore = getCombinedScore(item, conditions).score
  if (currentScore === null || currentScore < 2) return []

  const scoreCache = new Map<string, number | null>()
  const cachedScore = (c: FoodItem) => {
    if (!scoreCache.has(c.id)) scoreCache.set(c.id, getCombinedScore(c, conditions).score)
    return scoreCache.get(c.id)!
  }

  const ranked = (candidates: FoodItem[]) =>
    candidates
      .filter((candidate) => {
        const s = cachedScore(candidate)
        return s !== null && s < currentScore
      })
      .sort((a, b) => (cachedScore(a) ?? 99) - (cachedScore(b) ?? 99))
      .slice(0, limit)

  // Tier 1: same subcategory
  if (item.subcategory) {
    const fromSubcat = ranked(ALL_ITEMS.filter((c) => c.id !== item.id && c.subcategory === item.subcategory))
    if (fromSubcat.length > 0) return fromSubcat
  }

  // Tier 2: same category (regardless of subcategory)
  const fromCat = ranked(ALL_ITEMS.filter((c) => c.id !== item.id && c.category === item.category))
  if (fromCat.length > 0) return fromCat

  // Tier 3: related category (e.g. alcohol → non-alcoholic drinks)
  const fallback = CATEGORY_FALLBACKS[item.category as Category]
  if (fallback) return ranked(ALL_ITEMS.filter((c) => c.category === fallback))

  return []
}

export function getDatabaseStats() {
  return {
    totalItems: ALL_ITEMS.length,
    schemaVersion: import.meta.env.VITE_SCHEMA_VERSION ?? '1.0.0',
  }
}
