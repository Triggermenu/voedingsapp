import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { DatabaseFileSchema } from '../src/schemas/item'

const DATA_DIR = join(process.cwd(), 'src/data')
const MIGRAINE_WHITELIST = new Set(['rode wijn', 'bier', 'alcohol', 'msg', 'spek', 'bacon', 'gerijpte', 'gecureerd', 'oude kaas'])

// Gate 11: evidence A toegestaan bij database, meta-analyse, of evidence-based guideline (AUA, EULAR, ACR)
const EVIDENCE_A_SOURCE_TYPES = new Set(['database', 'meta-analysis', 'guideline'])

// Gate 13: jicht note-getal moet bij de §2.1-drempel passen (single-ingredient categorieën).
const SINGLE_INGREDIENT = new Set([
  'groente', 'fruit', 'vlees', 'vis-schaaldieren', 'noten-zaden', 'peulvruchten', 'granen', 'zuivel', 'eieren',
])
function jichtBand(mg: number): 0 | 1 | 2 | 3 {
  if (mg < 50) return 0
  if (mg < 100) return 1
  if (mg <= 200) return 2
  return 3
}
/** Verwachte jicht-score uit een note-genoteerde purinewaarde, of null als de note geen waarde noemt. */
function expectedJichtFromNote(note: string, category: string, nameNl: string): number | null {
  const norm = note.replace(/,(\d)/g, '.$1') // decimaalkomma → punt
  const m = /([<>])?\s*~?\s*(\d{1,3}(?:\.\d)?)\s*(?:[–-]\s*(\d{1,3}(?:\.\d)?))?\s*mg(?:\s*\/?\s*100\s*g| purine)/i.exec(norm)
  if (!m) return null
  const cmp = m[1]
  const lo = parseFloat(m[2])
  const hi = m[3] ? parseFloat(m[3]) : lo
  const mid = (lo + hi) / 2
  let exp: number
  if (cmp === '>') exp = mid >= 200 ? 3 : jichtBand(mid + 0.01)
  else if (cmp === '<') exp = jichtBand(Math.max(0, mid - 0.01))
  else exp = jichtBand(mid)
  if (category === 'peulvruchten') exp = Math.min(exp, 2) // §2.1 plafond
  if (nameNl.toLowerCase().includes('koffie')) exp = 0 // override §2.1
  return exp
}

// Gate 15: nierstenen — per-100g note-oxalaatwaarde moet bij de §2.3-drempel passen.
// Enkelvoudige vaste categorieën (notes citeren per 100g/100ml). Noten-zaden uitgesloten
// (uitzondering: per 30g-portie). Natrium/calcium-notes en concentratie-qualifiers
// (gedroogd product waarvan de genoteerde waarde de verse precursor is) overgeslagen.
const NIERSTENEN_PER100G = new Set([
  'groente', 'fruit', 'granen', 'peulvruchten', 'vlees', 'vis-schaaldieren', 'eieren', 'zuivel',
])
// §2.3-plafond 1 voor kruiden/specerijen (mespunt-/garneerhoeveelheid) — niet voor sauzen.
const KRUID_SPECERIJ_SUBCATS = new Set([
  'kruiden-specerijen', 'specerijen', 'kruidenmix', 'kruiden-vers', 'kruiden-droog',
])
function oxalaatBand(mg: number): 0 | 1 | 2 | 3 {
  if (mg < 10) return 0
  if (mg <= 25) return 1
  if (mg <= 50) return 2
  return 3
}
/** Verwachte nierstenen-score uit een per-100g-oxalaatwaarde in de note, of null. */
function expectedNierstenenFromNote(note: string): number | null {
  const low = note.toLowerCase()
  // mg-getal slaat op natrium/calcium (modifier/beschermend), niet op oxalaat → niet toetsen.
  if (/natrium|calcium/.test(low)) return null
  // genoteerde waarde is de verse precursor van een gedroogd product → niet representatief.
  if (/concentreert|gedroogd|drogen/.test(low)) return null
  const norm = note.replace(/,(\d)/g, '.$1')
  const m = /(\d{1,4}(?:\.\d)?)\s*(?:[–-]\s*(\d{1,4}(?:\.\d)?))?\s*mg\s*\/?\s*(?:per\s*)?100\s*(?:g|ml)/i.exec(norm)
  if (!m) return null
  const lo = parseFloat(m[1])
  const hi = m[2] ? parseFloat(m[2]) : lo
  return oxalaatBand((lo + hi) / 2)
}

let errors = 0
let totalItems = 0

function fail(msg: string) {
  console.error(`  ✗ ${msg}`)
  errors++
}

const files = readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'))

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(DATA_DIR, file), 'utf-8')) as unknown
  const result = DatabaseFileSchema.safeParse(raw)

  if (!result.success) {
    console.error(`\n${file}:`)
    result.error.errors.forEach((e) => fail(`[${e.path.join('.')}] ${e.message}`))
    continue
  }

  for (const item of result.data.items) {
    totalItems++
    const label = `${file} > ${item.id} (${item.name.nl})`

    // Gate 1+2: schema already validated (Zod)

    // Gate 9: migraine score=3 whitelist check
    if (item.scores.migraine?.score === 3) {
      const nameNl = item.name.nl.toLowerCase()
      const hasWhitelistMatch = [...MIGRAINE_WHITELIST].some((w) => nameNl.includes(w))
      if (!hasWhitelistMatch) {
        fail(`${label}: migraine score=3 maar naam staat niet op whitelist. Controleer CLAUDE.md §2.2.`)
      }
    }

    // Gate 9b (CLAUDE.md §2.2 toelatingscriterium 3): migraine score=3 vereist een
    // populatiebreed of dosis-afhankelijk triggerType — nooit een subgroep-*/individueel-
    // variabel/context-afhankelijk type (die sluiten score 3 per definitie uit).
    if (item.scores.migraine?.score === 3) {
      const tt = item.scores.migraine.triggerType
      if (tt !== 'populatiebreed' && tt !== 'dosis-afhankelijk') {
        fail(`${label}: migraine score=3 vereist triggerType 'populatiebreed' of 'dosis-afhankelijk' (§2.2 criterium 3), niet '${tt ?? 'leeg'}'.`)
      }
    }

    // Gate 9c: note-label semantische consistentie (migraine). Een subgroep-/individueel-
    // variabel/context-afhankelijk triggerType mag geen note hebben die een populatiebreed/
    // universeel effect claimt — anders spreken label en tekst elkaar tegen.
    const SUBGROUP_TT = new Set(['subgroep-bevestigd', 'subgroep-overschat', 'individueel-variabel', 'context-afhankelijk'])
    const STRONG_PHRASES = ['sterke trigger', 'krachtige trigger', 'bij iedereen', 'altijd een trigger', 'veelvoorkomende trigger', 'belangrijke trigger']
    if (item.scores.migraine && SUBGROUP_TT.has(item.scores.migraine.triggerType ?? '')) {
      const note = (item.scores.migraine.note?.nl ?? '').toLowerCase()
      const hit = STRONG_PHRASES.find((ph) => note.includes(ph))
      if (hit) {
        fail(`${label}: migraine triggerType '${item.scores.migraine.triggerType}' (subgroep/variabel) maar note claimt populatiebreed effect ("${hit}"). Note en label zijn tegenstrijdig.`)
      }
    }

    // Gate 12: citrus met histamine-score vereist het 'omstreden'-voorbehoud (§2.4/§12).
    if (/sinaasappel|citroen|grapefruit|mandarijn|limoen|clementine/i.test(item.name.nl) &&
        item.scores.histamine && item.scores.histamine.score >= 1) {
      const note = (item.scores.histamine.note?.nl ?? '').toLowerCase()
      if (!note.includes('omstreden')) {
        fail(`${label}: citrus met histamine-score vereist een 'omstreden'-note (§2.4/§12).`)
      }
    }

    // Gate 13: jicht — note-genoteerde purinewaarde moet bij de §2.1-drempel passen
    // (single-ingredient categorieën). Borgt de DB-brede consistentie zodat scores en
    // hun eigen note-waarde niet kunnen driften.
    if (item.scores.jicht?.note?.nl && SINGLE_INGREDIENT.has(item.category)) {
      const exp = expectedJichtFromNote(item.scores.jicht.note.nl, item.category, item.name.nl)
      if (exp !== null && item.scores.jicht.score !== exp) {
        fail(`${label}: jicht-score ${item.scores.jicht.score} strijdig met de purinewaarde in de note (drempel §2.1 → ${exp}).`)
      }
    }

    // Gate 14: alcohol met histamine-score moet als DAO-blokker geflagd zijn (§2.4).
    if (item.category === 'dranken-alcohol' && item.scores.histamine &&
        !item.histamineFlags?.daoBlocker) {
      fail(`${label}: alcoholische drank met histamine-score vereist histamineFlags.daoBlocker = true (§2.4).`)
    }

    // Gate 15a: nierstenen — per-100g note-oxalaatwaarde moet bij de §2.3-drempel passen
    // (enkelvoudige vaste categorieën; noten-zaden uitgezonderd, zie §2.3). Borgt dat de
    // per-100g-as net zo strak is als de jicht-as (gate 13).
    if (item.scores.nierstenen?.note?.nl && NIERSTENEN_PER100G.has(item.category)) {
      const exp = expectedNierstenenFromNote(item.scores.nierstenen.note.nl)
      if (exp !== null && item.scores.nierstenen.score !== exp) {
        fail(`${label}: nierstenen-score ${item.scores.nierstenen.score} strijdig met de per-100g-oxalaatwaarde in de note (§2.3-drempel → ${exp}).`)
      }
    }

    // Gate 15b: kruiden/specerijen-plafond 1 (§2.3-uitzondering — garneerhoeveelheid).
    if (item.category === 'sauzen-kruiden' && item.subcategory &&
        KRUID_SPECERIJ_SUBCATS.has(item.subcategory) &&
        item.scores.nierstenen && item.scores.nierstenen.score > 1) {
      fail(`${label}: kruid/specerij (subcategorie '${item.subcategory}') mag nierstenen-score max 1 hebben (§2.3-plafond, garneerhoeveelheid).`)
    }

    // Gate 10: score=3 vereist evidence >= B
    for (const [condition, s] of Object.entries(item.scores)) {
      if (!s) continue
      if (s.score === 3 && s.evidence === 'C') {
        fail(`${label} [${condition}]: score=3 vereist evidence A of B, niet C.`)
      }
    }

    // Gate 11: evidence A alleen bij database of meta-analyse bronnen
    for (const [condition, s] of Object.entries(item.scores)) {
      if (!s || s.evidence !== 'A') continue
      const hasAuthoritativeSource = s.sources.some((src) => EVIDENCE_A_SOURCE_TYPES.has(src.type))
      if (!hasAuthoritativeSource) {
        fail(`${label} [${condition}]: evidence=A vereist minstens één bron van type 'database' of 'meta-analysis' (CLAUDE.md §4.4).`)
      }
    }

    // Regression test: koffie jicht <= 1
    if (item.name.nl.toLowerCase().includes('koffie')) {
      const jicht = item.scores.jicht
      if (jicht && jicht.score > 1) {
        fail(`${label}: REGRESSIE — koffie mag bij jicht maximaal score 1 hebben (zie CLAUDE.md §2.1).`)
      }
    }

    // Regression test: chocolade migraine != 3
    if (item.name.nl.toLowerCase().includes('chocolade')) {
      if (item.scores.migraine?.score === 3) {
        fail(`${label}: REGRESSIE — chocolade mag bij migraine niet score 3 hebben (zie CLAUDE.md §2.2).`)
      }
    }

    // Regression test (CLAUDE.md §2.2 v2.0): gedistilleerd & versterkte wijn migraine != 3.
    // Cluster 12 = sterke alcohol (bier + gedistilleerd). Bier is de enige alcohol op de
    // score-3-whitelist; gedistilleerd (whisky/gin/wodka/rum/e.d.) is score 2 + subgroep-overschat.
    if (item.category === 'dranken-alcohol' && item.cluster === 12) {
      const isBier = item.name.nl.toLowerCase().includes('bier')
      if (!isBier && item.scores.migraine?.score === 3) {
        fail(`${label}: REGRESSIE — gedistilleerd/versterkte wijn mag bij migraine niet score 3 hebben; alleen bier staat op de alcohol-whitelist (zie CLAUDE.md §2.2 v2.0).`)
      }
    }

    // Regression test: calcium-rijk zuivel (melk, kaas, edammer, yoghurt) nierstenen <= 1
    // Exclusions: pindakaas (noot, geen zuivel)
    const calciumRijkZuivel = ['melk', 'edammer', 'yoghurt']
    const nameNlLower = item.name.nl.toLowerCase()
    const plantExclusions = ['amandelmelk', 'havermelk', 'sojamelk', 'kokosmelk', 'rijstmelk', 'pindakaas']
    const isPlantBased = plantExclusions.some((e) => nameNlLower.includes(e))
    const kaasMatch = nameNlLower.includes('kaas') && !isPlantBased
    const melkMatch = !isPlantBased && calciumRijkZuivel.some((w) => nameNlLower.includes(w))
    if (melkMatch || kaasMatch) {
      if (item.scores.nierstenen?.score !== undefined && item.scores.nierstenen.score > 1) {
        fail(`${label}: REGRESSIE — calcium-rijke items mogen nierstenen score max 1 hebben (Borghi RCT, CLAUDE.md §4.2 gate 8).`)
      }
    }

    // ID check
    if (!/^(\d+|nl-[a-z0-9-]+)$/.test(item.id)) {
      fail(`${label}: ongeldig ID formaat`)
    }
  }
}

console.log(`\n━━━ Database validatie ━━━`)
console.log(`Bestanden: ${files.length} · Items: ${totalItems}`)
console.log(`Fouten: ${errors}`)

if (errors > 0) {
  console.error(`\n✗ Validatie MISLUKT (${errors} fout${errors !== 1 ? 'en' : ''})`)
  process.exit(1)
} else {
  console.log(`\n✓ Validatie geslaagd`)
}
