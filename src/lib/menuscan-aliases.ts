// Alias-tabel voor de menuscan-matcher (CLAUDE.md §-menuscan-herontwerp §10.2).
//
// Mapt een restaurant-/menukaartterm (zoals de AI hem uit een foto haalt) naar de
// canonieke NAAM van een item in de gevalideerde database. De matcher (menuscan-match.ts)
// resolvet die naam vervolgens naar het echte FoodItem.
//
// Waarom naam i.p.v. id: leesbaar te onderhouden zonder ids op te zoeken, en robuust als
// een id ooit verandert. Alleen termen die NIET al via exacte-/basisnaam- of token-match
// gevonden worden horen hier (bv. "parmezaanse kaas" ≠ "Parmezaan"). De tabel begint klein
// en groeit op echte scans — geen poging tot volledigheid.
//
// Sleutels moeten al genormaliseerd zijn (lowercase, zonder diacrieten/leestekens), net als
// wat `normalize()` produceert.

export const INGREDIENT_ALIASES: Record<string, string> = {
  'parmezaanse kaas': 'Parmezaan',
  'parmezaanse': 'Parmezaan',
  'rundvlees': 'Runderbiefstuk (mager)',
  'rund': 'Runderbiefstuk (mager)',
  'carpaccio': 'Runderbiefstuk (mager)',
  'pittenmix': 'Pijnboompitten',
  'pitten': 'Pijnboompitten',
  'rode ui': 'Ui',
  'gerookte kaas': 'Goudse kaas (belegen)',
  'chilisaus': 'Zoete chilisaus',
  'jalapeno peper': 'Chilipeper (vers)',
  'jalapeno': 'Chilipeper (vers)',
}

// REPRESENTATIEVE aliassen: een generieke term → een representatief DB-item. Dit is een
// BENADERING (de echte "kaas"/"brood" kan een ander type zijn met een afwijkende score),
// dus de UI markeert deze matches expliciet als "≈ representatief". Houd hier alleen
// generalisaties; precieze naamvarianten horen in INGREDIENT_ALIASES.
export const REPRESENTATIVE_ALIASES: Record<string, string> = {
  'kaas': 'Goudse kaas (jong)',
  'brood': 'Wit brood',
  'toast': 'Wit brood',
  'nachos': 'Maistortilla',
  'nacho': 'Maistortilla',
  'truffelmayonaise': 'Mayonaise',
}
