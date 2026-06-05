import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import { METHODOLOGY_VERSION } from '@/lib/version'

// Bewaakt dat de in de UI getoonde methodologie-versie (footer op de Meer-pagina)
// gelijk blijft aan de autoriteit CLAUDE.md §15 ("Schema version: vX.Y"). Faalt (CI rood)
// zodra een van beide wordt opgehoogd zonder de ander — zo kan de getoonde versie niet
// stilletjes verouderen.
describe('methodologie-versie synchroon met CLAUDE.md', () => {
  it('METHODOLOGY_VERSION komt overeen met CLAUDE.md §15 Schema version', () => {
    const claude = readFileSync(join(process.cwd(), 'CLAUDE.md'), 'utf-8')
    const m = /Schema version:\*\*\s*v?(\d+\.\d+)/i.exec(claude)
    expect(m, 'CLAUDE.md §15 "Schema version: vX.Y" niet gevonden').not.toBeNull()
    expect(m![1]).toBe(METHODOLOGY_VERSION)
  })
})
