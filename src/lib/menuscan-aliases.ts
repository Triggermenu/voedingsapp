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

  // Toegevoegd na eval over echte kaarten (npm run menuscan:eval) — exacte mappings naar
  // een bestaand DB-item; geen benadering.
  // (lente-ui/bosui/bataat zaten hier ook, maar worden nu structureel afgevangen: de matcher
  // splitst "/"-namen zoals "Lente-ui / bosui" en "Zoete aardappel / bataat" in losse termen.)
  'sushi rijst': 'Witte rijst (gekookt)', // vóór token-laag: anders matcht "sushi" op "Sushi (zalm nigiri)"
  'sushirijst': 'Witte rijst (gekookt)',
  'eend': 'Eendenfilet',
  'eendenborst': 'Eendenfilet',
  'katenspek': 'Spek (gerookt, gecureerd)', // gecureerd/gerookt — relevant voor migraine/histamine

  // Tweede eval-batch (5 extra kaarten: IT/ID/GR/IN/ES). Precieze synoniemen.
  'gedroogde vijg': 'Vijg (gedroogd)', // vóór token-laag: anders matcht "vijg" op "Vijg (vers)"
  'gedroogde vijgen': 'Vijg (gedroogd)',
  'tahoe': 'Tofu (naturel)', // NL/Indonesisch synoniem
  'parmaham': 'Prosciutto (rauwe ham, Italiaans)',
  'manchego': 'Manchego kaas',
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

  // Toegevoegd na eval over echte kaarten — generieke/samengestelde term → representatief
  // basis-item. BENADERING (bereiding zoals frituren/suiker wordt niet meegenomen); de UI
  // markeert deze als "≈ representatief".
  'friet': 'Aardappel (gekookt)',
  'frietjes': 'Aardappel (gekookt)',
  'patat': 'Aardappel (gekookt)',
  'fries': 'Aardappel (gekookt)',
  'brioche': 'Wit brood',
  'briochebroodje': 'Wit brood',
  'crouton': 'Wit brood',
  'kropsla': 'Sla (ijsberg)',
  'burrata': 'Mozzarella (vers)',
  'worst': 'Rookworst (gecureerd)',
  'appelmoes': 'Appel (rauw)',
  'calvados': 'Cognac / Brandy', // appelbrandewijn → gedistilleerd; vangt de alcohol-as

  // Tweede eval-batch — generieke term → representatief item (de werkelijke variant kan
  // afwijken; UI markeert als ≈). Veel hiervan zijn termen waarvan het item wél bestaat maar
  // met een kwalificatie ervoor ("Volle yoghurt", "Rundergehakt", "Witte rijst").
  'yoghurt': 'Volle yoghurt',
  'rijst': 'Witte rijst (gekookt)',
  'gehakt': 'Rundergehakt',
  'linzen': 'Groene linzen (gekookt)',
  'serranoham': 'Prosciutto (rauwe ham, Italiaans)', // gecureerde ham, vangt het cured-meat-signaal
  'schapenkaas': 'Feta',
  'room': 'Slagroom',
  'guanciale': 'Spek (gerookt, gecureerd)', // gecureerd varkensvlees
}
