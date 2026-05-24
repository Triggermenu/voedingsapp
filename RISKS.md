# RISKS.md — Open risico's Voedingsapp

> Risicoregister. Bij elke wijziging in CLAUDE.md hercontroleren.
> Sentry stuurt alerts naar Peter bij runtime-incidenten gerelateerd aan deze risico's.

---

## R-001 · SIGHI-licentie (commercieel gebruik)

| Veld | Waarde |
|---|---|
| **Aard** | Juridisch / IP |
| **Status** | Aangevraagd (mail door Peter te versturen — zie acties-peter.md) |
| **Impact** | Hoog — zonder toestemming geen rechtmatig gebruik van SIGHI Compatibility List |
| **Waarschijnlijkheid** | Laag-middel — SIGHI is gewend aan licentie-aanvragen |
| **Mitigatie** | Histamine-data opgenomen onder voorbehoud. Bij weigering: data terugtrekken (feature flag `HISTAMINE_ENABLED=false` schakelt aandoening + alle items uit binnen 1 release) |
| **Eigenaar** | Peter |
| **Deadline** | Vóór publieke launch (live URL met productiedomein) |
| **Tracking** | acties-peter.md (concept-mail klaar) |

---

## R-002 · MDR-classificatie

| Veld | Waarde |
|---|---|
| **Aard** | Juridisch / regulatoir (EU Medical Device Regulation 2017/745) |
| **Status** | In onderzoek door Peter |
| **Impact** | Hoog — als app als medisch hulpmiddel kwalificeert (klasse I/IIa), zijn CE-markering en notified-body-procedure vereist |
| **Waarschijnlijkheid** | Middel — beslishulp voor gediagnosticeerde aandoeningen valt in grijs gebied; uitsluitend "lifestyle"-claim kan helpen |
| **Mitigatie** | App positioneert zich expliciet als *informatieve beslishulp*. Disclaimer verplicht vóór gebruik. Geen diagnose, geen behandeladvies, geen monitoring. Methodologie transparant. |
| **Eigenaar** | Peter (extern advies in te winnen bij IGJ of MDR-jurist) |
| **Deadline** | Vóór publieke launch + actieve werving van gebruikers |
| **Tracking** | acties-peter.md |

---

## R-003 · Migraine — inherent zwakke evidence

| Veld | Waarde |
|---|---|
| **Aard** | Wetenschappelijk / inhoudelijk |
| **Status** | Geaccepteerd risico, gemitigeerd |
| **Impact** | Middel — onjuiste scores kunnen valse zekerheid geven |
| **Waarschijnlijkheid** | Hoog — domein heeft fundamenteel weinig kwantitatieve data |
| **Mitigatie** | 1) Score = 3 alleen voor whitelist (alcohol, MSG, gerijpte kaas, gecureerd vlees) — CI-gate bewaakt. 2) Evidence-badge (B/C) zichtbaar bij elke migraine-score. 3) Tegenstrijdigheden expliciet getoond. 4) Conservatieve default (groen tenzij bewijs). |
| **Eigenaar** | Claude Code (via CLAUDE.md regels) |
| **Deadline** | n.v.t. — doorlopend |
| **Tracking** | CLAUDE.md §2.2 + CI gate §4.3 |

---

## R-004 · Menuscan AI-betrouwbaarheid

| Veld | Waarde |
|---|---|
| **Aard** | Productrisico |
| **Status** | Geaccepteerd, gemitigeerd |
| **Impact** | Middel-hoog — verkeerde score op restaurantgerecht kan dagenlange klachten geven (vooral histamine) |
| **Waarschijnlijkheid** | Middel — AI kan verborgen ingrediënten (MSG, gerijpte kaas in saus, gefermenteerde sojasaus) missen |
| **Mitigatie** | 1) Prompt instrueert tot voorzichtigste interpretatie bij twijfel. 2) Bij onzekerheid resultaat = oranje + "vraag ober" i.p.v. groen. 3) Per-gerecht disclaimer over bereidingsvariaties. 4) Rate limiting (12 scans/uur per IP via Supabase) tegen misbruik. |
| **Eigenaar** | Claude Code (prompt design + UI fallbacks) |
| **Deadline** | n.v.t. — doorlopend |
| **Tracking** | api/menuscan.ts + Playwright e2e |

---

## R-005 · Anthropic API-kosten (misbruik)

| Veld | Waarde |
|---|---|
| **Aard** | Operationeel / financieel |
| **Status** | Gemitigeerd |
| **Impact** | Middel — onverwachte rekening bij scraping/abuse |
| **Waarschijnlijkheid** | Laag bij implementatie van mitigaties |
| **Mitigatie** | 1) Rate limiting: 12 scans/uur per IP via Supabase (`rate_limits` tabel). 2) Hard budget cap op Anthropic dashboard. 3) Sentry alert bij ongebruikelijke pieken. 4) Faalt "open" bij Supabase-storing — budget cap is de financiële achtervang. |
| **Eigenaar** | Claude Code (implementatie) + Peter (budget-cap instellen) |
| **Deadline** | Vóór publieke URL |
| **Tracking** | acties-peter.md (budget cap) + api/menuscan.ts |

---

## R-006 · Database-kwaliteit zonder PR-review

| Veld | Waarde |
|---|---|
| **Aard** | Procesrisico — fundamenteel voor dit project |
| **Status** | Gemitigeerd via strikte CI gates |
| **Impact** | Hoog — slechte scores ondermijnen het product |
| **Waarschijnlijkheid** | Middel zonder mitigatie |
| **Mitigatie** | 16 CI gates (CLAUDE.md §4) blokkeren slechte data automatisch. Sentry meldt CI-failures aan Peter. Eerste 50 items optioneel "Peter sanity check"; daarna volledig autonoom. |
| **Eigenaar** | CI (geautomatiseerd) + Sentry → Peter (escalatie) |
| **Deadline** | n.v.t. — doorlopend |
| **Tracking** | .github/workflows/ci.yml |

---

## R-007 · AVG/GDPR — verwerking gezondheidsgegevens

| Veld | Waarde |
|---|---|
| **Aard** | Juridisch / privacy (AVG / GDPR, art. 9 bijzondere persoonsgegevens) |
| **Status** | Open — niet eerder geregistreerd |
| **Impact** | Hoog — gekozen aandoeningen zijn gezondheidsgegevens; verwerking zonder geldige grondslag is onrechtmatig |
| **Waarschijnlijkheid** | Zeker — de menuscan verwerkt nu al `conditions` + foto naar Vercel én Anthropic (VS) |
| **Mitigatie** | 1) Privacyverklaring (NL) vóór launch. 2) Aparte uitdrukkelijke toestemming voor menuscan, los van de medische disclaimer. 3) Verwerkersovereenkomsten met Vercel, Anthropic, Sentry, Supabase (en Resend bij accounts). 4) Anthropic Zero Data Retention aanzetten. 5) Sentry-scrubbing: geen foto/aandoening in error logs. 6) Supabase + Vercel in EU-regio. 7) Dataminimalisatie: foto niet bewaren na scan. 8) Bij accounts: DPIA + betrokkenenrechten (inzage/export/verwijdering) + leeftijdscheck (16+). 9) Datalek-meldprocedure (72u → Autoriteit Persoonsgegevens). |
| **Eigenaar** | Peter (juridisch: privacyverklaring, DPA's, evt. jurist-consult) + Claude Code (technische maatregelen) |
| **Deadline** | Basismaatregelen vóór publieke launch; DPIA + rechten vóór accounts live |
| **Voortgang (technisch, 2026-05-24)** | ✅ Mitigatie 2 (aparte menuscan-consent vóór scan, `ScanConsentGate`), 5 (Sentry-scrubbing: replay `maskAllText`/`blockAllMedia` + `beforeSend` strip request-data/menuscan-breadcrumb), 7 (foto niet server-side bewaard — passthrough; client revoke object-URL), en deels 6 (Vercel-functies gepind op `fra1`/Frankfurt). **Nog open (Peter):** 1 privacyverklaring-tekst, 3 DPA's, 4 Anthropic ZDR, 6 Supabase EU-regio, 9 datalek-procedure. |
| **Tracking** | acties-peter.md A-7 |

---

## R-008 · Methodologische governance — enkele auteur

| Veld | Waarde |
|---|---|
| **Aard** | Proces / wetenschappelijk-methodologisch |
| **Status** | Open — erkend, gemitigeerd via transparantie |
| **Impact** | Middel-hoog — alle scoringsregels, drempels, paradigma-precedenten en bronwegingen berusten op één auteur (Peter) zonder externe domein-expert-validatie (diëtist/arts/toxicoloog). Een bias of blinde vlek propageert ongecontroleerd door de hele database. |
| **Waarschijnlijkheid** | Zeker — er is per definitie geen tweede beoordelaar. |
| **Mitigatie** | 1) Volledig auditeerbaar besluitspoor: CLAUDE.md §12 (bronweging) + §13 (paradigma-precedenten) maken elke afwijking van klassieke richtlijnen expliciet en herleidbaar. 2) Per-score evidence-badge (A/B/C) + `confidence`-veld tonen de onderbouwing. 3) Exporteerbare methodologie-pagina (§10) zodat arts/diëtist de keuzes kan controleren. 4) Conservatieve defaults (groen tenzij bewijs; score-3-whitelist). **NB:** dit vervangt géén externe peer-review — bij opschaling/commercieel gebruik is een eenmalige externe methodologie-review per aandoening aan te bevelen (geen fictieve reviewlaag in de docs opvoeren). |
| **Eigenaar** | Peter |
| **Deadline** | Externe review aanbevolen vóór commercieel gebruik / actieve werving |
| **Tracking** | CLAUDE.md §12 + §13; deze entry |

---

## R-009 · UX — populatie- vs individuniveau-misinterpretatie

| Veld | Waarde |
|---|---|
| **Aard** | Productrisico / UX |
| **Status** | Open — gedeeltelijk gemitigeerd |
| **Impact** | Middel — gebruiker kan een stoplicht lezen als een individueel medisch verdict ("rood = ik moet dit vermijden", "groen = veilig voor mij"), terwijl scores populatie-inschattingen zijn. Vooral riskant bij migraine (subgroep-/individueel-variabele triggers) en histamine (sterke individuele drempelverschillen). |
| **Waarschijnlijkheid** | Hoog — de stoplichtmetafoor nodigt uit tot een binair-persoonlijke lezing. |
| **Mitigatie** | 1) Per-score evidence/confidence-badges zichtbaar. 2) `triggerType`-classificatie (§2.2.1) maakt subgroep-/individueel-/context-variabiliteit expliciet. 3) UI toont bij migraine-scores met een variabele-respons-`triggerType` een expliciete hint "respons verschilt per persoon" (ItemDetailPanel). 4) Verplichte disclaimer vóór gebruik (§10): informatieve beslishulp, geen medisch advies. 5) Tegenstrijdige scores expliciet getoond (§8) i.p.v. weggemiddeld. **NB:** het product blíjft een snelle keuze-ondersteuning (§1) — de mitigatie maakt de populatie-aard zichtbaar zónder de beslishulp-functie uit te hollen tot "alleen hypothesegeneratie". |
| **Eigenaar** | Claude Code (UI/mitigatie) + Peter (disclaimer/positionering) |
| **Deadline** | Doorlopend; herzien vóór publieke launch |
| **Tracking** | ItemDetailPanel.tsx + CLAUDE.md §8/§10; deze entry |

---

## Niet-risico's (expliciet genoemd, doelbewust geen mitigatie)

- **Geen account / cloud sync (MVP).** Profiel in localStorage — blijft op het apparaat van de gebruiker, gaat niet naar een server. Laag AVG-risico. Migratie naar accounts later mogelijk zonder breaking changes (zelfde schema), maar verhoogt het AVG-risico — zie R-007.
- **Geen offline mode.** Vercel CDN + service worker mogelijk later. Niet kritiek voor MVP.
- **Geen 24/7 monitoring.** Sentry + Plausible volstaan. Geen oncall.

---

## Beoordelingsritme
RISKS.md hercontroleren bij:
- Elke CLAUDE.md-wijziging
- Mijlpaal: 150 items, 300 items, publieke launch
- Bij Sentry-incident gerelateerd aan een risico
