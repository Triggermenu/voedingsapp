# Migraine data — cleanup TODO

Items voor een aparte opruim-ronde, niet urgent voor cluster-onderzoek.

---

## Duplicaten / overlappende items

### Actie vereist

| Item 1 | Item 2 | Status | Voorstel |
|---|---|---|---|
| `nl-worst-rook` — Rookworst (gecureerd) | `nl-rookworst-gecureerd` — Rookworst (gecureerd) | Vermoedelijk identiek product | nl-worst-rook deprecaten; addedAt 2026-05-12 vs 2026-05-11 |
| `nl-worcestershire` — Worcestershiresaus | `nl-worcestershiresaus` — Worcestershiresaus | Vermoedelijk identiek product | nl-worcestershire deprecaten (score 1 vs 2; nl-worcestershiresaus heeft note) |
| `170844` — Mozzarella (vers, USDA) | `nl-mozzarella-vers` — Mozzarella (vers) | Identiek product; 170844 heeft geen note | `170844` deprecaten — nl-mozzarella-vers heeft note en is NL-specifiek |
| `nl-huttenkase` — Hüttenkäse (cottage cheese) | `nl-cottage-cheese` — Cottage cheese | Identiek product, ander taalgebruik; nl-huttenkase in kaas-vers, nl-cottage-cheese in kaas | `nl-cottage-cheese` deprecaten — nl-huttenkase heeft correcte subcategory |
| `nl-smeerkaas` — Smeerkaas (Philadelphia type) | `nl-roomkaas` — Roomkaas (smeerkaas) | Vermoedelijk identiek product; nl-roomkaas heeft geen onderscheidende note | `nl-smeerkaas` deprecaten — nl-roomkaas is het meest gangbare Nederlandse begrip |

### Geen actie nodig, alleen genoteerd

| Item 1 | Item 2 | Verschil |
|---|---|---|
| `168319` — Spek (gerookt, gecureerd) | `nl-spek-gerookt` — Spek (gerookt) | Verschillende producten: 168319 = USDA American-style bacon, nl-spek-gerookt = NL gerookt spek. Beide behouden. |
| `172936` — Salami | `nl-salami` — Salami (gecureerd, gerijpt) | Verschillende producten: 172936 = USDA cooked beef salami, nl-salami = droog gerijpte salami. Beide behouden. |

---

## Brede duplicaat-audit

Na afronding cluster 18: volledige dataset scannen op:
- Items met identieke `name.nl`
- Items met sterk overlappende namen binnen dezelfde categorie
- USDA-items (`id` numeriek) met NL-equivalent (`id` prefix `nl-`) die hetzelfde product dekken

Verwachting: meer duplicaten aanwezig, met name in vlees, zuivel en dranken-non-alcohol.

---

## Ontbrekende items — dataset-uitbreiding (niet urgent)

*Cluster 18 gap:*
Dataset bevat momenteel GEEN aparte items voor MSG-houdend industrieel voedsel:
- Chips met MSG (bv. Lay's, Doritos — plain chips = score 0, maar MSG-variant ≠ 0)
- Instant noodles (Maggi, Cup Noodles — bevatten standaard E621)
- Bouillonblokjes / -poeders met MSG (Knorr, Maggi)
- Fastfood-mixes, smaakversterker-pakjes, Aziatische kant-en-klaar-maaltijden

Aanbeveling: aparte uitbreidingsbatch na afronding cluster 1–20, want scoring-regel voor E621 is dan vastgelegd.

---

## ~~Open vraag: triggerType tyramine-pathway (cluster 3 / cluster 6)~~ — OPGELOST (2026-05-14)

**Beslissing cluster 3:** `subgroep-overschat` voor alle 13 gerijpte kazen.

**Onderbouwing:** voor de algemene (niet-MAOI) populatie zijn er geen positieve RCTs voor gerijpte kazen als migrainetrigger. Ziegler & Stewart 1977 (PMID 560645) vond dat placebo even effectief was als tyramine-capsules. Moffett 1972 (PMID 4559027) vond geen significant verband. De Macedonische SR 2023 (Sudharta et al.) toonde 0–42,1% response op placebo vs 17,2–50% op tyramine — overlap te groot voor causaliteit. Alle positieve evidence stamt uit één laboratorium (Hanington, 1967–1970) zonder onafhankelijke replicatie.

**Onderscheid met cluster 6 (context-afhankelijk):** Marmite/Vegemite nadert bij 5g de MAOI-veiligheidsgrens (1,6–3,25 mg / 6 mg threshold) met reële batchvariabiliteit. Gerijpte kazen komen bij normale porties (30g) voor de meeste items ver onder die grens, en de MAOI-specifieke waarschuwing is minder prominent omdat kaas geen "MAOI-dieet-verboden-categorie" is die gebruikers actief herkennen.

**Retroactieve aanpassing cluster 6:** niet nodig. `context-afhankelijk` blijft correct voor Marmite/Vegemite/gistvlokken (MAOI-interactie is het primaire mechanisme). `subgroep-overschat` is correct voor gerijpte kazen (populair als trigger, maar RCT-bewijs ontbreekt en geeft negatieve signalen).

---

## Overige cleanup-punten (verzamelen per cluster)

*Cluster 7 gaps (zie ook migraine-cluster-7-rationale.md):*
- Chorizo-residu varieert sterk; traditionele vs industriële chorizo niet onderscheiden
- Prosciutto DOP vs generiek: dataset dekt beide met één item
- Henderson & Raskin 1972 nooit gerepliceerd in moderne RCT — directe bewijsbasis blijft N=1
