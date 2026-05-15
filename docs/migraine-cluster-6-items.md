# Migraine cluster 6 — Gist-extracten en autolyses: itemslijst

Opgesteld: 2026-05-14 · FASE 1

---

## Bestaande items in dataset

**Geen.** De dataset bevat nul items die primair in cluster 6 vallen.

### Waarom de aangrenzende bouillon-items NIET in cluster 6 vallen

| Item | Reden buiten cluster 6 |
|---|---|
| `nl-bouillon-kip` (vlees.json) | Zelfgemaakt — geen gistextract. Migraine score 0 correct. |
| `nl-bouillon-rundvlees` (vlees.json) | Zelfgemaakt — geen gistextract. Migraine score 0 correct. |
| `nl-worcestershire` / `nl-worcestershiresaus` (sauzen-kruiden.json, cluster 5) | Primaire trigger = gefermenteerde ansjovis + azijn, niet gistextract. Cluster 5 correct. |
| `nl-sojasaus`, `nl-ketjap-manis`, `nl-tahoe-marinade` (cluster 5) | Primaire trigger = histamine/tyramine via soja-fermentatie, geen autolytisch gist. |

---

## Nieuw toe te voegen items (alle 4 zijn gaps)

### 1. nl-marmite
**Kern-item cluster 6.** Autolytisch gistextract (Unilever UK). Tyramine 1.000–2.000 mg/kg (Walker 1996). Portie 5 g = 5–10 mg tyramine. Raakt MAOI-drempel van 6 mg/maaltijd. Categorie: sauzen-kruiden (subcategory: spreads).

### 2. nl-vegemite
**Australische equivalent van Marmite.** Autolytisch gistextract (Bega Cheese Ltd). Vergelijkbaar tyramine-profiel; McCabe-Sellers 2006 documenteert tyramine in Australische producten inclusief Vegemite. Portie typisch 4–5 g. Categorie: sauzen-kruiden (subcategory: spreads).

### 3. nl-gistvlokken
**Nutritional yeast / "nooch".** Inactieve Saccharomyces cerevisiae — NIET autolytisch. Fundamenteel ander profiel: lagere tyramine, hogere B12 en B-vitamines. Populair in vegan keuken als kaasvervanging. Categorie: sauzen-kruiden (subcategory: smaakversterkers).

### 4. nl-bouillonblok-gistextract
**Industrieel bouillonblok met gistextract** (generiek — Knorr/Maggi-type). Bevat gistextract + MSG (E621) → cluster-overlap 6 + 18. Primaire cluster = 6 (gistextract als hoofd-trigger-stof). Hoge natrium. Categorie: sauzen-kruiden (subcategory: bouillon).

---

## Cross-cluster grensgevallen

| Item | Cluster-beslissing | Redenering |
|---|---|---|
| Worcestershiresaus | Cluster 5 (blijft) | Primaire trigger = ansjovis-fermentatie, niet gist |
| Bouillonblok zonder gistextract (bv. puur vleesbouillon) | Cluster 7 of vlees | Alleen als nitriet aanwezig; anders geen cluster-toewijzing nodig |
| Misopasta | Cluster 5 (blijft) | Soja-fermentatie primair, geen autolytisch gist |
| Veganistische bouillon op basis van sojasaus | Cluster 5 | Soja-pathway dominant |
| Dashi (Japanse zeewier/vis-bouillon) | Cluster 5 of geen | Geen gistextract, wel glutamaat — overlap met cluster 18 mogelijk |

---

## Samenvatting

- **Bestaande items:** 0
- **Nieuw toe te voegen:** 4
- **Duplicaten gevonden:** geen
- **Cleanup-todo aanpassingen:** geen (grensgevallen opgelost via cluster-toewijzing, geen nieuwe duplicaten)
