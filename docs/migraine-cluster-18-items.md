# Cluster 18 — MSG / natriumglutamaat: item-overzicht

**Primaire trigger-pathway**: MSG → vrij glutamaat (hypothese: BBB-passage → cerebrale glutamaat-verhoging). Mechanisme NIET ondersteund (Fernstrom 2018). Nocebo-effect als meest plausibele verklaring (Kwok 1968 als startpunt).
Paradigma: **subgroep-overschat** — sterkste nocebo-evidence van alle migraine-clusters.

*Gegenereerd: 2026-05-15 | Prompt-versie: v5 | [retroactief gereconstrueerd 2026-05-20]*

---

## Items in cluster 18

### A. Bestaand item — score gewijzigd

| # | ID | Naam (NL) | Naam (EN) | Bestand | Pre-patch score | Post-patch score | Wijziging |
|---|---|---|---|---|---|---|---|
| 1 | `nl-msg` | MSG (natriumglutamaat) | MSG (monosodium glutamate) | sauzen-kruiden.json | 3 | 2 | score 3→2; triggerType, confidence, primaryModulators toegevoegd; bronnen vervangen |

### B. Nieuw item — toegevoegd in dezelfde patch

| # | ID | Naam (NL) | Naam (EN) | Bestand | Pre-patch score | Post-patch score | Opmerking |
|---|---|---|---|---|---|---|---|
| 2 | `nl-bouillonblok-gistextract` | Bouillonblok (met gistextract) | Stock cube (yeast extract) | sauzen-kruiden.json | — (nieuw) | 2 | Cluster 18; primaire pathway MSG, niet tyramine |

**Totaal: 2 items**

---

## Motivering cluster-toewijzing

### nl-msg
Kern-item van cluster 18. MSG staat op de CLAUDE.md-whitelist (§2.2) — score 3 was toegestaan maar na RCT-review verdedigbaar verlaagd naar 2. Primaire actieve stof: vrij glutamaat.

### nl-bouillonblok-gistextract
Oorspronkelijk aangeduid als cluster-6-kandidaat (gistextract). Literatuuronderzoek toont echter:
- Tyramine in niet-gefermenteerde bouillonproducten: ≤10 mg/kg (PMC9172554) → per 5g blokje = ~0,05 mg → verwaarloosbaar.
- Primaire migrainerelevante stof: MSG (E621), aanwezig als smaakversterker.
- MSG-pathway dominant → toewijzing cluster 18 (niet cluster 6).
- Score 2, triggerType subgroep-overschat, consistent met nl-msg.

---

## Score-wijziging nl-msg: verantwoording samenvatting

| Veld | Pre-patch | Post-patch |
|---|---|---|
| score | 3 | 2 |
| evidence | B | B |
| triggerType | — | subgroep-overschat |
| confidence | — | laag |
| primaryModulators | — | vrij-glutamaat |
| cluster | — | 18 |
| bronnen | Hindiyeh 2020 | Tarasoff 1993 + Yang 1997 + Geha 2000 + Obayashi 2016 + Fernstrom 2018 |

Score 3 was gebaseerd op CLAUDE.md-whitelist. RCT-evidence overwegend negatief (Tarasoff 1993, Geha 2000); positieve bevindingen alleen bij hoge doses (≥2,5g) zonder voedsel (Yang 1997). ICHD-3 2018 verwijderde MSG van officiële triggerlijst. Mechanisme (BBB-passage) niet ondersteund (Fernstrom 2018).

---

## Paradigma-precedent

Cluster 18 is de sterkste subgroep-overschat-case in de dataset:
- MSG: negatieve RCTs, ICHD-3 verwijdering, BBB-mechanisme absent → confidence laag bij score 2
- Score 2 (niet 0) gehandhaafd vanwege Yang 1997 (effect bij drempel 2,5g/nuchter) en voorzorgsbeginsel

---

## Gaps

1. nl-msg note instrueert gebruiker over context (hoge dosis/nuchter), maar dit grensscenario is niet relevant voor normale voedselconsumptie (<1g per maaltijd met voedsel).
2. Dataset mist MSG-houdende industriële producten (chips, instant noodles) — gedocumenteerd in migraine-cleanup-todo.md.
3. Kwok 1968 heeft geen PubMed-PMID (brief pre-PubMed-era); geciteerd via DOI 10.1056/NEJM196804042781419.
