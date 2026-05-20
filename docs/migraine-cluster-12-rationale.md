# Cluster 12 — Bier en sterke drank: rationale

Opgesteld: 2026-05-20  
Branch: migraine/open-clusters-batch

---

## Paradigma

**Cluster definitie:** Bier (pilsener, stout, IPA, weizen, trappist, lambiek), gedistilleerde
drank (whisky, gin, vodka, rum, tequila, cognac, jenever, absint), likeur, vermouth, mead.

**Primaire trigger-pathway:**
1. **Gedistilleerde drank (score 2):** Ethanol-dominant. Geen quercetine-ALDH2 pathway. Vodka
   als "pure ethanol" controle in Onderwater 2019: triggert migraine in ~8% van patiënten.
2. **Bier (score 3):** Ethanol + biogene aminen van fermentatie. Lagere quercetine dan rode wijn.
   Score 3 op basis van CLAUDE.md whitelist "Alcohol (especially red wine)" — alcohol breed
   gedefinieerd.

**Score-inconsistentie (gedocumenteerd, niet opgelost):**
Rode wijn (cluster 10) heeft score 2, maar bier heeft score 3. Dit is inconsistent als we
zuiver op trigger-frequentie scoren (rode wijn triggert meer dan bier per Onderwater 2019).
Mogelijke redenering voor bier score 3:
- Bier wordt in grotere volumes geconsumeerd (50cl vs 15cl wijn)
- Biogene-amine bijdrage van gisting
- CLAUDE.md §2.1 jicht-regel "Alcohol (especially beer) = 3" kan overgeslopped zijn
  naar migraine-scoring
**Actie:** Geen score-wijziging in deze batch (geen expliciete opdracht). Cleanup-taak registreren.

**Speciale items:**
- **nl-lambiek:** Spontaan gefermenteerd bier met hogere biogene aminen. Score 3 met dual-pathway
  (ethanol + tyramine/histamine). Overlap met cluster 6 (gistextracten) maar ethanol dominant.
- **nl-bier-trappist:** Hoog alcoholpercentage (6-12%). Score 3 correct.
- **nl-bier-alcoholvrij:** Score 0. Geen ethanol → geen trigger-pathway. Correct.
- **nl-vermouth:** Gearomatiseerde vermouth bevat kruiden/absinthe. Score 2 (ethanol-dominant;
  geen tyramine-rijke fermentatie).
- **nl-absint:** Hoog alcoholpercentage + thujone uit alsem. Score 2 correct.
