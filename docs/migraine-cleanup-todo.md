# Migraine data — cleanup TODO

Items voor een aparte opruim-ronde, niet urgent voor cluster-onderzoek.

---

## Duplicaten / overlappende items

### Actie vereist

| Item 1 | Item 2 | Status | Voorstel |
|---|---|---|---|
| `nl-worst-rook` — Rookworst (gecureerd) | `nl-rookworst-gecureerd` — Rookworst (gecureerd) | Vermoedelijk identiek product | nl-worst-rook deprecaten; addedAt 2026-05-12 vs 2026-05-11 |

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

## Overige cleanup-punten (verzamelen per cluster)

*Cluster 7 gaps (zie ook migraine-cluster-7-rationale.md):*
- Chorizo-residu varieert sterk; traditionele vs industriële chorizo niet onderscheiden
- Prosciutto DOP vs generiek: dataset dekt beide met één item
- Henderson & Raskin 1972 nooit gerepliceerd in moderne RCT — directe bewijsbasis blijft N=1
