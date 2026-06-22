import { describe, it, expect } from 'vitest'
import { matchIngredient, normalize } from '@/lib/menuscan-match'

describe('normalize', () => {
  it('verwijdert hoofdletters, diacrieten en leestekens', () => {
    expect(normalize('Crème fraîche!')).toBe('creme fraiche')
    expect(normalize('  Gerookte   ZALM  ')).toBe('gerookte zalm')
    expect(normalize('Jalapeño peper')).toBe('jalapeno peper')
  })
})

describe('matchIngredient', () => {
  it('exacte naam', () => {
    const m = matchIngredient('Rucola')
    expect(m?.item.id).toBe('169967')
    expect(m?.method).toBe('exact')
  })

  it('exacte basisnaam (parenthese-kwalificatie genegeerd)', () => {
    // "Kappertjes (ingelegd)" → basisnaam "kappertjes"
    const m = matchIngredient('kappertjes')
    expect(m?.item.id).toBe('nl-kappertjes')
    expect(m?.method).toBe('exact')
  })

  it('alias: "parmezaanse kaas" → Parmezaan', () => {
    const m = matchIngredient('parmezaanse kaas')
    expect(m?.item.id).toBe('nl-parmezaan')
    expect(m?.method).toBe('alias')
  })

  it('alias: "rundvlees" → Runderbiefstuk', () => {
    const m = matchIngredient('rundvlees')
    expect(m?.item.id).toBe('174033')
    expect(m?.method).toBe('alias')
  })

  it('token over basisnaam: "gerookte runderbiefstuk" → Runderbiefstuk', () => {
    const m = matchIngredient('gerookte runderbiefstuk')
    expect(m?.item.id).toBe('174033')
    expect(m?.method).toBe('token')
  })

  it('token over alias-sleutel: "gerookt rundvlees" → Runderbiefstuk', () => {
    const m = matchIngredient('gerookt rundvlees')
    expect(m?.item.id).toBe('174033')
    expect(m?.method).toBe('alias')
  })

  it('exacte basisnaam met bijvoeglijk woord ervoor matcht niet per ongeluk te breed', () => {
    const m = matchIngredient('Gerookte zalm')
    expect(m?.item.id).toBe('nl-gerookte-zalm')
  })

  it('sluit bereid-gerecht uit als ingrediënt-match', () => {
    // "Goulash (rundvlees)" is een heel gerecht, geen ingrediënt
    expect(matchIngredient('goulash')).toBeNull()
  })

  it('geen ruis op te korte tokens', () => {
    // "ui" (2 tekens) mag niet als substring in willekeurige woorden matchen
    expect(matchIngredient('bruine bonen')?.item.name.nl).not.toBe('Ui')
  })

  it('meervoud/enkelvoud: enkelvoud matcht een meervoudig DB-item', () => {
    // DB-item heet "Champignons"; de menukaart zegt vaak "champignon"
    const m = matchIngredient('champignon')
    expect(m?.item.name.nl).toBe('Champignons')
    expect(m?.method).toBe('exact')
    expect(m?.approximate).toBe(false)
  })

  it('representatieve alias is een benadering (approximate)', () => {
    const m = matchIngredient('kaas')
    expect(m?.item.name.nl).toBe('Goudse kaas (jong)')
    expect(m?.method).toBe('representatief')
    expect(m?.approximate).toBe(true)
  })

  it('precieze alias is géén benadering', () => {
    expect(matchIngredient('parmezaanse kaas')?.approximate).toBe(false)
    expect(matchIngredient('rucola')?.approximate).toBe(false)
  })

  it('onbekend ingrediënt → null', () => {
    expect(matchIngredient('volstrekt onbekend xyzzy')).toBeNull()
    expect(matchIngredient('')).toBeNull()
  })

  it('"/"-naam: beide losse synoniemen matchen hetzelfde DB-item', () => {
    // DB-item "Lente-ui / bosui" bundelt twee namen in één entry.
    const a = matchIngredient('lente-ui')
    const b = matchIngredient('bosui')
    expect(a?.item.name.nl).toBe('Lente-ui / bosui')
    expect(b?.item.id).toBe(a?.item.id)
    expect(a?.method).toBe('exact')
    expect(a?.approximate).toBe(false)
  })

  it('"/"-naam: tweede synoniem van een ander item ("brandy" → Cognac / Brandy)', () => {
    expect(matchIngredient('brandy')?.item.name.nl).toBe('Cognac / Brandy')
    expect(matchIngredient('bataat')?.item.name.nl).toBe('Zoete aardappel / bataat')
  })

  it('"/" binnen haakjes wordt NIET als synoniem gesplitst', () => {
    // "Edamame bonen (vers/bevroren)" — "bevroren" mag geen losse sleutel worden.
    expect(matchIngredient('bevroren')).toBeNull()
  })

  it('precieze alias wint van een bredere token-match ("gedroogde vijg" → gedroogd, niet vers)', () => {
    const m = matchIngredient('gedroogde vijg')
    expect(m?.item.name.nl).toBe('Vijg (gedroogd)')
    expect(m?.method).toBe('alias')
  })
})
