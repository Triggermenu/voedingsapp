# Cluster 1 — Cafeïne-dranken: items

Opgesteld: 2026-05-20 | Bestand: `src/data/dranken-non-alcohol.json`

## Score-fixes

| ID | Naam | Pre | Post | Wijziging |
|---|---|---|---|---|
| nl-witte-thee | Witte thee | 1→**0** | 0 (ICHD-3+Hind) | score-fix + bronnen |
| nl-oolong-thee | Oolong thee | 1→**0** | 0 (ICHD-3+Hind) | score-fix + bronnen |
| nl-energiedrank | Energiedrank | 1→**2** | 2 (ICHD-3+Hind) | score-fix + bronnen + triggerType |
| nl-kauwgom-suikervrij | Kauwgom (suikervrij) | 1→**2** | 2 (Schiff+Hind) | score-fix + bronnen + triggerType |

## Source-upgrades score>0 (met triggerType)

| ID | Naam | Score | Wijziging |
|---|---|---|---|
| nl-energydrink | Energydrank (Red Bull) | 2 | ICHD-3+Hind + triggerType onttrekkings-trigger |
| nl-kombucha | Kombucha | 2 | Maintz+Hind + triggerType subgroep-overschat |
| nl-cola | Cola (suikerhoudend) | 1 | ICHD-3+Hind + triggerType onttrekkings-trigger |
| nl-druivensap | Druivensap | 1 | Maintz+Hind + triggerType subgroep-overschat |
| nl-grapefruitsap | Grapefruitsap | 1 | Maintz+Hind + triggerType subgroep-overschat |
| nl-aardbeienlimonade | Aardbeiendrank | 1 | Maintz+Hind + triggerType subgroep-overschat |
| nl-citroenwater | Citroenwater | 1 | Maintz+Hind + triggerType subgroep-overschat |
| nl-tonic-water | Tonic water | 1 | Maintz+Hind + triggerType context-afhankelijk |

## Source-upgrades score 0 (Hindiyeh sole → 2 bronnen)

Alle overige 29 items (koffie, thee, water, sappen, kruidenthee etc.):
Hindiyeh sole → passende 2 bronnen.

Overgeslagen: nl-cola-light (al 5 bronnen volledig verwerkt).

Score-shifts: **4** · Source-upgrades: 41
