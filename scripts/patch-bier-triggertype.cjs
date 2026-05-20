/**
 * Stap 2 — Bier triggerType paradigma-fix
 *
 * Probleem: 7 bier-items hebben score=3 + triggerType="subgroep-overschat".
 * Logisch incoherent: score 3 (populatiebreed effect) + subgroep-overschat (effect overschat)
 * zijn tegenstrijdig. Ethanol heeft een direct farmacologisch mechanisme op populatieniveau.
 *
 * Fix: triggerType → "universeel", confidence → "hoog", note ethanol-mechanisme-framing.
 * Score 3 en bronnen ongewijzigd. Cluster: 12 toegevoegd aan elk item.
 *
 * Rode wijn (clusters 10/11) behoudt "subgroep-overschat" — tyramine/histamine pathway
 * is subgroep-gevoelig (MAO-A drempel). Bewust onderscheid bier ↔ rode wijn.
 */

const fs = require('fs')
const path = require('path')

const FILE = path.join(__dirname, '..', 'src', 'data', 'dranken-alcohol.json')

const BIER_IDS = [
  '168746',
  'nl-bier-stout',
  'nl-bier-ipa',
  'nl-bier-weizen',
  'nl-bier-trappist',
  'nl-bier-pilsener',
  'nl-lambiek',
]

const ETHANOL_NOTE = 'Ethanol-mechanisme: vasodilatatie, CGRP-release, mestcel-degranulatie. ' +
  'Bier versterkt door histamine/biogene aminen bij gisting. ' +
  'Populatiebreed effect bij adequate dosis (Onderwater 2019).'

const ITEM_NOTES = {
  '168746':         ETHANOL_NOTE,
  'nl-bier-stout':  ETHANOL_NOTE,
  'nl-bier-ipa':    ETHANOL_NOTE,
  'nl-bier-weizen': ETHANOL_NOTE,
  'nl-bier-trappist':
    'Ethanol-mechanisme (vasodilatatie, CGRP-release, mestcel-degranulatie). ' +
    'Trappistenbier: hoog alcoholpercentage (6-12%) versterkt effect. ' +
    'Biogene aminen secundair. Populatiebreed bij adequate dosis (Onderwater 2019).',
  'nl-bier-pilsener': ETHANOL_NOTE,
  'nl-lambiek':
    'Ethanol-mechanisme (vasodilatatie, CGRP-release, mestcel-degranulatie). ' +
    'Lambiek/Geuze: spontane gisting verhoogt biogene aminen (tyramine, histamine) — ' +
    'dubbele trigger-pathway. Populatiebreed bij adequate dosis (Onderwater 2019).',
}

const raw = fs.readFileSync(FILE, 'utf8')
const db = JSON.parse(raw)

let changed = 0

for (const item of db.items) {
  if (!BIER_IDS.includes(item.id)) continue

  const m = item.scores.migraine
  if (!m) {
    console.error(`SKIP ${item.id}: geen migraine-score`)
    continue
  }

  const prevTriggerType = m.triggerType
  const prevConfidence  = m.confidence
  const prevNote        = m.note?.nl

  m.triggerType = 'universeel'
  m.confidence  = 'hoog'
  m.note        = { nl: ITEM_NOTES[item.id] }

  // cluster-veld op item-niveau
  item.cluster = 12

  console.log(`✓ ${item.id}`)
  console.log(`  triggerType: ${prevTriggerType} → universeel`)
  console.log(`  confidence:  ${prevConfidence}  → hoog`)
  console.log(`  note: "${prevNote?.substring(0, 60)}..." → ethanol-mechanisme`)

  changed++
}

console.log(`\nGewijzigd: ${changed} van ${BIER_IDS.length} items`)

if (changed !== BIER_IDS.length) {
  console.error(`FOUT: niet alle bier-items gevonden!`)
  process.exit(1)
}

fs.writeFileSync(FILE, JSON.stringify(db, null, 2), 'utf8')
console.log(`\nGeschreven: ${FILE}`)
