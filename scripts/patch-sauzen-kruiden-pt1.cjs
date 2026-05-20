/**
 * Hindiyeh-purge sauzen-kruiden PT1 — sauzen, azijn, olie, smaakversterkers
 *
 * 22 items: Hindiyeh 2020 sole-source vervangen door betere bronnen.
 * Score-wijzigingen:
 *   1→0: azijn-rode-wijn, sambal, chilisaus, azijn-wit, ketchup, tomatensaus (geen specifieke evidence)
 *   2→1: balsamico-azijn (gefermenteerd maar laag biogene aminen in azijn)
 *   overig: score ongewijzigd, bronnen verbeterd + triggerType toegevoegd
 *
 * Signalering: nl-worcestershire (score 1) en nl-worcestershiresaus (score 2)
 * zijn mogelijk een duplicaat — aparte follow-up vereist.
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'data', 'sauzen-kruiden.json')

const ACCESSED = '2026-05-20'

// Bronnen
const HINDIYEH = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/',
  title: 'Hindiyeh et al. 2020 — Diet and Headache (Curr Pain Headache Rep)',
  type: 'review',
  accessedAt: ACCESSED,
}
const MAINTZ = {
  url: 'https://pubmed.ncbi.nlm.nih.gov/17490952/',
  title: 'Maintz & Novak 2007 — Histamine and histamine intolerance (Am J Clin Nutr)',
  type: 'review',
  accessedAt: ACCESSED,
}
const FINBERG = {
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9172554/',
  title: 'Finberg & Gillman 2022 — Dietary Tyramine and MAO Inhibitors (J Clin Pharmacol)',
  type: 'review',
  accessedAt: ACCESSED,
}

/**
 * Definitie per item:
 *   score: nieuw score (null = ongewijzigd)
 *   sources: volledige nieuwe sources-array
 *   triggerType: string of null (verwijderen)
 *   confidence: string of null
 *   primaryModulators: array of null
 *   note: string (nl) of null (verwijderen)
 */
const PATCHES = {
  // ── OLIE / VET ──────────────────────────────────────────────────
  'nl-olijfolie': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Olijfolie bevat geen biogene aminen of bekende migraine-triggerstoffen.',
  },
  'nl-sunflower-olie': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Zonnebloemolie bevat geen biogene aminen of bekende migraine-triggerstoffen.',
  },
  'nl-arachideolie': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Arachideolie bevat geen biogene aminen of bekende migraine-triggerstoffen.',
  },

  // ── AZIJN ────────────────────────────────────────────────────────
  'nl-azijn-rode-wijn': {
    score: 0,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Rode wijnazijn: alcohol volledig omgezet in azijnzuur; biogene aminen verwaarloosbaar laag. Geen specifieke migraine-evidence.',
  },
  'nl-appelciderazijn': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Appelciderazijn bevat geen significante biogene aminen. Geen specifieke migraine-trigger-evidence.',
  },
  'nl-azijn-wit': {
    score: 0,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Witte azijn (azijnzuur): geen biogene aminen of bekende migraine-triggermechanisme. Eerder score 1 op basis van Hindiyeh sole-source.',
  },
  'nl-balsamico-azijn': {
    score: 1,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'laag',
    primaryModulators: ['biogene-aminen'],
    note: 'Balsamicoazijn: langdurig gerijpt maar biogene aminen in azijn zijn verwaarloosbaar laag na fermentatie. Score 1 (voorzichtigheidshalve) voor langdurig gebruik bij gevoelige personen. Geen harde trigger-evidence.',
  },

  // ── SMAAKVERSTERKERS ─────────────────────────────────────────────
  'nl-zout': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Keukenzout bevat geen biogene aminen of bekende migraine-triggerstoffen.',
  },

  // ── SAUZEN ───────────────────────────────────────────────────────
  'nl-sojasaus': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'middel',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Sojasaus: hoge biogene aminen (tyramine, histamine) door fermentatie. Trigger bij MAO-A-gevoelige personen; score 2 op basis van biogene-amine-pathway (Maintz 2007).',
  },
  'nl-ketchup': {
    score: 0,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Ketchup (tomatenbasis): tomaat is histamine-liberator maar gerandomiseerd bewijs voor ketchup als migrainetrigger ontbreekt. Eerder score 1 op basis van Hindiyeh sole-source; bijgewerkt naar score 0.',
  },
  'nl-mayonaise': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Mayonaise bevat geen significante biogene aminen. Geen specifieke migraine-trigger-evidence.',
  },
  'nl-mosterd': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Mosterd bevat geen bekende migraine-triggerstoffen in gebruikelijke hoeveelheden.',
  },
  'nl-tomatensaus': {
    score: 0,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Tomatensaus: tomaat is histamine-liberator maar migraine-specifiek bewijs ontbreekt (Hindiyeh 2020, Finberg 2022). Eerder score 1; bijgewerkt naar score 0.',
  },
  'nl-pesto': {
    score: null,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Pesto (basilicum, olie, kaas, pijnboompitten): geen specifieke migraine-trigger-evidence voor pesto als geheel.',
  },
  'nl-sambal': {
    score: 0,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Sambal (capsaïcine): geen bewezen migraine-trigger; capsaïcine soms therapeutisch gebruikt. Eerder score 1 op basis van Hindiyeh sole-source.',
  },
  'nl-ketjap-manis': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'middel',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Ketjap manis: gefermenteerde sojasausbasis met biogene aminen; gezoet met palmsuiker vermindert concentratie maar fermentatie-pathway blijft. Trigger bij MAO-A-gevoelige personen.',
  },
  'nl-worcestershire': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'laag',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Worcestershiresaus: ansjovis (gefermenteerd) + tamarinde + malt = matige biogene aminen. Mogelijke trigger bij gevoelige personen. Signalering: mogelijk duplicaat van nl-worcestershiresaus — aparte follow-up.',
  },
  'nl-chilisaus': {
    score: 0,
    sources: [FINBERG, HINDIYEH],
    triggerType: null,
    confidence: null,
    primaryModulators: null,
    note: 'Zoete chilisaus: capsaïcine zonder bewezen migraine-triggermechanisme. Eerder score 1 op basis van Hindiyeh sole-source.',
  },
  'nl-tahoe-marinade': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'middel',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Lichte sojasaus (tahoe-marinade basis): gefermenteerd soja-product met biogene aminen (tyramine). Vergelijkbaar met sojasaus.',
  },
  'nl-worcestershiresaus': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'middel',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Worcestershiresaus: ansjovis (gefermenteerd/gerijpt, hoog tyramine) + gefermenteerde ingrediënten. Score 2 defensible op basis van biogene-amine-pathway. Signalering: mogelijk duplicaat van nl-worcestershire.',
  },
  'nl-hoisinsaus': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'middel',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Hoisinsaus: gefermenteerde sojabonenpasta met biogene aminen (tyramine). Score 2 op basis van fermentatie-pathway; geen toegevoegd MSG aangetoond.',
  },
  'nl-oesterketsap': {
    score: null,
    sources: [MAINTZ, HINDIYEH],
    triggerType: 'subgroep-bevestigd',
    confidence: 'laag',
    primaryModulators: ['tyramine', 'biogene-aminen'],
    note: 'Oestersaus: gefermenteerd oesterextract met matige biogene aminen. Mogelijke trigger bij gevoelige personen.',
  },
}

// ── Apply patches ────────────────────────────────────────────────────
const raw = fs.readFileSync(FILE, 'utf8')
const db = JSON.parse(raw)

let scoreChanges = 0
let sourceUpgrades = 0
let triggerAdded = 0
const scoreFixes = []

for (const item of db.items) {
  const patch = PATCHES[item.id]
  if (!patch) continue

  const m = item.scores.migraine
  if (!m) {
    console.error(`SKIP ${item.id}: geen migraine-score`)
    continue
  }

  const oldScore = m.score

  // Score
  if (patch.score !== null && patch.score !== m.score) {
    scoreFixes.push({ id: item.id, name: item.name.nl, scoreBefore: m.score, scoreAfter: patch.score })
    m.score = patch.score
    scoreChanges++
  }

  // Sources
  m.sources = patch.sources
  sourceUpgrades++

  // TriggerType
  if (patch.triggerType !== null) {
    m.triggerType = patch.triggerType
    triggerAdded++
  } else {
    delete m.triggerType
  }

  // Confidence
  if (patch.confidence !== null) {
    m.confidence = patch.confidence
  } else {
    delete m.confidence
  }

  // PrimaryModulators
  if (patch.primaryModulators !== null) {
    m.primaryModulators = patch.primaryModulators
  } else {
    delete m.primaryModulators
  }

  // Note
  if (patch.note !== null) {
    m.note = { nl: patch.note }
  } else {
    delete m.note
  }

  // Meta
  item.meta.lastReviewed = ACCESSED

  console.log(`✓ ${item.id} (score: ${oldScore}→${m.score}, triggerType: ${m.triggerType||'-'})`)
}

console.log(`\nScore-wijzigingen: ${scoreChanges}`)
console.log(`Source-upgrades: ${sourceUpgrades}`)
console.log(`TriggerType toegevoegd: ${triggerAdded}`)

if (scoreChanges > 0) {
  console.log('\nScore fixes:')
  scoreFixes.forEach(f => console.log(`  ${f.id}: ${f.scoreBefore} → ${f.scoreAfter}`))
}

if (sourceUpgrades !== Object.keys(PATCHES).length) {
  console.error(`FOUT: verwacht ${Object.keys(PATCHES).length} source-upgrades, uitgevoerd ${sourceUpgrades}`)
  process.exit(1)
}

fs.writeFileSync(FILE, JSON.stringify(db, null, 2), 'utf8')
console.log(`\nGeschreven: ${FILE}`)
