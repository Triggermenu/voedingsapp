# Cluster 13 — Histamine-rijke vis: items

Opgesteld: 2026-05-20 | Bestand: `src/data/vis-schaaldieren.json`

## Score-fixes

| ID | Naam | Pre | Post | Wijziging |
|---|---|---|---|---|
| 175080 | Ansjovis (ingeblikt) | 0→**2** | 2 (B, Maintz+Hind) | score-fix + bronnen + triggerType |
| 175139 | Sardines (blik, olie) | 0→**1** | 1 (B, Maintz+Hind) | score-fix + bronnen + triggerType |
| 175159 | Tonijn (blik, water) | 0→**1** | 1 (B, Maintz+Hind) | score-fix + bronnen + triggerType |
| nl-zalm-gerookt | Gerookte zalm | 0→**2** | 2 (B, Maintz+Hind) | score-fix + bronnen + triggerType |
| nl-sprotjes-blik | Sprotjes (blik) | 0→**2** | 2 (B, Maintz+Hind) | score-fix + bronnen + triggerType |
| nl-haring-zuur | Maatjesharing | 0→**2** | 2 (B, Maintz+Hind) | score-fix + bronnen + triggerType |
| nl-zalm-blik | Zalm (blik) | 0→**1** | 1 (B, Maintz+Hind) | score-fix + bronnen + triggerType |

## Source-upgrades (score ongewijzigd)

Alle overige vis-schaaldieren items (41 items): Hindiyeh sole → Maintz 2007 + Hindiyeh 2020 + noot.

## Uitbreiding 2026-05-23 — herindeling uit cluster 3

Drie items werden in PR #35 abusievelijk aan cluster 3 (gerijpte kazen, tyramine/MAO-A) toegekend, terwijl ze mechanistisch in cluster 13 horen (histamine-vis, dezelfde groep als `nl-haring-zuur`, `nl-zalm-blik`, `nl-sprotjes-blik`). Herindeling 2026-05-23; migraine-score ongewijzigd (al 2 sinds PR #26). `primaryModulators` van `["tyramine","histamine"]` → `["histamine"]`; tyramine-specifieke Finberg 2022 uit de bronset; notes herschreven naar histamine/DAO-pathway.

| ID | Naam | Mig-score | triggerType | modulators |
|---|---|---|---|---|
| `nl-makreel-blik` | Makreel (blik, in eigen sap) | 2 | subgroep-overschat | `["histamine"]` |
| `nl-gravad-lax` | Gravad lax (gezouten zalm) | 2 | subgroep-overschat | `["histamine"]` |
| `nl-haring-rolmops` | Rolmops (ingelegde haring) | 2 | subgroep-overschat | `["histamine"]` |

Score-shifts: **7** · Source-upgrades: 48 · Herindeling uit cluster 3: **3**
