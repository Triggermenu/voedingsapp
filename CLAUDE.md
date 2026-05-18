# CLAUDE.md — Voedingsapp

> **Dit document is de enige autoriteit waar Claude Code, Cowork en CI naar luisteren.**
> Wijzigingen aan dit bestand vereisen Peters expliciete akkoord.
> Alle andere kwaliteitscontrole gebeurt geautomatiseerd (CI gates, Zod, e2e tests, Sentry).

---

## 1. Project

**Wat:** Nederlandse webapp die als **beslishulp** werkt voor mensen met jicht, migraine, nierstenen en/of histamine-intolerantie. Per voedingsmiddel een stoplicht (rood/oranje/groen) per aandoening, met evidence-level en bron.

**Voor wie:** mensen met één of meer van deze aandoeningen, met name overlap-patiënten (die niemand goed bedient).

**Wat het uitdrukkelijk NIET is:**
- Geen dagboek/tracker
- Geen medisch advies (zie disclaimer)
- Geen dieetschema
- Geen vervanging van arts/diëtist

**Eindgebruikersbelofte:** transparante, bronvermelde stoplichten die helpen bij snelle keuzes (supermarkt, restaurant). Niet meer, niet minder.

---

## 2. Scoringsregels per aandoening

Scores zijn altijd: **0 (groen) / 1 (geel-groen) / 2 (oranje) / 3 (rood) / null (data niet beschikbaar)**.
Elk niet-null score MOET een `evidence` (A/B/C) en `sources[]` hebben.

### 2.1 Jicht (purine)

**Primaire bron:** USDA Purine Database Release 2.0 (2025, CC0).
**Aanvullend:** Kaneko et al. HPLC-data (Japanse jichtrichtlijnen), EULAR 2022, ACR 2020.

**Drempels (mg totaal purine per 100g):**
- `< 50` → 0 (groen)
- `50–100` → 1
- `100–200` → 2 (oranje)
- `> 200` → 3 (rood)

**Verplichte regel-overrides (achterhaalde aannames):**
- **Koffie = 0 (groen).** Recente Mendelian-randomization studies (Shirai 2022, meta-analyse 2025) tonen *beschermend* effect. Ondanks oude richtlijnen NIET rood scoren. Regression-test bewaakt dit.
- **Alcohol (vooral bier) = 3 (rood)** ongeacht puringehalte. Mechanisme: lactaat-competitie urinezuur-uitscheiding.
- **Fructose-rijke dranken (frisdrank, vruchtensap) = 3.**
- **Peulvruchten = max 2 (oranje)** ondanks soms hoog purine. EULAR 2022: epidemiologisch geen verhoogd risico.

**Evidence-default:** A (USDA-DB direct) of B (afgeleid).

### 2.2 Migraine

**LET OP — data-arm domein.** Er bestaat geen gezaghebbende kwantitatieve database. Evidence overwegend laag (cross-sectional, self-report). Recente reviews twijfelen aan klassieke triggers.

**Bronnen:** Hindiyeh 2020 systematic review (PubMed), American Migraine Foundation, Migraine Trust. Tyramine-tabellen alleen ter referentie, niet als enige basis.

**Whitelist voor score = 3 (rood)** — *alleen* deze stoffen krijgen rood, op basis van enige RCT/cohort-evidence:
- Alcohol (vooral rode wijn)
- MSG (monosodium glutamate)
- Gerijpte kaas (>6 maanden rijping)
- Gecureerd vlees (nitriethoudend)

**Score = 2 (oranje) met expliciete `note`:**
- Aspartaam
- **Chocolade**: NIET rood. Recente evidence (2023 SR) suggereert prodroom-craving i.p.v. trigger. Note: *"mogelijk een vroeg-symptoom in plaats van oorzaak"*.
- Cafeïne in hoge doses (>400mg/dag)

**Alle overige items: 0 (groen)** tenzij specifiek onderzoek anders aangeeft.

**Evidence-default:** B of C. Score = 3 vereist evidence ≥ B met expliciete bron.

### 2.3 Nierstenen (calciumoxalaat — meest voorkomend)

**Primaire bron:** Harvard Oxalate Table 2023 (UAB Knight Lab).
**Aanvullend:** USDA FDC voor natrium/calcium, AUA Guideline, EAU Urolithiasis.

**Drempels (mg oxalaat per standaardportie):**
- `< 10` → 0
- `10–25` → 1
- `25–50` → 2
- `> 50` → 3

**Modifier:** natrium > 600mg per portie → +1 punt (max 3).

**Verplichte regel-overrides:**
- **Hoge-calciumitems = 0 (groen).** Normale calciuminname (1000–1200mg/dag) *verlaagt* risico (Borghi RCT, AUA-guideline). Lage-calciumdieet NIET adviseren.
- **Vitamine C supplementen = 3.** Omzetting naar oxalaat.
- **Onvoldoende vocht-waarschuwing** apart in UI, niet als score per item.

**Evidence-default:** A (Harvard direct) of B.

### 2.4 Histamine-intolerantie

**Bronnen:**
- Primair: **SIGHI Compatibility List 2023** (zie licentie-noot hieronder).
- Kwantitatief: Brazilian systematic review 2024 (343 items met HPLC-data).
- Consensus: Montreux Consensus 2024, DGAKI.

**⚠️ SIGHI LICENTIE-STATUS: AANGEVRAAGD.**
SIGHI vereist schriftelijke toestemming voor commercieel gebruik. Mail door Peter te versturen — zie `acties-peter.md`. Data wordt opgenomen onder voorbehoud (gedocumenteerd in `RISKS.md`).

**Score-overname:** SIGHI 0–3 schaal direct toepasbaar.

**Aanvullende velden per item:**
- `liberator: boolean` (citrus, aardbei, tomaat, chocolade, etc.)
- `daoBlocker: boolean` (alcohol, zwarte/groene thee, energy drinks)

**Tegenstrijdigheden expliciet markeren:**
- Citrus: SIGHI labelt vaak hoog, maar San Mauro 2021 (Nutrients) toont dat ~53% van geëxcludeerde voeding geen meetbare histamine heeft. Note toevoegen: *"omstreden — beperkte directe histamine-evidence"*.

**Evidence-default:** B (consensus) of C (anekdotisch). Vrijwel nooit A.

---

## 3. Database schema

Elk item is een TypeScript object dat aan dit Zod-schema voldoet. **CI faalt bij elke afwijking.**

```ts
// src/schemas/item.ts (te genereren in fase 1)
type FoodItem = {
  id: string;                           // USDA FDC ID als primary key
  nevoCode?: string;                    // NL-alias
  name: { nl: string; en: string };
  category: Category;                   // enum, zie 3.1
  scores: {
    jicht:      ScoreObject | null;
    migraine:   ScoreObject | null;
    nierstenen: ScoreObject | null;
    histamine:  ScoreObject | null;
  };
  histamineFlags?: {
    liberator: boolean;
    daoBlocker: boolean;
  };
  meta: {
    addedAt: string;                    // ISO date
    schemaVersion: string;              // semver
    lastReviewed: string;               // ISO date
  };
};

type ScoreObject = {
  score: 0 | 1 | 2 | 3;
  evidence: 'A' | 'B' | 'C' | 'onbekend';
  sources: Source[];                    // minimaal 1
  note?: { nl: string; en?: string };
};

type Source = {
  url: string;                          // moet HTTP 200 returnen in CI
  title: string;
  type: 'database' | 'guideline' | 'review' | 'consensus' | 'meta-analysis';
  accessedAt: string;                   // ISO date
};
```

### 3.1 Toegestane categorieën
`groente | fruit | granen | peulvruchten | noten-zaden | vlees | vis-schaaldieren | zuivel | eieren | dranken-alcohol | dranken-non-alcohol | zoetwaren | sauzen-kruiden | bereid-gerecht | overig`

### 3.2 Bestandsstructuur
Items worden opgeslagen in `src/data/<categorie>.json` (één JSON-bestand per categorie). Alle bestanden samen vormen de database. Geen externe DB voor MVP.

---

## 4. CI Validation Gates

Een PR mag **alleen automatisch mergen** als al deze checks groen zijn. Geen menselijke review-stap.

### 4.1 Schema-checks (verplicht)
1. Zod-validatie op elk item.
2. **Minstens 2 van 4 aandoeningen gescoord** per item (rest mag `null` met `evidence: 'onbekend'`).
3. Elke non-null score heeft `evidence` ∈ {A,B,C} én minstens 1 source.
4. Elke source-URL: HTTP HEAD/GET geeft 200 (cached, timeout 10s).
5. `id` is een geldige USDA FDC ID (numeriek) OF prefix `nl-` voor NL-specifieke items zonder FDC-equivalent.

### 4.2 Regression-tests (achterhaalde aannames)
6. **Koffie-items jicht ≤ 1.** (geen rood)
7. **Chocolade migraine ≠ 3.** (max oranje, met note)
8. **Hoge-calcium items (>200mg/100g) nierstenen ≤ 1.** (geen oranje/rood vanwege calcium alleen)

### 4.3 Whitelist-check
9. Migraine score = 3 alleen voor stoffen op de migraine-whitelist (sectie 2.2).

### 4.4 Bron-kwaliteit
10. Score = 3 vereist evidence ≥ B.
11. Evidence A alleen toegestaan bij verwijzing naar USDA, Harvard Oxalate Table, NEVO, of peer-reviewed meta-analyse.

### 4.5 Code-checks
12. TypeScript: `tsc --noEmit` zonder errors.
13. ESLint zonder errors.
14. Vitest unit tests groen.
15. Playwright e2e tests groen (golden paths: onboarding, zoeken, profielwissel, menuscan, bronnenexport).
16. Bundle size budget niet overschreden.

### 4.6 Auto-merge regel
Als alle 16 checks groen zijn én PR-author is in `trusted-authors.json` (Cowork bot + Claude Code service account) → **auto-merge**. Anders blijft PR open en stuurt CI Sentry-melding naar Peter.

---

## 5. Ruggengraat-bronnen (verplicht in `sources[]` waar van toepassing)

| Aandoening | Primair | Aanvullend |
|---|---|---|
| Jicht | USDA Purine DB 2.0 (CC0) | Kaneko HPLC, EULAR 2022 |
| Nierstenen | Harvard Oxalate Table 2023 | USDA FDC, AUA Guideline |
| Histamine | SIGHI 2023 (licentie pending) | Brazilian SR 2024, Montreux Consensus |
| Migraine | Hindiyeh 2020 SR | AMF, Migraine Trust, RCTs |
| Algemeen | USDA FoodData Central | NEVO 2025 (NL-aliassen) |

---

## 6. Cowork-instructies

**MAG:**
- Nieuwe items voorstellen + scoren (alle 4 aandoeningen overwegen).
- Bestaande items aanvullen waar scores `null` zijn.
- Bronnen ophalen + valideren.
- PR openen naar `main` met data-changes.

**MAG NIET:**
- Bestaande scores wijzigen tenzij regel in CLAUDE.md is gewijzigd.
- Drempels of regel-overrides aanpassen (alleen Peter via CLAUDE.md update).
- Items committen zonder bronvermelding.
- Score = 3 toekennen aan iets buiten de whitelist (migraine).
- Direct naar main pushen — altijd via PR.

**MOET:**
- Per item alle 4 aandoeningen overwegen, expliciet `null` markeren waar data ontbreekt.
- Minstens 1 ruggengraat-bron citeren per score.
- Engelstalige én Nederlandstalige bronnen overwegen (internationale schaalbaarheid).
- Batches van ~25 items per PR (CI-doorvoer + leesbare diff).

---

## 7. Database-groeitarget

| Fase | Items | Focus | Termijn |
|---|---|---|---|
| 1 | 150 | Sweet spot — alle 4 aandoeningen scorebaar | 1–2 weken |
| 2 | 300 | NL-supermarkt dekking | 4–6 weken |
| 3 | 500 (bereikt) | Voltooien USDA Purine + Harvard Oxalate | afgerond |
| 4 | 700 (cap) | Ontbrekende categorieën: eieren, bereid-gerecht, vis-schaaldieren | lopend |

**Boven 700 items: NIET groeien.** Boven dit aantal zijn alleen nog USDA Branded Foods beschikbaar, waar 50%+ geen purine-/oxalaat-/histaminedata heeft. Kwaliteit > kwantiteit. Cap verhoogd van 500 → 700 op 2026-05-18 om ruimte te maken voor de categorieën eieren, bereid-gerecht en vis-schaaldieren (akkoord: Peter Wolterman).

---

## 8. Profielkoppeling (gebruikersgericht)

Het actieve profiel (1+ gekozen aandoeningen) is **leidend voor alle weergave**:

- **Zoek:** toont alleen scores voor gekozen aandoeningen.
- **Menuscan:** Anthropic API-prompt bevat het profiel; AI scoort alleen voor déze gebruiker.
- **Bronnen pagina:** filtert op aandoeningen + toont gemeenschappelijke methodologie.
- **Export:** bevat alleen relevante aandoeningen.

Profiel opgeslagen in `localStorage`. Aanpasbaar via Instellingen. Geen accountverplichting voor MVP.

### Combinatie-score
Bij meerdere aandoeningen:
- Gecombineerde score = `max(actieve scores)`
- **Maar:** als er conflict is (bv. groen voor de één, rood voor de ander), UI toont expliciet **"⚠ tegenstrijdig: zie details"** + per aandoening uitsplitsing.
- Niet wegmiddelen. Gebruiker moet conflict zien.

---

## 9. Tech stack & architectuur

### Stack
- **Frontend:** Vite + React + TypeScript
- **Styling:** TailwindCSS
- **State:** React state + localStorage (MVP)
- **i18n:** `i18next` — NL default, EN-keys vanaf dag 1 voorbereid
- **Validatie:** Zod (compile-time + runtime)
- **Tests:** Vitest (unit), Playwright (e2e)
- **Hosting:** Vercel (static + serverless functions)
- **Error tracking:** Sentry (gratis tier)
- **Analytics:** Plausible EU (privacy-friendly, geen cookie banner nodig)
- **CI/CD:** GitHub Actions → Vercel auto-deploy
- **Repo structuur:** zie sectie 11

### Principes
1. **Database = single source of truth** (JSON in repo, versioned via git).
2. **USDA FDC ID = primary key.** NEVO-code als alias-veld.
3. **API key NOOIT client-side.** Anthropic calls via `api/menuscan.ts` (Vercel function).
4. **Rate limiting** op menuscan endpoint: 12 scans/uur per IP via **Supabase** (`rate_limits` tabel, EU-regio). Geen magic link of wachtwoord — open maar gelimiteerd. Budget cap op Anthropic dashboard als financiële achtervang (acties-peter.md A-5).
5. **Geen auth op menuscan voor MVP.** Magic link was overwogen maar vervangen door IP-rate-limiting (eenvoudiger, geen account-verplichting). Bij accounts later: rate limiting per gebruiker i.p.v. per IP (zie RISKS.md R-007).
6. **i18n hooks vanaf dag 1** — alle UI-strings via `t()`.
7. **Print-stylesheet voor PDF export** — geen PDF-library nodig.
8. **PWA-manifest** vanaf dag 1 — homescreen-installatie op iPhone werkt.

---

## 10. Disclaimer & compliance

### MDR-status
**In onderzoek door Peter.** Tot uitsluitsel: app gedraagt zich conservatief en presenteert zich expliciet als *informatieve beslishulp*, niet als medisch hulpmiddel.

### Verplichte UX-elementen
- **Onboarding-disclaimer:** vóór eerste gebruik, vereist expliciet akkoord (checkbox).
  - Tekst: *"Deze app biedt informatie als hulp bij voedingskeuzes, geen medisch advies. Overleg met arts of diëtist bij twijfel of klachten."*
- **Footer:** disclaimer-link op elk scherm.
- **Methodologie-pagina:** exporteerbaar (print → PDF) zodat gebruiker kan tonen aan arts/diëtist welke bronnen gebruikt zijn.
- **Per-score evidence-badge:** A/B/C zichtbaar — gebruiker ziet altijd wat de onderbouwing is.

---

## 11. Repo structuur

```
voedingsapp/
├── CLAUDE.md                    # dit bestand — operationeel handboek
├── RISKS.md                     # open risico's (SIGHI, MDR, migraine-evidence)
├── acties-peter.md              # Peters actiepunten (concreet, kort)
├── README.md                    # publiek leesbaar overzicht
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── .env.example                 # ANTHROPIC_API_KEY, SENTRY_DSN, etc.
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/                    # database JSON per categorie
│   │   ├── groente.json
│   │   ├── fruit.json
│   │   └── ...
│   ├── schemas/
│   │   └── item.ts              # Zod schema's
│   ├── components/              # UI-componenten
│   ├── pages/                   # zoek, scan, bronnen, instellingen, onboarding
│   ├── lib/                     # scoring, profielkoppeling, export
│   ├── i18n/
│   │   ├── nl.json
│   │   └── en.json
│   └── styles/                  # incl. print.css
├── api/
│   ├── menuscan.ts              # Anthropic proxy + rate limit + auth
│   └── auth.ts                  # magic link
├── tests/
│   ├── unit/                    # Vitest
│   └── e2e/                     # Playwright
├── scripts/
│   ├── validate-db.ts           # gebruikt in CI
│   └── check-sources.ts         # URL-bereikbaarheid
├── trusted-authors.json         # PR auto-merge whitelist
└── .github/workflows/
    ├── ci.yml                   # lint, types, unit, e2e, db-validate, source-check
    ├── auto-merge.yml           # merge bij groen + trusted author
    └── deploy.yml               # Vercel deploy (auto bij merge main)
```

---

## 12. Tegenstrijdige bronnen — vastgestelde weging

Deze weging is **definitief** tenzij CLAUDE.md wordt aangepast. Cowork mag hier niet van afwijken zonder voorstel naar Peter.

| Onderwerp | Conflict | Onze weging | Reden |
|---|---|---|---|
| Koffie ↔ jicht | Oude richtlijnen: rood. Recent: beschermend. | **Groen** | Shirai 2022 MR, meta-analyse 2025 |
| Citrus ↔ histamine | SIGHI: hoog. San Mauro 2021: lage evidence. | **Oranje + note "omstreden"** | Beperkte directe histamine-data |
| Calcium ↔ nierstenen | Oud advies: laag Ca. Modern: normaal Ca. | **Groen bij normale inname** | Borghi RCT, AUA-guideline |
| Chocolade ↔ migraine | Trigger-lijsten: rood. 2023 SR: prodroom-craving. | **Oranje + note** | Hindiyeh 2020, recente SR |
| Peulvruchten ↔ jicht | Hoog purine. Geen verhoogd risico. | **Oranje max** | EULAR 2022 |

---

## 13. Open risico's

Zie `RISKS.md` voor volledig overzicht. Bij goedkeuring CLAUDE.md erkend:
- SIGHI commerciële licentie nog niet bevestigd → data opgenomen onder voorbehoud.
- MDR-classificatie nog niet bepaald → app gedraagt zich conservatief.
- Migraine evidence inherent zwak → gemitigeerd via lage drempels voor score=3 en zichtbare evidence-badges.

---

## 14. Versiebeheer van dit document

- **Schema version:** v1.2
- **Laatste wijziging:** 2026-05-18
- **Wijzigingen:** alleen door Peter, met expliciete akkoordregistratie in commit message.
  - v1.1 (2026-05-15): §9 principes 4+5 — rate limiting via Supabase i.p.v. Vercel KV/Upstash; magic link auth vervangen door IP-limiet. Akkoord: Peter Wolterman (chat 2026-05-15).
  - v1.2 (2026-05-18): §7 database-cap verhoogd van 500 → 700 voor ontbrekende categorieën (eieren, bereid-gerecht, vis-schaaldieren). Fase 4 toegevoegd. Akkoord: Peter Wolterman (chat 2026-05-18).
