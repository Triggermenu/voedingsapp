# Menuscan — uitleg voor diëtisten

> Leesbare uitleg van hoe de menuscan werkt en hoe we de kwaliteit ervan toetsen.
> Bedoeld om te delen met een diëtist/arts. Begrijpelijk zonder de code te lezen.
> Hoort bij `methodologie.md` (de scoringsmethode zelf) en het ontwerp in `menuscan-herontwerp.md`.

---

## 1. Wat de menuscan doet — en wat níét

Een gebruiker maakt een foto van een menukaart. De app toont per gerecht een stoplicht
(groen/oranje/rood) voor de aandoening(en) in zijn profiel (jicht, migraine, nierstenen,
histamine-intolerantie).

**Het cruciale punt:** de *kleuren komen niet uit de AI*. De AI doet alleen **herkenning** —
welke gerechten en welke hoofdingrediënten staan er op de kaart. De **beoordeling komt uit
onze eigen, bronvermelde database** (dezelfde die de zoekfunctie van de app gebruikt). De
menuscan is dus *informatie opzoeken*, geen AI die een gezondheidsoordeel verzint.

Dit is bewust zo gebouwd: het maakt elke kleur herleidbaar tot een bron en een evidence-niveau
(A/B/C), net als in de rest van de app. Het is ook de voorzichtigste keuze richting de
medische-hulpmiddel-vraag (de app informeert, diagnosticeert niet).

## 2. De vier stappen (de "hybride" pijplijn)

| Stap | Wie | Wat |
|---|---|---|
| **A. Herkennen** | AI (beeld) | Per gerecht de naam + waarschijnlijke hoofdingrediënten aflezen |
| **B. Matchen** | Vaste regels | Elk ingrediënt koppelen aan een item in de database |
| **C. Samenvoegen** | Vaste regels | Per aandoening het **ongunstigste** ingrediënt bepaalt de gerecht-kleur |
| **D. Tonen** | App | Stoplicht + welk ingrediënt de kleur veroorzaakt + bron + onbekend-melding |

**Samenvoegen (stap C) = de voorzichtige regel.** De gerecht-kleur is de hoogste (slechtste)
score van de herkende ingrediënten — niet een gemiddelde. Een verder onschuldig gerecht met
één probleem-ingrediënt krijgt dus de kleur van dat ene ingrediënt, en de app benoemt welk
ingrediënt dat is ("oranje — door parmezaanse kaas"). Zo middelt een risico nooit weg.

## 3. Hoe het matchen werkt (stap B)

Menukaart-taal ("gerookte runderbiefstuk", "parmezaanse kaas") wijkt af van de itemnamen in de
database. We koppelen in vaste, controleerbare lagen:

1. **Aliassen** — een vaste vertaaltabel, bijv. "parmezaanse kaas" → *Parmezaan*,
   "runderbiefstuk" → *Runderbiefstuk (mager)*.
2. **Exacte naam** (incl. meervoud/enkelvoud) — "champignons" → *Champignons*.
3. **Token** — de langste herkenbare basisnaam die in het ingrediënt voorkomt.
4. **Representatief (benadering, ≈)** — een generieke term naar een representatief item, bijv.
   "kaas" → *Goudse kaas (jong)*, "friet" → *Aardappel (gekookt)*. Dit is **expliciet een
   benadering** en wordt in de app ook zo gemarkeerd (≈), omdat de échte kaas/aardappel een
   ander type kan zijn en bereiding (frituren, suiker) niet wordt meegenomen.

**Geen match = "onbekend → vraag de ober".** Er wordt **nooit** een score geraden. Wat we niet
betrouwbaar kunnen koppelen (samengestelde sauzen, onbekende ingrediënten) krijgt geen kleur,
maar een nette ober-vraag. Liever eerlijk "weet ik niet" dan een valse groene kleur.

**Dekkingsdrempel.** Herkennen we minder dan de helft van de ingrediënten van een gerecht, dan
tonen we géén gerecht-totaal ("te onzeker — vraag de ober"). Boven die drempel tonen we de
kleur mét het werkelijke dekkingspercentage.

## 4. Hoe we de kwaliteit toetsen — reproduceerbaar

We meten de matching op **echte menukaarten van internet**. De geëxtraheerde kaarten staan
vast in de repo (`scripts/menuscan-menus/*.json`, met bron-URL), zodat iedereen exact dezelfde
toets kan herhalen:

```
npm run menuscan:eval
```

Dit draait de échte matching- en samenvoeg-code op alle vastgelegde kaarten en schrijft een
rapport naar [`menuscan-eval-report.md`](menuscan-eval-report.md). Het rapport is
**deterministisch** (geen datums/toeval): dezelfde kaarten + dezelfde database geven een
identiek rapport. Het toont per gerecht: welk ingrediënt aan welk database-item is gekoppeld
(en via welke laag), de kleuren per aandoening, de dekking, en onderaan een lijst van alle
**onbekende ingrediënten** — dat is meteen de werklijst voor nieuwe aliassen.

## 5. Stand van zaken (laatste toets: 3 kaarten)

Getoetst op drie bewust verschillende kaarten: een moderne brasserie, een fine-dining-kaart en
een traditioneel-Hollandse kaart.

- **Dekking: 107 van 123 ingrediënten (87%).** Begon op 75% en is verbeterd door aliassen toe
  te voegen die uit de toets naar voren kwamen.
- De uitkomsten zijn inhoudelijk consistent met de methodologie, bijv.:
  - *gerookte paling/zalm* → jicht en histamine hoog (purine + gerijpt/gerookt);
  - *katenspek/spek* → migraine en histamine rood (gecureerd vlees, nitriet);
  - *zuurkool* → histamine rood (fermentatie);
  - *geitenkaas-kroketjes* → te weinig herkend → géén kleur, "vraag de ober".

**Wat bewust onbekend blijft (correct gedrag, geen fout):**
- Samengestelde sauzen zonder eigen database-item (bearnaise-, hollandaise-, ponzusaus).
- Samengestelde happen (bitterbal, risotto).
- Vage verzameltermen ("groente", "salade").

**Echte database-gaten die de toets blootlegde** (kandidaten om ooit toe te voegen — beslissing
ligt bij de eigenaar; de database heeft een bewuste omvang-grens):
- *geitenkaas*, *nori/zeewier*, *tuinboon*, *sugarsnaps/peultjes*, *gans/eendenlever*.

## 6. Belangrijke kanttekeningen voor de diëtist

- De kleuren zijn **populatie-inschattingen** uit de database, geen individueel advies. De app
  toont evidence-niveau en bron per item; individuele respons varieert (vooral migraine en
  histamine).
- De menuscan kan **verborgen ingrediënten missen** (een saus, een bouillon). Daarom de
  ober-vragen en de conservatieve "onbekend"-afhandeling.
- **Bereiding** (frituren, roken, fermenteren) verandert de score. Waar de database een bereide
  variant kent (bijv. *Gerookte zalm*) gebruiken we die; anders vangt de ober-vraag het op.
- Een "≈ representatief"-koppeling is een **benadering** en is in de app als zodanig herkenbaar.
