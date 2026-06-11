import type { FoodItem, Condition, Category } from '@/schemas/item'
import { getCombinedScore } from '@/lib/scoring'

const CATEGORY_FALLBACKS: Partial<Record<Category, Category>> = {
  'dranken-alcohol': 'dranken-non-alcohol',
}

/**
 * Groepeert gerelateerde subcategorieën voor betere alternatieven.
 * Dekt ook typevarianten in de data (bladgroente/bladgroenten etc.).
 * Tier 1.5 in getAlternatives gebruikt deze groepen.
 */
const SUBCATEGORY_GROUPS: Record<string, string[]> = {
  // ── Zuivel ────────────────────────────────────────────────────────
  'kaas-vers':    ['kaas-vers', 'kaas-gerijpt', 'kaas'],
  'kaas-gerijpt': ['kaas-vers', 'kaas-gerijpt', 'kaas'],
  'kaas':         ['kaas-vers', 'kaas-gerijpt', 'kaas'],
  'melk':         ['melk'],
  'yoghurt-kwark':['yoghurt-kwark'],
  'eieren':       ['eieren'],
  'room-boter':   ['room-boter'],

  // ── Vis ───────────────────────────────────────────────────────────
  'magere-vis':    ['magere-vis', 'vette-vis', 'zeevis', 'zoetwatervis', 'bereide-vis', 'bewerkte-vis'],
  'vette-vis':     ['vette-vis', 'magere-vis', 'zeevis', 'zoetwatervis', 'bereide-vis', 'bewerkte-vis'],
  'zeevis':        ['zeevis', 'zoetwatervis', 'magere-vis', 'vette-vis'],
  'zoetwatervis':  ['zoetwatervis', 'zeevis', 'magere-vis', 'vette-vis'],
  'bereide-vis':   ['bereide-vis', 'bewerkte-vis', 'magere-vis', 'vette-vis'],
  'bewerkte-vis':  ['bereide-vis', 'bewerkte-vis', 'magere-vis', 'vette-vis'],
  'gerookt-gerijpt':['gerookt-gerijpt', 'bereide-vis', 'bewerkte-vis'],
  'schaaldieren':  ['schaaldieren', 'schelpdieren', 'schaal-schelpdieren'],
  'schelpdieren':  ['schaaldieren', 'schelpdieren', 'schaal-schelpdieren'],
  'schaal-schelpdieren': ['schaaldieren', 'schelpdieren', 'schaal-schelpdieren'],

  // ── Vlees ─────────────────────────────────────────────────────────
  'rood-vlees':     ['rood-vlees', 'gevogelte', 'wild'],
  'gevogelte':      ['gevogelte', 'rood-vlees', 'wild'],
  'wild':           ['wild', 'rood-vlees', 'gevogelte'],
  'orgaanvlees':    ['orgaanvlees'],
  'verwerkt-vlees': ['verwerkt-vlees', 'bereid-vlees', 'bewerkt-vlees'],
  'bereid-vlees':   ['bereid-vlees', 'verwerkt-vlees', 'bewerkt-vlees'],
  'bewerkt-vlees':  ['bereid-vlees', 'verwerkt-vlees', 'bewerkt-vlees'],

  // ── Fruit (dekt ook typevarianten) ────────────────────────────────
  'citrus':         ['citrus', 'citrusfruit'],
  'citrusfruit':    ['citrus', 'citrusfruit'],
  'steenfruit':     ['steenfruit', 'steenvrucht'],
  'steenvrucht':    ['steenfruit', 'steenvrucht'],
  'meloen':         ['meloen', 'meloenen'],
  'meloenen':       ['meloen', 'meloenen'],
  'tropisch-fruit': ['tropisch-fruit', 'exotisch-fruit'],
  'exotisch-fruit': ['tropisch-fruit', 'exotisch-fruit'],
  'besvruchten':    ['besvruchten'],
  'pitfruit':       ['pitfruit'],
  'gedroogd-fruit': ['gedroogd-fruit'],

  // ── Groente (dekt ook typevarianten) ──────────────────────────────
  'bladgroente':    ['bladgroente', 'bladgroenten'],
  'bladgroenten':   ['bladgroente', 'bladgroenten'],
  'vruchtgroente':  ['vruchtgroente', 'vruchtgroenten'],
  'vruchtgroenten': ['vruchtgroente', 'vruchtgroenten'],
  'wortel':         ['wortel', 'wortelgewassen', 'knolgewassen'],
  'wortelgewassen': ['wortel', 'wortelgewassen', 'knolgewassen'],
  'knolgewassen':   ['wortel', 'wortelgewassen', 'knolgewassen'],
  'koolsoorten':    ['koolsoorten'],
  'ui':             ['ui', 'ui-knoflook', 'uigewassen'],
  'ui-knoflook':    ['ui', 'ui-knoflook', 'uigewassen'],
  'uigewassen':     ['ui', 'ui-knoflook', 'uigewassen'],
  'paddestoelen':   ['paddestoelen', 'paddenstoelen'],
  'paddenstoelen':  ['paddestoelen', 'paddenstoelen'],

  // ── Noten & zaden ─────────────────────────────────────────────────
  'noten':          ['noten', 'notenproducten'],
  'notenproducten': ['noten', 'notenproducten'],
  'zaden':          ['zaden'],
  'noten-olien':    ['noten-olien'],

  // ── Peulvruchten ──────────────────────────────────────────────────
  'bonen':                ['bonen', 'droge-peulvruchten', 'linzen', 'verse-peulvruchten'],
  'droge-peulvruchten':   ['bonen', 'droge-peulvruchten', 'linzen'],
  'linzen':               ['linzen', 'droge-peulvruchten', 'bonen'],
  'verse-peulvruchten':   ['verse-peulvruchten', 'bereide-peulvruchten', 'bonen'],
  'bereide-peulvruchten': ['bereide-peulvruchten', 'verse-peulvruchten'],
  'soja':                 ['soja', 'sojaproducten'],
  'sojaproducten':        ['soja', 'sojaproducten'],

  // ── Granen ────────────────────────────────────────────────────────
  'brood':            ['brood'],
  'pasta':            ['pasta'],
  'rijst':            ['rijst', 'pseudogranen'],
  'pseudogranen':     ['rijst', 'pseudogranen'],
  'havermout-granen': ['havermout-granen', 'ontbijtgranen'],
  'ontbijtgranen':    ['havermout-granen', 'ontbijtgranen'],

  // ── Dranken alcohol ───────────────────────────────────────────────
  'wijn':         ['wijn'],
  'bier':         ['bier', 'cider'],
  'cider':        ['bier', 'cider'],
  'gedistilleerd':['gedistilleerd'],

  // ── Dranken non-alcohol ───────────────────────────────────────────
  'koffie-thee':       ['koffie-thee', 'thee', 'kruidenthee'],
  'thee':              ['thee', 'koffie-thee', 'kruidenthee'],
  'kruidenthee':       ['kruidenthee', 'thee', 'koffie-thee'],
  'frisdrank':         ['frisdrank'],
  'sappen':            ['sappen', 'vruchtensap'],
  'vruchtensap':       ['vruchtensap', 'sappen'],
  'plantaardige-melk': ['plantaardige-melk'],
  'water':             ['water'],

  // ── Zoetwaren ─────────────────────────────────────────────────────
  'chocolade':     ['chocolade'],
  'snoep':         ['snoep', 'koek-biscuit', 'koek-gebak'],
  'koek-biscuit':  ['koek-biscuit', 'koek-gebak', 'snoep'],
  'koek-gebak':    ['koek-gebak', 'koek-biscuit', 'gebak'],
  'gebak':         ['gebak', 'koek-gebak'],
  'ijs':           ['ijs'],
  'zoetstoffen':   ['zoetstoffen'],
  'hartige-snacks':['hartige-snacks'],

  // ── Sauzen & kruiden ──────────────────────────────────────────────
  'kruiden-vers':       ['kruiden-vers', 'kruiden-droog', 'kruiden-specerijen', 'specerijen'],
  'kruiden-droog':      ['kruiden-droog', 'kruiden-vers', 'kruiden-specerijen', 'specerijen'],
  'kruiden-specerijen': ['kruiden-specerijen', 'specerijen', 'kruiden-droog', 'kruiden-vers'],
  'specerijen':         ['specerijen', 'kruiden-specerijen', 'kruiden-droog', 'kruiden-vers'],
  'sauzen':             ['sauzen', 'saus'],
  'saus':               ['saus', 'sauzen'],
  'azijn':              ['azijn'],
  'olie-vet':           ['olie-vet', 'olien'],
  'olien':              ['olien', 'olie-vet'],
}

import groenteData from '@/data/groente.json'
import fruitData from '@/data/fruit.json'
import vleesData from '@/data/vlees.json'
import visData from '@/data/vis-schaaldieren.json'
import zuivelData from '@/data/zuivel.json'
import eierenData from '@/data/eieren.json'
import granenData from '@/data/granen.json'
import peulvruchtenData from '@/data/peulvruchten.json'
import drankenAlcoholData from '@/data/dranken-alcohol.json'
import drankenNonAlcoholData from '@/data/dranken-non-alcohol.json'
import notenData from '@/data/noten-zaden.json'
import zoetwarenData from '@/data/zoetwaren.json'
import sauzenData from '@/data/sauzen-kruiden.json'
import bereidGerechtData from '@/data/bereid-gerecht.json'

const _seen = new Set<string>()
const ALL_ITEMS: FoodItem[] = ([
  ...groenteData.items,
  ...fruitData.items,
  ...vleesData.items,
  ...visData.items,
  ...zuivelData.items,
  ...eierenData.items,
  ...granenData.items,
  ...peulvruchtenData.items,
  ...drankenAlcoholData.items,
  ...drankenNonAlcoholData.items,
  ...notenData.items,
  ...zoetwarenData.items,
  ...sauzenData.items,
  ...bereidGerechtData.items,
] as FoodItem[]).filter((item) => {
  if (_seen.has(item.id)) return false
  _seen.add(item.id)
  return true
})

export function getAllItems(): FoodItem[] {
  return ALL_ITEMS
}

/**
 * Concept-/categoriewoorden waarop ook gezocht mag worden, naast de itemnaam.
 * Lost het vindbaarheidsgat op dat een diëtiste vond: "alcohol" gaf 0 resultaten
 * omdat geen enkel item zo héét, terwijl bier/wijn er wél in staan. Nu toont
 * "alcohol" de hele categorie. Alleen prefix-match (≥3 tekens) om ruis te vermijden.
 */
const CATEGORY_SEARCH_TERMS: Partial<Record<Category, string[]>> = {
  groente:               ['groente', 'groenten'],
  fruit:                 ['fruit', 'vruchten'],
  granen:                ['granen', 'graan', 'brood'],
  peulvruchten:          ['peulvruchten', 'peulvrucht'],
  'noten-zaden':         ['noten', 'zaden', 'pitten'],
  vlees:                 ['vlees', 'gevogelte'],
  'vis-schaaldieren':    ['vis', 'schaaldieren', 'zeevruchten'],
  zuivel:                ['zuivel'],
  eieren:                ['eieren'],
  'dranken-alcohol':     ['alcohol', 'alcoholisch', 'alcoholische', 'drank', 'borrel'],
  'dranken-non-alcohol': ['drank', 'dranken', 'frisdrank'],
  zoetwaren:             ['zoetwaren', 'snoep', 'snack', 'snacks', 'zoetigheid'],
  'sauzen-kruiden':      ['saus', 'sauzen', 'kruiden', 'specerijen'],
  'bereid-gerecht':      ['gerecht', 'maaltijd'],
}

export function searchItems(query: string, conditions: Condition[]): FoodItem[] {
  const q = query.toLowerCase().trim()

  return ALL_ITEMS.filter((item) => {
    if (q) {
      const nameHit = item.name.nl.toLowerCase().includes(q) || item.name.en.toLowerCase().includes(q)
      const subHit = item.subcategory?.toLowerCase().includes(q) ?? false
      const catTerms = CATEGORY_SEARCH_TERMS[item.category as Category]
      const catHit = q.length >= 3 && !!catTerms && catTerms.some((t) => t.startsWith(q))
      if (!nameHit && !subHit && !catHit) return false
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

  const ranked = (candidates: FoodItem[]) =>
    candidates
      .filter((candidate) => {
        if (candidate.id === item.id) return false
        const s = getCombinedScore(candidate, conditions)
        return s.score !== null && s.score < currentScore
      })
      .sort((a, b) => {
        const sa = getCombinedScore(a, conditions).score ?? 99
        const sb = getCombinedScore(b, conditions).score ?? 99
        return sa - sb
      })
      .slice(0, limit)

  // Tier 1: same subcategory
  if (item.subcategory) {
    const fromSubcat = ranked(ALL_ITEMS.filter((c) => c.id !== item.id && c.subcategory === item.subcategory))
    if (fromSubcat.length > 0) return fromSubcat
  }

  // Tier 1.5: gerelateerde subcategorieën (bv. kaas-gerijpt → ook kaas-vers)
  if (item.subcategory && SUBCATEGORY_GROUPS[item.subcategory]) {
    const relatedSubs = SUBCATEGORY_GROUPS[item.subcategory]
    const fromGroup = ranked(ALL_ITEMS.filter((c) => c.id !== item.id && c.subcategory != null && relatedSubs.includes(c.subcategory)))
    if (fromGroup.length > 0) return fromGroup
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
  // Echte laatste-updatedatum = nieuwste meta.lastReviewed in de data (ISO-string,
  // dus lexicografisch vergelijkbaar). NIET new Date(): die toonde altijd de kijkdag,
  // waardoor zelfs een verouderde (gecachete) build "vandaag bijgewerkt" leek.
  let lastUpdated = ''
  for (const item of ALL_ITEMS) {
    const d = item.meta?.lastReviewed
    if (d && d > lastUpdated) lastUpdated = d
  }
  return {
    totalItems: ALL_ITEMS.length,
    lastUpdated,
    schemaVersion: import.meta.env.VITE_SCHEMA_VERSION ?? '1.0.0',
  }
}
