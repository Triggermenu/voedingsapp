# Cluster 2 — Chocolade en cacao: items

Opgesteld: 2026-05-20 | Bestanden: `src/data/zoetwaren.json`, `src/data/zuivel.json`

## Score-fixes

| ID | Naam | Pre | Post | Wijziging |
|---|---|---|---|---|
| nl-chocoladereep-wit | Witte chocolade | 1→**0** | 0 (Maintz+Hind) | score-fix |
| nl-donuts | Donuts (geglazuurd) | 1→**0** | 0 (Maintz+Hind) | score-fix |

## Source-upgrades chocolade score 2 (met triggerType)

| ID | Naam | Score | Wijziging |
|---|---|---|---|
| 170273 | Chocolade (puur, >70%) | 2 | Marcus+Hind + triggerType + note CLAUDE.md |
| nl-melkchocolade | Melkchocolade | 2 | Marcus+Hind + triggerType + note CLAUDE.md |
| nl-chocoladetruffels | Chocoladetruffels | 2 | Marcus+Hind + triggerType + note CLAUDE.md |
| nl-eclair | Éclair (chocolade) | 2 | Marcus+Hind + triggerType + note CLAUDE.md |

## Source-upgrades chocolade score 1 (verdund)

| ID | Naam | Score | Wijziging |
|---|---|---|---|
| nl-hagelslag | Chocoladehagelslag | 1 | Marcus+Hind + triggerType + note |
| nl-ijs-chocolade | Chocolade-ijs | 1 | Marcus+Hind + triggerType + note |
| nl-hagelslag-melk (zuivel) | Chocolademelk | 1 | Marcus+Hind + triggerType + note |

## Source-upgrades overige score>0 items

| ID | Naam | Score | Wijziging |
|---|---|---|---|
| ~~nl-frisdrank-cola~~ → **nl-cola** | Cola (suikerhoudend) | 1 | ICHD-3+Hind + triggerType onttrekkings-trigger | canoniek in dranken-non-alcohol; nl-frisdrank-cola (zoetwaren, duplicaat) verwijderd 2026-05-20 |
| nl-worstenbroodje | Worstenbroodje | 1 | Maintz+Hind + triggerType context-afhankelijk |
| nl-zoethout-snoep | Zoete drop (Engels) | 1 | Maintz+Hind + triggerType context-afhankelijk |
| nl-nougat | Nougat | 1 | Maintz+Hind + triggerType subgroep-overschat |

## Source-upgrades score 0

Overige 28 zoetwaren-items: Hindiyeh sole → Maintz + Hindiyeh.
Overgeslagen: nl-tafelzoetje-aspartaam (al 4 bronnen volledig verwerkt).

Score-shifts: **2** · Source-upgrades: 43
