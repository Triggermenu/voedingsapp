import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'
import { DatabaseFileSchema } from '../src/schemas/item'

const DATA_DIR = join(process.cwd(), 'src/data')
const MIGRAINE_WHITELIST = new Set(['rode wijn', 'bier', 'alcohol', 'msg', 'spek', 'bacon', 'gerijpte', 'gecureerd', 'oude kaas'])

// Gate 11: evidence A toegestaan bij database, meta-analyse, of evidence-based guideline (AUA, EULAR, ACR)
const EVIDENCE_A_SOURCE_TYPES = new Set(['database', 'meta-analysis', 'guideline'])

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
