import { useTranslation } from 'react-i18next'
import { printBronnen } from '@/lib/export'
import { getDatabaseStats } from '@/lib/db'
import { NavBar } from '@/components/NavBar'

const CONFLICTING = [
  { subject: 'Koffie bij jicht', text: 'Oudere richtlijnen waarschuwden. Recente Mendelian-randomization studies (Shirai 2022, meta-analyse 2025) tonen beschermend effect. Onze weging: groen.' },
  { subject: 'Citrus bij histamine', text: 'SIGHI labelt citrus als hoog-risico. San Mauro 2021 (Nutrients) toont dat dit voor veel patiënten niet evidence-based is. Onze weging: oranje + noot "omstreden".' },
  { subject: 'Calcium bij nierstenen', text: 'Oud advies: weinig calcium eten. Modern bewijs (Borghi RCT, AUA-richtlijn): normale calciuminname verlaagt het risico. Onze weging: calciumrijke items groen.' },
  { subject: 'Chocolade bij migraine', text: 'Klassieke triggerlijsten zetten chocolade op rood. Recente systematic review (2023) suggereert prodroom-craving. Onze weging: oranje + noot.' },
  { subject: 'Peulvruchten bij jicht', text: 'Peulvruchten bevatten relatief veel purine. EULAR 2022 stelt dat epidemiologisch geen verhoogd risico aangetoond is. Onze weging: maximaal oranje.' },
]

const SECTIONS = [
  {
    key: 'jicht',
    color: 'bg-amber-50 border-amber-200',
    text: 'Scores zijn gebaseerd op het purinegehalte per 100g (bron: USDA Purine Database 2.0, 2025). Drempels: <50mg = groen, 50-100mg = geel, 100-200mg = oranje, >200mg = rood. Alcohol scoort altijd rood (lactaat-competitie). Koffie scoort groen op basis van recente Mendelian-randomization studies. Peulvruchten scoren maximaal oranje (EULAR 2022).',
    sources: [
      { label: 'USDA Purine Database Release 2.0 (2025)', url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf' },
      { label: 'EULAR 2022 Gout Guidelines', url: 'https://ard.bmj.com/content/81/11/1452' },
      { label: 'Shirai et al. 2022 — Coffee & urate (MR)', url: 'https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/acr2.11425' },
    ],
  },
  {
    key: 'migraine',
    color: 'bg-purple-50 border-purple-200',
    text: 'Migraine is het domein met de minste evidence. Score 3 (rood) is alleen toegekend aan stoffen met enige RCT/cohort-onderbouwing: alcohol (rode wijn), MSG, gerijpte kaas (>6 maanden), gecureerd vlees (nitriet). Chocolade scoort oranje. Evidence-niveau bij migraine is vrijwel altijd B of C.',
    sources: [
      { label: 'Hindiyeh et al. 2020 — Diet and Headache (SR)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/' },
    ],
  },
  {
    key: 'nierstenen',
    color: 'bg-blue-50 border-blue-200',
    text: 'Scores zijn gebaseerd op oxalaatgehalte per standaardportie (bron: Harvard Oxalate Table 2023). Drempels: <10mg = groen, 10-25mg = geel, 25-50mg = oranje, >50mg = rood. Natrium >600mg/portie = +1. Calcium: hoge inname is gunstig (Borghi RCT, AUA-richtlijn).',
    sources: [
      { label: 'Harvard Oxalate Table 2023 (UAB Knight Lab)', url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx' },
      { label: 'Borghi et al. 2002 — Calcium & kidney stones (RCT)', url: 'https://pubmed.ncbi.nlm.nih.gov/11742412/' },
      { label: 'AUA Medical Management of Kidney Stones Guideline', url: 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-medical-mangement-guideline' },
    ],
  },
  {
    key: 'histamine',
    color: 'bg-orange-50 border-orange-200',
    text: 'Scores zijn gebaseerd op de SIGHI Compatibility List 2023, aangevuld met de Brazilian systematic review 2024 (343 items met HPLC) en het Montreux Consensus. Citrus staat aangemerkt als omstreden. Evidence-niveau is vrijwel altijd B of C. SIGHI-licentie: commercieel gebruik is aangevraagd.',
    sources: [
      { label: 'SIGHI Food Compatibility List 2023', url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf' },
      { label: 'Brazilian SR — Histamine in Foods 2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12620675/' },
      { label: 'San Mauro 2021 — Low-histamine diet critique', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8143338/' },
    ],
  },
]

export function Bronnen() {
  const { t } = useTranslation()
  const stats = getDatabaseStats()

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24 print:pb-0">
      {/* Header */}
      <div className="px-4 pt-safe pt-6 pb-4 border-b border-[#e0dfd7] bg-[#f8f7f4]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-base font-medium text-[#1a1a18]">{t('bronnen.title')}</h1>
            <p className="text-xs text-[#73726c] mt-0.5">{t('bronnen.subtitle')}</p>
          </div>
          <button
            onClick={printBronnen}
            className="flex items-center gap-1.5 text-xs text-[#1d9e75] border border-[#1d9e75] rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition-colors print:hidden"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('bronnen.export')}
          </button>
        </div>
        <p className="text-xs text-[#9c9a92] mt-3 print:hidden">{t('bronnen.exportHint')}</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Aandoening sections */}
        {SECTIONS.map(({ key, color, text, sources }) => (
          <div key={key} className={`rounded-xl border p-4 space-y-3 ${color}`}>
            <h2 className="text-sm font-medium text-[#1a1a18]">
              {key.charAt(0).toUpperCase() + key.slice(1)} — scoringsmethodologie
            </h2>
            <p className="text-xs text-[#3d3d3a] leading-relaxed">{text}</p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#5f5e5a]">{t('zoeken.sources')}:</p>
              {sources.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-600 hover:underline print:text-[#3d3d3a]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Tegenstrijdige bronnen */}
        <div className="rounded-xl border border-[#e0dfd7] bg-white p-4 space-y-3">
          <h2 className="text-sm font-medium text-[#1a1a18]">Tegenstrijdige bronnen</h2>
          <div className="space-y-3">
            {CONFLICTING.map((item) => (
              <div key={item.subject} className="border-l-2 border-[#e0dfd7] pl-3">
                <p className="text-xs font-medium text-[#3d3d3a]">{item.subject}</p>
                <p className="text-xs text-[#73726c] mt-0.5 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl border border-[#e0dfd7] bg-white p-4 space-y-2">
          <h2 className="text-sm font-medium text-[#1a1a18]">Disclaimer & scope</h2>
          <p className="text-xs text-[#73726c] leading-relaxed">
            Deze app is een beslishulp op basis van gepubliceerde richtlijnen en wetenschappelijk onderzoek. Het is geen vervanging voor medisch advies. Raadpleeg altijd een arts of diëtist bij twijfel of klachten. De database is niet uitputtend — ontbrekende items zijn gemarkeerd als "geen data".
          </p>
          <div className="pt-2 border-t border-[#e0dfd7] text-xs text-[#9c9a92] space-y-0.5">
            <p>Database: {stats.totalItems} items · Schema versie {stats.schemaVersion}</p>
            <p>MDR-status: in onderzoek · SIGHI-licentie: aangevraagd</p>
          </div>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
