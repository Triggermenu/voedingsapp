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

  it('onbekend ingrediënt → null', () => {
    expect(matchIngredient('volstrekt onbekend xyzzy')).toBeNull()
    expect(matchIngredient('')).toBeNull()
  })
})
