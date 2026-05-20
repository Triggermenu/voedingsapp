/**
 * backfill-cluster.cjs
 *
 * Voegt `cluster: <nr>` toe aan items waarvan de cluster-toewijzing
 * eenduidig herleidbaar is uit docs/migraine-cluster-*-items.md.
 *
 * Regels:
 *  - Items die al een cluster-veld hebben: NOOIT overschrijven.
 *  - Items in de mapping zonder bestaand veld: cluster toevoegen.
 *  - Items niet in de mapping: ongewijzigd (geen cluster: 0 placeholder).
 *  - Conflict in mapping (item in 2 clusters): overgeslagen (moet al cluster hebben).
 */

const fs = require('fs')
const path = require('path')

const MAPPING_FILE = path.join(__dirname, 'cluster-mapping.json')
const DATA_DIR = path.join(__dirname, '..', 'src', 'data')

const { mapping, conflicts } = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'))

// Build flat id→cluster lookup, excluding conflicted IDs
const conflictIds = new Set(conflicts.map(c => c.id))
const lookup = {}
for (const [clusterNr, ids] of Object.entries(mapping)) {
  for (const id of ids) {
    if (!conflictIds.has(id)) {
      lookup[id] = Number(clusterNr)
    }
  }
}

console.log(`Mapping: ${Object.keys(lookup).length} items (excl. ${conflictIds.size} conflicten)`)
console.log(`Conflicten overgeslagen: ${[...conflictIds].join(', ')}`)

let added = 0
let kept = 0
let skipped = 0
let conflictCheck = 0

const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'))

for (const file of dataFiles) {
  const filePath = path.join(DATA_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf8')
  const db = JSON.parse(raw)
  let changed = false

  for (const item of db.items) {
    const mappedCluster = lookup[item.id]

    if (item.cluster !== undefined) {
      // Already has cluster field
      if (mappedCluster !== undefined && item.cluster !== mappedCluster) {
        console.error(`CONFLICT: ${item.id} heeft cluster:${item.cluster} maar mapping zegt ${mappedCluster} — STOP`)
        process.exit(1)
      }
      kept++
    } else if (mappedCluster !== undefined) {
      // Add cluster field
      item.cluster = mappedCluster
      added++
      changed = true
      console.log(`  + ${item.id} → cluster ${mappedCluster} (${file})`)
    } else {
      skipped++
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8')
  }
}

console.log(`\nResultaat:`)
console.log(`  Toegevoegd:         ${added}`)
console.log(`  Al aanwezig (kept): ${kept}`)
console.log(`  Geen mapping:       ${skipped}`)
console.log(`  Totaal items:       ${added + kept + skipped}`)
