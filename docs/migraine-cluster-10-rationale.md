# Cluster 10 — Rode wijn: rationale per item

---

## Item 1: Rode wijn (id: 174836)

### Score-beslissing
**Score 3 → 2.** Rode wijn staat op de migraine-whitelist (CLAUDE.md §2.2), wat score 3 toestaat maar niet verplicht. Score 3 houden zou intern tegenstrijdig zijn met `triggerType: subgroep-overschat`: een score die "ernstig risico" signaleert terwijl >90% van de migrainepopulatie geen objectief effect toont (Onderwater 2019: 8,8% consistente respons). Littlewood 1988 (82% respons) is gedaan in zelf-geselecteerde gevoelige patiënten — dat is circulaire selectie en niet representatief voor de brede migrainepopulatie. Score 2 (oranje) gecombineerd met `subgroep-overschat` + gedetailleerde note is transparanter en intern consistent.

### Evidence-beslissing
**Evidence B** — primaire basis verschuift van Hindiyeh 2020 (SR, COI Eli Lilly/Amgen) naar Littlewood 1988 (provocatie-RCT, geen COI). Evidence B is correct: provocatie-RCT met kleine n valt onder "klinisch bewijs zonder grote RCT", en mechanistische onderbouwing (Devi 2023) versterkt dit. Evidence A is niet gerechtvaardigd: Devi 2023 is in-vitro; Littlewood 1988 is n=11.

### triggerType-keuze: `subgroep-overschat`
Rode wijn is een echte trigger voor een identificeerbare subgroep (~9% van migrainepatiënten objectief consistent, Onderwater 2019), maar wordt sterk overschat in zelf-rapportage (~78%). Het label "subgroep-overschat" communiceert dit onderscheid accuraat: de trigger bestaat, maar de populaire perceptie van de omvang klopt niet. Op score 2 is dit label intern consistent — oranje + overschat = "let op voor gevoelige subgroep, niet universeel rood".

### primaryModulators-keuze
1. `quercetine-3-glucuronide` — primaire ALDH2-remmer (Devi 2023, IC50 9,6 µM), aanwezig in rode wijn ~20× meer dan witte wijn
2. `ethanol` — noodzakelijke co-factor; quercetine triggert niet zonder ethanol (dimensie 13: synergie)
3. `aldh2-variant` — ALDH2\*2 als sleutelmodulator uit clusterdefinitie; marginaal voor Europese populatie (<5%) maar relevant als genetische moderator voor Aziatische gebruikers

### Cluster-keuze: 10 (niet 12)
Rode wijn had ook kunnen vallen onder cluster 12 (bier en sterke drank — ethanol-dominant). Toewijzing aan cluster 10 is correct omdat het primaire trigger-mechanisme **niet** alleen ethanol is maar de quercetine-3-glucuronide × ethanol-synergie. Witte wijn met ethanol triggert niet via dit mechanisme; rode wijn wel. Onderscheid is mechanistisch gegrond.

---

## Item 2: Port (nl-port)

### Score-beslissing
**Score 2 gehandhaafd (oranje).** Zonder directe literatuur is noch score 3 noch score 0 verdedigbaar. Score 2 ("oranje, voorzichtig") weerspiegelt de redenering per analogie: port is versterkte rode wijn met vergelijkbare polyfenolen + hogere ABV, maar kleinere portie compenseert deels. Downgraden naar 1 of 0 zou de quercetine-pathway geheel negeren, wat ook niet correct is.

### Evidence-beslissing
**Evidence verlaging: B → C.** De vorige score B was gebaseerd op Hindiyeh 2020, die port niet noemt en alleen rode wijn als alcoholtrigger bespreekt. Het gebruik van die bron als evidence voor port was methodologisch incorrect. Evidence C is het maximum dat gerechtvaardigd is bij zuivere extrapolatie zonder directe studie.

### triggerType-keuze: `context-afhankelijk`
Port is geen bevestigde trigger voor een brede subgroep, maar ook niet neutraal. Het effect is afhankelijk van: (1) aanwezigheid quercetine (aannemelijk maar niet gemeten voor port), (2) inname in relevante hoeveelheid, (3) individuele ALDH2-status. "Context-afhankelijk" communiceert dat er een plausibel mechanisme is maar dat dit niet universeel geldt.

### primaryModulators-keuze
1. `ethanol` — het meest zekere component (aanwezig en hoger per ml)
2. `quercetine-3-glucuronide` — aannemelijk aanwezig als polyfenol-pathway via rode druivenschillen, maar niet direct gekwantificeerd

Slechts 2 modulators (max 3 toegestaan) — derde modulator niet opgenomen omdat er geen kwantitatieve data is voor port die een derde stof rechtvaardigt.

### Cluster-keuze: 10 (gefortificeerde rode wijn)
Port valt expliciet onder clusterdefinitie §10: "gefortificeerde rode wijn (port, sherry rood)". De toewijzing aan cluster 10 is daarmee vastgelegd in CLAUDE.md. In de rationale wordt expliciet genoteerd dat het primaire mechanisme voor port niet rechtstreeks bewezen is — dit is de first-time data-gap voor dit item.

---

## Cross-item noot

Het fundamentele onderscheid in deze patch:
- **Rode wijn**: score **2** + evidence B + confidence hoog — **directe provocatie-RCT, subgroep-trigger, populaire perceptie overschat**
- **Port**: score 2 + evidence **C** + confidence laag — **extrapolatie, geen directe studie**

Dit onderscheid moet in de UI zichtbaar zijn via de evidence-badge (B vs C) en de note. Gebruikers die port drinken zien oranje + evidence C + note "geen directe studie" — dat is een transparantere presentatie dan de vorige situatie waarbij beide items impliciet op Hindiyeh 2020 berustten.
