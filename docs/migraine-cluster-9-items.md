# Cluster 9 — Nitraatrijke groenten: items

Opgesteld: 2026-05-20 | Bestand: src/data/groente.json + src/data/dranken-non-alcohol.json

## Score 1-kandidaten (hoog nitraat >250 mg/100g) — gewijzigd

| ID | Naam | Score voor | Score na | Cluster voor | Cluster na |
|---|---|---|---|---|---|
| 169145 | Rode biet | 0 | 1 | geen | 9 |
| 169967 | Rucola (USDA, duplicaat aanwezig) | 0 | 1 | geen | 9 |
| nl-rucola | Rucola (nl-prefix, duplicaat van 169967) | 0 | 1 | geen | 9 |
| nl-rucola-wilde | Wilde rucola | 0 | 1 | geen | 9 |
| nl-radijs | Radijs | 0 | 1 | geen | 9 |
| nl-raapstelen | Raapstelen | 0 | 1 | geen | 9 |
| nl-mangold | Snijbiet / Mangold (rauw) | 0 | 1 | geen | 9 |
| nl-oekraense-biet | Rode biet (gekookt) | 0 | 1 | geen | 9 |
| nl-gele-biet | Gele biet (rauw) | 0 | 1 | geen | 9 |
| nl-paksoi | Paksoi | 0 | 1 | geen | 9 |
| nl-daikon | Daikon / Witte radijs (rauw) | 0 | 1 | geen | 9 |

**Totaal score-1 wijzigingen: 11 items**

## Score 2-kandidaten (geconcentreerd) — gewijzigd

| ID | Naam | Bestand | Score voor | Score na |
|---|---|---|---|---|
| nl-bietensap | Bietensap (vers geperst) | dranken-non-alcohol.json | 0 | 2 |

## Stop-conditie items — NIET gewijzigd

| ID | Naam | Reden |
|---|---|---|
| 168463 | Spinazie (rauw) | cluster:14 (histamine-pathway, DAO-deficiëntie). Al score:1 via andere pathway. Niet overschrijven. |
| nl-wilde-spinazie | Wilde spinazie | cluster:14, idem. Al score:1. |

**Actie:** Spinazie-items zijn qua score al correct (score 1). De note vermeldt geen nitraat-pathway. Follow-up: overweeg of spinazie dual-cluster-annotatie nodig heeft (cluster 14 histamine + cluster 9 nitraat). Buiten scope deze PR.

## Bewust niet-gewijzigd (100-250 mg/100g range)

| ID | Naam | Nitraat (mg/100g) | Reden geen wijziging |
|---|---|---|---|
| nl-veldsla | Veldsla | ~140-190 | Hoog-categorie (100-250), onvoldoende specifieke migraine-evidence |
| nl-andijvie | Andijvie | ~100-200 | Hoog-categorie (100-250), idem |
| 170049 | Raap / Knolraap | ~130 | Hoog-categorie, idem |
| 169248 | Sla (ijsberg) | <50 | Laag-categorie |
| nl-sla-ijsberg | IJsbergsla | <50 | Laag-categorie |

## Niet in DB (verwacht, afwezig)

- **Bleekselderij** — niet in groente.json. Kan worden toegevoegd in toekomstige uitbreidingsbatch.
- **Tuinkers** — niet in groente.json. Idem.

## Rucola-duplicaat signalering

`169967` en `nl-rucola` zijn beide "Rucola" met identieke migraine-bronnen. Per CLAUDE.md §4.1 is `169967` (USDA FDC ID) canonical. Verwijdering `nl-rucola` als aparte cleanup-PR (buiten scope cluster 9).
