# Cluster 15 — Citrusvruchten: items

Opgesteld: 2026-05-20 | Branch: migraine/open-clusters-batch | Bestand: `src/data/fruit.json`

| ID | Naam | Pre | Post | Wijziging |
|---|---|---|---|---|
| 169097 | Sinaasappel | 0 (B, Hindiyeh) | **1** (B, Maintz+Hind) | score 0→1 + bronnen + triggerType |
| 167747 | Citroen | 0 (B, Hindiyeh) | **1** (B, Maintz+Hind) | score 0→1 + bronnen + triggerType |
| nl-grapefruit | Grapefruit | 0 (B, Hindiyeh) | **1** (B, Maintz+Hind) | score 0→1 + bronnen + triggerType |
| nl-clementine | Clementine | 2 (B, Hindiyeh) | **1** (B, Maintz+Hind) | score 2→1 + bronnen + triggerType |
| nl-limoen | Limoen | 2 (B, Hindiyeh) | **1** (B, Maintz+Hind) | score 2→1 + bronnen + triggerType |
| nl-kumquat | Kumquat | 2 (B, Hindiyeh) | **1** (B, Maintz+Hind) | score 2→1 + bronnen + triggerType |

**Score-shifts: 6** (3 omhoog: 0→1; 3 omlaag: 2→1)
**Reden:** Pre-patch had geen consistent scorebeleid voor citrus. Normalisatie naar score 1 op basis
van zwakke maar aanwezige trigger-evidentie (~11% zelfrapportage, histamine-liberator mechanism).

triggerType: subgroep-overschat · confidence: laag · primaryModulators: histamine-liberator, octopamine
