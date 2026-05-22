# Notities bereid-gerecht categorie

Bereid-gerecht is een **categorie** (samengestelde gerechten), geen pathway-cluster zoals cluster 1-20.
Scoring is afgeleid van ingrediënt-pathways (purine, nitriet, biogene aminen, MSG) — geen eigen cluster-onderzoek.

## Wijzigingen

**2026-05-21:** `nl-shoarma` en `nl-frikandel` triggerType `subgroep-bevestigd` → `context-afhankelijk`.
Reden: ingrediëntenmix verschilt per producent/keten (nitriet en/of MSG aanwezig of niet); trigger-status is product-bepaald, niet persoon-subgroep-bepaald. Consistent met het gebruik van `context-afhankelijk` in cluster 7 voor product-/etiketafhankelijke items (prosciutto, gekookte ham, gerookte kip).

### Bekende vervolgactie (buiten scope opruim-PR 2026-05-21)

De migraine-bronnen van beide items zijn momenteel Finberg 2022 (PMC9172554, een tyramine/MAO-inhibitor-review) + Hindiyeh 2020. Deze onderbouwen de tyramine-pathway, niet de nitriet/MSG-pathway die in de note beschreven staat. Bron/mechanisme matchen dus niet. Bronvervanging — nitriet → cluster 7-bronnen (Henderson & Raskin 1972, Zhong 2022 residu-data); MSG → cluster 18-bronnen (Geha 2000, Obayashi 2016) — staat gepland voor een aparte PR.
