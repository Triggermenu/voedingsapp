# Cluster 6 — Gist-extracten en autolyses: rationale

---

## Broncorrecties t.o.v. originele instructies

De auteurs/journals in de instructie klopten niet volledig:

| Originele formulering | Werkelijke paper | PMID |
|---|---|---|
| "Walker, Sandler, Kohen 1996 (Br J Clin Pharmacol)" | Walker SE, Shulman KI, Tailor SA, Gardner D — "Tyramine content of previously restricted foods in MAOI diets" — *J Clin Psychopharmacol* 1996;16(5):383-388 | 8889911 |
| "Gardner 1996 J Clin Psychiatry" | Gardner DM, Shulman KI, Walker SE, Tailor SA — "The making of a user friendly MAOI diet" — *J Clin Psychiatry* 1996;57(3):99-104 | 8617704 |
| "Shulman & Walker 1999 Drug Safety" | Shulman KI, Walker SE — "Refining the MAOI diet: tyramine content of pizzas and soy products" — *J Clin Psychiatry* 1999;60(3):191-193 | 10192596 |
| "Da Prada 1988 J Neural Transm" | Da Prada M et al. — "On tyramine, food, beverages and the reversible MAO inhibitor moclobemide" — *J Neural Transm Suppl* 1988;26:31-56 | 3283290 |
| "McCabe-Sellers 2006 J Food Composition Analysis" | McCabe-Sellers BJ, Staggs CG, Bogle ML — *J Food Compost Anal* 2006;19:S58-S65 | DOI 10.1016/j.jfca.2005.12.008 (geen PubMed-PMID) |

"Sandler" en "Kohen" zijn geen auteurs in de geldige tyramine-MAOI-literatuur. De instructie combineerde waarschijnlijk twee afzonderlijke 1996-papers (Walker et al. in *J Clin Psychopharmacol* en Gardner et al. in *J Clin Psychiatry*) tot één bron. "Br J Clin Pharmacol" is onjuist. Geen invloed op evidence-kwaliteit; alleen op citering.

---

## Kritische bevinding: tyramine in modern Marmite lager dan verwacht

| Bron | Tyramine (mg/kg) | 5g portie (mg) | MAOI-drempel 6 mg/maal |
|---|---|---|---|
| Blackwell et al. 1969 (*J Food Sci*) | 100–1600 mg/kg; Marmite hoogste waarden | 0,5–8 mg | Variabele overlap |
| Prescribers' Guide (PMC9172554, 2022) | 322–650 mg/kg (moderne meting) | 1,6–3,25 mg | **Onder drempel** |
| Verwacht in instructie | 1.000–2.000 mg/kg | 5–10 mg | Boven drempel |

Moderne metingen (PMC9172554) rapporteren Marmite-tyramine op 322–650 mg/kg — significant lager dan de historische schatting van ~1.500 mg/kg (Blackwell 1969). De reviewauteurs schrijven het verschil toe aan (a) verbeterde LC-analysemethoden (eerdere kleuringsmethoden waren minder selectief) en (b) mogelijk productieveranderingen. Bij een standaardportie van 5g is de tyraminebelasting **1,6–3,25 mg**, wat onder de klassieke MAOI-veiligheidsgrens van 6 mg/maal valt.

### Gevolgen voor score 2-onderbouwing

Score 2 is gehandhaafd — niet op basis van "portie bereikt MAOI-drempel", maar op basis van:

1. **Batchvariabiliteit**: Blackwell 1969 toonde al grote intra-product spreiding (drie samples Marmite gaven sterk uiteenlopende waarden). Worst-case bleef >1.000 mg/kg.
2. **Voorzorgsbeginsel**: Gardner 1996 (PMID 8617704) classificeert Marmite als "absolutely restricted" in MAOI-dieetrichtlijnen, ook bij lagere moderne waarden, vanwege beperkte recente data.
3. **Integere communicatie naar gebruiker**: score 2 + note instrueert MAOI-gebruikers om te vermijden (vanwege variabiliteit), terwijl de note ook expliciet stelt dat het voor niet-MAOI-gebruikers moeiteloos wordt afgebroken.

### Voor niet-MAOI migrainepatiënten

Intact MAO-A metaboliseert 1,6–3,25 mg tyramine moeiteloos — de drempel voor hypertensieve crisis bij niet-MAOI ligt bij ~20–30 mg/maal (PMC9172554). Walker 1996 en Gardner 1996 zijn uitsluitend MAOI-dietstudies; geen positieve migraine-RCT voor yeast extract beschikbaar. Hindiyeh 2020 noemt yeast extract niet als primaire migrainetrigger.

---

## Cluster-toewijzing bouillonblok

Bouillonblok (nl-bouillonblok-gistextract) was oorspronkelijk bestemd voor cluster 6, maar literatuuronderzoek toont:

- Bouillonblokjes bevatten gistextract als **smaakstof**, geen autolytisch geconcentreerd product
- Tyramine in niet-gefermenteerde bouillonproducten: ≤10 mg/kg (PMC9172554)
- Per 5g blokje = **~0,05 mg tyramine** — verwaarloosbaar

De enige actieve migrainepathway in industriële bouillonblokjes is MSG (E621). Cluster-toewijzing gewijzigd naar **cluster 18** (MSG-paradigma). Score 2 / triggerType subgroep-overschat / evidence B consistent met nl-msg-bevindingen uit cluster 18.

---

## Gistvlokken vs Marmite/Vegemite: mechanistisch onderscheid

| Eigenschap | Marmite/Vegemite | Gistvlokken (nutritional yeast) |
|---|---|---|
| Productieproces | Autolytische afbraak: enzymen breken gistcellen af → biogene amines vrijkomen | Inactief drogen (verhitting): enzymen geïnactiveerd, minimale autolytische afbraak |
| Tyramine-concentratie | 322–650 mg/kg (modern), tot 1.600 mg/kg historisch | Geen kwantitatieve data beschikbaar; lager dan autolytisch extract verwacht |
| Migraine-score | 2 (context-afhankelijk) | 1 (voorzorgsscore, evidence C) |
| Purines | >300 mg/100g (geconcentreerd) | >300 mg/100g (gedroogd gist) |

NHF-tyraminedieet waarschuwt voor "yeast and yeast extracts" collectief maar onderscheidt nutritional yeast niet expliciet van autolysaat. Score 1 + note voor gistvlokken is een bewuste en verdedigbare afwijking van dat generieke advies.

---

## triggerType-keuze: context-afhankelijk vs drug-interactie

Gekozen: `context-afhankelijk` voor alle drie cluster-6-items.

**Redenering**: de app richt zich op de algemene bevolking. "Drug-interactie" suggereert dat het item standaard gevaarlijk is — wat voor niet-MAOI-gebruikers onjuist is. "Context-afhankelijk" + note over MAOI-medicatie geeft de gebruiker de informatie om zelf te beslissen.

**Open punt voor cluster 3**: bij gerijpte kazen geldt mechanistisch dezelfde afweging (tyramine-pathway, geen migraine-RCT). Beslissing aldaar is leidend voor eventuele retroactieve aanpassing van cluster 6. Gedocumenteerd in migraine-cleanup-todo.md.

---

## Acute vs cumulatief — bevinding cluster 6

Het acute-vs-cumulatief patroon (cluster 17 dimensie 15-kandidaat) is voor cluster 6 **niet van toepassing** als mechanistische variabele:

- MAOI-tyramine-interactie werkt per-maal acuut: MAO-inhibitie → tyramine accumuleert per maaltijd → noradrenaline-vrijzetting. Geen cumulatieve sensitisatie.
- Dagelijks Marmite-gebruik (1,6–3,25 mg/dag) betekent dagelijkse subdrempel-exposures voor MAOI-gebruikers — veiligheidsmarge is kleiner dan bij incidenteel gebruik, maar mechanisme blijft acuut per maal.
- Geen cumulatieve sensitisatie zoals de aspartaam-hypothese (cluster 17).

---

## Primaire bronnen per item

| Bron | Relevantie |
|---|---|
| Gardner DM et al. 1996 PMID 8617704 | Marmite "absolutely restricted" in MAOI-dieet; drietier-classificatie |
| Walker SE et al. 1996 PMID 8889911 | LC-analyse tyramine in 51 voedingsmiddelen; kwantitatieve methode |
| Da Prada M et al. 1988 PMID 3283290 | Klassiek mechanisme tyramine + MAO-remming; systematische voedingsanalyse Europese producten |
| Finberg JPM & Gillman K 2022 PMC9172554 | Moderne review: Marmite 322–650 mg/kg; bouillonblok ≤10 mg/kg |
| McCabe-Sellers BJ et al. 2006 DOI 10.1016/j.jfca.2005.12.008 | Australische data incl. Vegemite-profiel |
| Kaneko K et al. 2014 PMID 24553148 | Gedroogd gist >300 mg purines/100g; jicht-score 3 onderbouwing |
| Hindiyeh et al. 2020 PMC7496357 | Secundaire bron: geen specifieke evidence voor yeast extract als migrainetrigger |

---

## Gaps

1. Geen recente LC-analyse van Marmite tyramine als primaire studie — moderne data komt uit een review (PMC9172554), niet uit een nieuwe primaire meting.
2. Geen kwantitatieve tyramine-data voor nutritional yeast (gistvlokken) — score 1 is evidence C, louter indirect afgeleid van autolytisch vs inactief onderscheid.
3. McCabe-Sellers 2006 niet beschikbaar als open access — Vegemite-specifieke data niet direct verifieerbaar.
4. Geen migraine-specifieke RCT voor enig cluster-6-item — alle evidence is via MAOI-farmacologie.
5. Marmite/Vegemite niet in USDA Purine Database Release 2.0 als afzonderlijk item — jicht-score onderbouwd via Kaneko (gedroogd gist categorie).
