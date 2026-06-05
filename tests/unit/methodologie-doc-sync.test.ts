import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Bewaakt dat de hardgecodeerde cijfers in docs/migraine-methodologie.md synchroon
// blijven met de werkelijke database. De doc houdt leesbare getallen; deze test faalt
// (CI rood) zodra een datawijziging ze laat driften — zo kan de methodologie-doc niet
// stilletjes achterlopen, zoals eerder gebeurde met de score-3-lijst (v2.0/v2.4).

const DATA_DIR = join(process.cwd(), 'src/data')
const DOC = join(process.cwd(), 'docs/migraine-methodologie.md')

type Item = { scores: { migraine: { score: number; triggerType?: string } | null } }

function loadItems(): Item[] {
  return readdirSync(DATA_DIR)
    .filter((f) => f.endsWith('.json'))
    .flatMap((f) => JSON.parse(readFileSync(join(DATA_DIR, f), 'utf-8')).items as Item[])
}

describe('docs/migraine-methodologie.md — cijfers synchroon met DB', () => {
  const items = loadItems()
  const doc = readFileSync(DOC, 'utf-8')

  const total = items.length
  const dist = { 0: 0, 1: 0, 2: 0, 3: 0 }
  for (const i of items) {
    const m = i.scores.migraine
    if (m && m.score in dist) dist[m.score as 0 | 1 | 2 | 3]++
  }
  it('score-verdelingstabel komt overeen met de DB', () => {
    // Parse rijen van de vorm "| <score> | <aantal> |" en vergelijk met de DB.
    for (const score of [0, 1, 2, 3] as const) {
      const row = new RegExp(`\\|\\s*${score}\\s*\\|\\s*(\\d+)\\s*\\|`).exec(doc)
      expect(row, `tabelrij voor score ${score} ontbreekt`).not.toBeNull()
      expect(Number(row![1]), `score ${score} telling`).toBe(dist[score])
    }
  })

  it('het totale aantal items wordt correct genoemd', () => {
    expect(doc, `doc moet het actuele itemtotaal (${total}) noemen`).toContain(String(total))
  })

  it('vermeldt geen verouderd itemtotaal of score-3-aantal', () => {
    // Negatieve guard: vang de oude waarden die eerder dreven (700 items, 10 score-3).
    // 'cap is 700' mag wél — alleen een onjuist *actueel* totaal niet.
    expect(doc).not.toMatch(/bevat 700 voedingsmiddelen/)
    expect(doc).not.toMatch(/tien.{0,30}migraine-score 3/)
  })
})
