# Migraine data — cleanup TODO

Items voor een aparte opruim-ronde, niet urgent voor cluster-onderzoek.

---

## Duplicaten / overlappende items

### Actie vereist

| Item 1 | Item 2 | Status | Voorstel |
|---|---|---|---|
| `nl-worst-rook` — Rookworst (gecureerd) | `nl-rookworst-gecureerd` — Rookworst (gecureerd) | Vermoedelijk identiek product | nl-worst-rook deprecaten; addedAt 2026-05-12 vs 2026-05-11 |
| `nl-worcestershire` — Worcestershiresaus | `nl-worcestershiresaus` — Worcestershiresaus | Vermoedelijk identiek product | nl-worcestershire deprecaten (score 1 vs 2; nl-worcestershiresaus heeft note) |

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

## Overige cleanup-punten (verzamelen per cluster)

*Cluster 7 gaps (zie ook migraine-cluster-7-rationale.md):*
- Chorizo-residu varieert sterk; traditionele vs industriële chorizo niet onderscheiden
- Prosciutto DOP vs generiek: dataset dekt beide met één item
- Henderson & Raskin 1972 nooit gerepliceerd in moderne RCT — directe bewijsbasis blijft N=1
