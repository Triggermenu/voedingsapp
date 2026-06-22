// Menuscan-matcher (menuscan-herontwerp §10.2).
//
// Koppelt een vrij-tekst ingrediënt (zoals de AI het uit een menukaartfoto haalt) aan een
// item in de gevalideerde database, zodat de SCORE uit de database komt en niet uit de AI.
// Deterministisch in drie lagen: alias-tabel → exacte/basisnaam → token. Geen treffer →
// `null` (de aanroeper toont dan "onbekend — vraag de ober", nooit een gokscore).
//
// `bereid-gerecht`-items worden uitgesloten: dat zijn hele gerechten, geen ingrediënten
// (voorkomt dat "parmezaan" matcht op "Risotto (Parmezaan)").

import type { FoodItem } from '@/schemas/item'
import { getAllItems } from '@/lib/db'
import { INGREDIENT_ALIASES, REPRESENTATIVE_ALIASES } from '@/lib/menuscan-aliases'

export type MatchMethod = 'alias' | 'exact' | 'token' | 'representatief'

export interface IngredientMatch {
  item: FoodItem
  method: MatchMethod
  /** true als de match een benadering is (generieke term → representatief item). */
  approximate: boolean
}

/** lowercase, diacrieten weg, leestekens → spatie, witruimte genormaliseerd. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Basisnaam = naam zonder parenthese-kwalificatie: "Runderbiefstuk (mager)" → "runderbiefstuk". */
function baseName(nl: string): string {
  return normalize(nl.replace(/\([^)]*\)/g, ''))
}

/**
 * Losse naamvarianten uit een "/"-naam. Veel DB-items bundelen synoniemen in één entry
 * ("Lente-ui / bosui", "Zoete aardappel / bataat", "Cognac / Brandy"); zonder dit zou enkel
 * de samengestelde naam matchen en glipt elke losse term door de matcher ("lente-ui" werd
 * "niet bekend" terwijl het item bestond). Parenthese-kwalificaties eerst eruit, zodat
 * "(beef/pork)" geen valse split geeft; korte fragmenten en suffix-shorthand ("-thee") weg.
 */
function nameVariants(name: string): string[] {
  if (!name.includes('/')) return []
  const cleaned = name.replace(/\([^)]*\)/g, ' ')
  if (!cleaned.includes('/')) return []
  return cleaned.split('/').map((p) => p.trim()).filter((p) => p.length >= 3 && !p.startsWith('-'))
}

const POOL: FoodItem[] = getAllItems().filter((i) => i.category !== 'bereid-gerecht')

const byExact = new Map<string, FoodItem>()
const byBase = new Map<string, FoodItem>()
const addKey = (map: Map<string, FoodItem>, key: string, it: FoodItem) => {
  if (key && !map.has(key)) map.set(key, it)
}

// Pass 1: volledige namen (nl + en) — krijgen voorrang bij botsing.
for (const it of POOL) {
  addKey(byExact, normalize(it.name.nl), it)
  addKey(byExact, normalize(it.name.en), it)
  addKey(byBase, baseName(it.name.nl), it)
}

// Pass 2: losse naamvarianten uit "/"-namen (bv. "Lente-ui / bosui" → "lente-ui", "bosui"),
// zodat als synoniem gebundelde termen ook los matchen. Pass 1 had voorrang, dus een variant
// overschrijft nooit de echte volledige naam van een ánder item.
for (const it of POOL) {
  for (const nm of [it.name.nl, it.name.en]) {
    for (const variant of nameVariants(nm)) {
      const key = normalize(variant)
      addKey(byExact, key, it)
      addKey(byBase, key, it)
    }
  }
}

function resolveName(name: string): FoodItem | undefined {
  const n = normalize(name)
  return byExact.get(n) ?? byBase.get(n)
}

/**
 * Morfologische varianten voor meervoud/enkelvoud (NL is grillig, dit dekt de gangbare
 * gevallen): "champignon" ↔ "champignons", "boon" ↔ "bonen". Langste/origineel eerst.
 */
function variants(n: string): string[] {
  const out = new Set<string>([n])
  out.add(n + 's')
  out.add(n + 'en')
  if (n.endsWith('s')) out.add(n.slice(0, -1))
  if (n.endsWith('en')) out.add(n.slice(0, -2))
  return [...out]
}

function lookupVariant(n: string): FoodItem | undefined {
  for (const v of variants(n)) {
    const hit = byExact.get(v) ?? byBase.get(v)
    if (hit) return hit
  }
  return undefined
}

// Token-index: langere sleutels eerst zodat de meest specifieke match wint.
// `source` onthoudt of de treffer via een alias of via een DB-basisnaam kwam.
interface TokenEntry {
  key: string
  item: FoodItem
  source: 'alias' | 'base'
}
const tokenIndex: TokenEntry[] = []
for (const [aliasKey, target] of Object.entries(INGREDIENT_ALIASES)) {
  const item = resolveName(target)
  if (item) tokenIndex.push({ key: normalize(aliasKey), item, source: 'alias' })
}
for (const [base, item] of byBase) {
  tokenIndex.push({ key: base, item, source: 'base' })
}
tokenIndex.sort((a, b) => b.key.length - a.key.length)

function keyMatchesIn(key: string, words: Set<string>, full: string): boolean {
  if (key.length < 4) return false
  // Eén woord → moet als heel token voorkomen (geen substring-ruis als "ui" in "bruin").
  if (!key.includes(' ')) return words.has(key)
  // Meerdere woorden → volledige frase moet voorkomen.
  return full.includes(key)
}

/**
 * Koppelt een ingrediënt-string aan een DB-item, of `null` als er geen betrouwbare match is.
 */
export function matchIngredient(raw: string): IngredientMatch | null {
  const n = normalize(raw)
  if (!n) return null

  // 1. Precieze alias — exacte sleutel.
  const aliasTarget = INGREDIENT_ALIASES[n]
  if (aliasTarget) {
    const item = resolveName(aliasTarget)
    if (item) return { item, method: 'alias', approximate: false }
  }

  // 2. Representatieve alias — generieke term → benadering.
  const repTarget = REPRESENTATIVE_ALIASES[n]
  if (repTarget) {
    const item = resolveName(repTarget)
    if (item) return { item, method: 'representatief', approximate: true }
  }

  // 3. Exacte volledige naam of basisnaam (incl. meervoud/enkelvoud-varianten).
  const exact = lookupVariant(n)
  if (exact) return { item: exact, method: 'exact', approximate: false }

  // 4. Token — langste alias-/basisnaam-sleutel die in het ingrediënt voorkomt.
  const words = new Set(n.split(' '))
  for (const entry of tokenIndex) {
    if (keyMatchesIn(entry.key, words, n)) {
      return { item: entry.item, method: entry.source === 'alias' ? 'alias' : 'token', approximate: false }
    }
  }

  return null
}
