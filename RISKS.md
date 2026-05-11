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
| **Mitigatie** | 1) Prompt instrueert tot voorzichtigste interpretatie bij twijfel. 2) Bij onzekerheid resultaat = oranje + "vraag ober" i.p.v. groen. 3) Per-gerecht disclaimer over bereidingsvariaties. 4) Rate limiting + magic link tegen misbruik. |
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
| **Mitigatie** | 1) Magic link auth (geen open endpoint). 2) Rate limit per user (Vercel KV/Upstash). 3) Hard budget cap op Anthropic dashboard. 4) Sentry alert bij ongebruikelijke pieken. |
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

## Niet-risico's (expliciet genoemd, doelbewust geen mitigatie)

- **Geen account / cloud sync (MVP).** Profiel in localStorage. Acceptabel voor MVP. Migratie naar accounts later mogelijk zonder breaking changes (zelfde schema).
- **Geen offline mode.** Vercel CDN + service worker mogelijk later. Niet kritiek voor MVP.
- **Geen 24/7 monitoring.** Sentry + Plausible volstaan. Geen oncall.

---

## Beoordelingsritme
RISKS.md hercontroleren bij:
- Elke CLAUDE.md-wijziging
- Mijlpaal: 150 items, 300 items, publieke launch
- Bij Sentry-incident gerelateerd aan een risico
