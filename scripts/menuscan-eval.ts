// Menuscan-evaluatieharness (reproduceerbaar).
//
// Draait de ECHTE menuscan-pijplijn (matchIngredient + assessDish uit src/lib) op een set
// vastgelegde menukaarten in scripts/menuscan-menus/*.json en schrijft een deterministisch
// rapport naar docs/menuscan-eval-report.md (+ console). Geen timestamps/randomness → twee
// runs op dezelfde data/code geven byte-identiek resultaat (diffbaar in git).
//
// Doel: de dekking van de DB-matching meten over echte kaarten, onbekende ingrediënten
// blootleggen (= alias-kandidaten) en near-misses zichtbaar maken — zonder de app te raken.
//
//   npm run menuscan:eval
//
// De fixtures zijn met de hand uit echte online menukaarten geëxtraheerd (de "vision"-stap
// die normaal de AI doet); de bron-URL staat in elk JSON-bestand.

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { assessDish } from '@/lib/menuscan-aggregate'
import { getAllItems } from '@/lib/db'
import type { Condition } from '@/schemas/item'

const HERE = dirname(fileURLToPath(import.meta.url))
const MENUS_DIR = join(HERE, 'menuscan-menus')
const OUT_FILE = join(HERE, '..', 'docs', 'menuscan-eval-report.md')

// Eval draait op alle vier de assen zodat de volledige DB-dekking zichtbaar wordt.
// (In de app is dit profiel-gescoped naar de actieve aandoeningen.)
const CONDITIONS: Condition[] = ['jicht', 'migraine', 'nierstenen', 'histamine']
const KLEUR = ['groen(0)', 'geel(1)', 'oranje(2)', 'ROOD(3)']
const kleur = (s: number | null) => (s === null ? '—' : KLEUR[s])

interface Menu {
  source: string
  url: string
  note?: string
  dishes: Array<{ dish: string; ingredients: string[] }>
}

function loadMenus(): Array<{ file: string; menu: Menu }> {
  return readdirSync(MENUS_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((file) => ({ file, menu: JSON.parse(readFileSync(join(MENUS_DIR, file), 'utf8')) as Menu }))
}

const out: string[] = []
const log = (s = '') => out.push(s)

// Globale tellers over alle kaarten.
let totalIng = 0
let matchedIng = 0
const methodCount: Record<string, number> = {}
const unknownCount = new Map<string, number>()
const approxMap = new Map<string, string>() // ruwe term → DB-item (representatieve/benaderende match)

log('# Menuscan — evaluatierapport')
log('')
log('> **Gegenereerd door `npm run menuscan:eval`** uit `scripts/menuscan-menus/*.json`.')
log('> Deterministisch (geen timestamps): zelfde data + code → identiek rapport. Niet met de hand bewerken.')
log('>')
log(`> Database: ${getAllItems().length} items · assen: ${CONDITIONS.join(', ')} (in de app profiel-gescoped).`)
log('')

const menus = loadMenus()

for (const { menu } of menus) {
  log(`## ${menu.source}`)
  log('')
  log(`Bron: <${menu.url}>`)
  log('')

  let menuTotal = 0
  let menuMatched = 0

  for (const { dish, ingredients } of menu.dishes) {
    const a = assessDish(ingredients, CONDITIONS)
    menuTotal += a.totalCount
    menuMatched += a.matchedCount

    const pct = Math.round(a.coverage * 100)
    log(`### ${dish}`)
    log(`*Dekking ${a.matchedCount}/${a.totalCount} (${pct}%) — gerecht-totaal: ${a.showDishTotal ? 'getoond' : 'NIET getoond (te onzeker → vraag de ober)'}*`)
    log('')
    for (const ing of a.ingredients) {
      totalIng++
      if (ing.match) {
        matchedIng++
        const m = ing.match
        methodCount[m.method] = (methodCount[m.method] ?? 0) + 1
        if (m.approximate) approxMap.set(ing.raw, m.item.name.nl)
        log(`- \`${ing.raw}\` → **${m.item.name.nl}** _(${m.method}${m.approximate ? ', benadering ≈' : ''})_`)
      } else {
        unknownCount.set(ing.raw, (unknownCount.get(ing.raw) ?? 0) + 1)
        log(`- \`${ing.raw}\` → ❓ **onbekend** — vraag de ober`)
      }
    }
    log('')
    const scores = a.perCondition
      .map((pc) => `${pc.condition}: ${kleur(pc.score)}${pc.drivingIngredient ? ` ←${pc.drivingIngredient}` : ''}`)
      .join(' · ')
    log(`Scores → ${scores}`)
    log('')
  }

  totalIng += 0 // (al per ingrediënt geteld)
  const menuPct = menuTotal === 0 ? 0 : Math.round((menuMatched / menuTotal) * 100)
  log(`**Kaart-dekking: ${menuMatched}/${menuTotal} (${menuPct}%)**`)
  log('')
}

// ── Samenvatting ────────────────────────────────────────────────────────────
const overall = totalIng === 0 ? 0 : Math.round((matchedIng / totalIng) * 100)
log('## Samenvatting')
log('')
log(`- **Totale dekking: ${matchedIng}/${totalIng} (${overall}%)** over ${menus.length} kaarten.`)
log(`- Match-methodes: ${Object.entries(methodCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}`)
log('')

log('### Onbekende ingrediënten (alias-kandidaten, frequentie)')
log('')
const unknowns = [...unknownCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
if (unknowns.length === 0) log('_Geen — alle ingrediënten gematcht._')
else for (const [raw, n] of unknowns) log(`- \`${raw}\` ×${n}`)
log('')

log('### Benaderende (representatieve) matches — ter review')
log('')
const approx = [...approxMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
if (approx.length === 0) log('_Geen._')
else for (const [raw, target] of approx) log(`- \`${raw}\` ≈ ${target}`)
log('')

const report = out.join('\n')
mkdirSync(dirname(OUT_FILE), { recursive: true })
writeFileSync(OUT_FILE, report, 'utf8')

// Console: compacte samenvatting (het volledige rapport staat in het .md-bestand).
console.log(`menuscan-eval: ${menus.length} kaarten, dekking ${matchedIng}/${totalIng} (${overall}%)`)
console.log(`methodes: ${Object.entries(methodCount).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}`)
console.log(`onbekend (${unknowns.length}): ${unknowns.map(([r, n]) => `${r}×${n}`).join(', ') || '—'}`)
console.log(`benaderend (${approx.length}): ${approx.map(([r, t]) => `${r}≈${t}`).join(', ') || '—'}`)
console.log(`rapport → ${OUT_FILE}`)
