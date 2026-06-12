// De versie die we aan gebruikers tonen = de METHODOLOGIE-versie (de scoringsregels
// en -beslissingen), niet de code/app-versie uit package.json. Voor een transparante
// beslishulp is "welke versie van de scoringsmethodologie kijk ik aan?" de betekenisvolle
// versie. Bron van waarheid is CLAUDE.md §15 ("Schema version: vX.Y").
//
// Houd deze waarde gelijk aan CLAUDE.md. De CI-test tests/unit/version-sync.test.ts
// faalt als ze afwijken, zodat de footer niet stilletjes kan verouderen.
export const METHODOLOGY_VERSION = '3.0'
