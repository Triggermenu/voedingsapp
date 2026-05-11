import { getDatabaseStats } from '@/lib/db'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'

const SECTIONS = [
  {
    key: 'jicht',
    label: 'Jicht',
    color: 'border-yellow-400',
    scoring: 'Purinegehalte per 100g · USDA 2.0 (2025). <50mg = veilig, >200mg = vermijden.',
    tags: ['USDA', 'peer-reviewed'],
    text: 'Drempels: <50mg = groen, 50–100mg = geel, 100–200mg = oranje, >200mg = rood. Alcohol altijd rood (lactaat-competitie). Koffie groen op basis van Mendelian-randomization studies (Shirai 2022). Peulvruchten max oranje (EULAR 2022).',
    sources: [
      { label: 'USDA Purine Database Release 2.0 (2025)', url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf' },
      { label: 'EULAR 2022 Gout Guidelines', url: 'https://ard.bmj.com/content/81/11/1452' },
      { label: 'Shirai et al. 2022 — Coffee & urate (MR)', url: 'https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/acr2.11425' },
    ],
  },
  {
    key: 'migraine',
    label: 'Migraine',
    color: 'border-yellow-300',
    scoring: 'Score 3 alleen bij stoffen met RCT/cohort-evidence: rode wijn, MSG, gerijpte kaas.',
    tags: ['USDA', 'peer-reviewed'],
    text: 'Migraine heeft de minste evidence. Score 3 (rood) alleen voor: alcohol (rode wijn), MSG, gerijpte kaas (>6 mnd), gecureerd vlees (nitriet). Chocolade scoort oranje — recente systematic review (2023) suggereert prodroom-craving, geen directe trigger. Evidence niveau vrijwel altijd B of C.',
    sources: [
      { label: 'Hindiyeh et al. 2020 — Diet and Headache (SR)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/' },
    ],
  },
  {
    key: 'nierstenen',
    label: 'Nierstenen',
    color: 'border-orange-400',
    scoring: 'Oxalaat per portie · Harvard 2023. Natrium > 600 mg/portie geeft +1.',
    tags: ['USDA', 'peer-reviewed'],
    text: 'Drempels: <10mg = groen, 10–25mg = geel, 25–50mg = oranje, >50mg = rood. Natrium >600mg/portie = +1 punt. Calcium: hoge inname is gunstig (Borghi RCT, AUA-richtlijn) — calciumrijke items scoren groen.',
    sources: [
      { label: 'Harvard Oxalate Table 2023 (UAB Knight Lab)', url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx' },
      { label: 'Borghi et al. 2002 — Calcium & kidney stones', url: 'https://pubmed.ncbi.nlm.nih.gov/11742412/' },
      { label: 'AUA Medical Management of Kidney Stones', url: 'https://www.auanet.org/guidelines-and-quality/guidelines/kidney-stones-medical-mangement-guideline' },
    ],
  },
  {
    key: 'histamine',
    label: 'Histamine',
    color: 'border-red-400',
    scoring: 'SIGHI Compatibility List 2023 + Brazilian SR 2024 (HPLC, 343 items).',
    tags: ['USDA', 'peer-reviewed'],
    text: 'SIGHI 0–3 schaal direct overgenomen. Aangevuld met Brazilian systematic review 2024 (343 items HPLC) en Montreux Consensus. Items getagd als histamineliberator of DAO-blokker. Citrus aangemerkt als omstreden (SIGHI: hoog; San Mauro 2021: niet evidence-based voor ~53%). SIGHI-licentie: commercieel gebruik aangevraagd.',
    sources: [
      { label: 'SIGHI Food Compatibility List 2023', url: 'https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf' },
      { label: 'Brazilian SR — Histamine in Foods 2024', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12620675/' },
      { label: 'San Mauro 2021 — Low-histamine diet critique', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8143338/' },
    ],
  },
]

export function Bronnen() {
  const stats = getDatabaseStats()

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="px-4 pt-safe pt-5 pb-4 border-b border-[#e0dfd7]">
        <div className="flex items-center gap-2 mb-3">
          <Logo size={26} />
          <span className="font-serif font-semibold text-[#1a1a18] text-base">Triggermenu</span>
        </div>
        <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">Bronnen & methodologie</p>
        <h1 className="font-serif text-[1.9rem] leading-[1.15] font-semibold text-[#1a1a18]">
          De wetenschap{' '}
          <em className="not-italic italic text-[#1d9e75]">achter de kleuren</em>.
        </h1>
      </div>

      <div className="px-4 py-4 space-y-3">
        {SECTIONS.map(({ key, label, color, scoring, tags, text, sources }) => (
          <div key={key} className={`bg-white rounded-xl border border-[#e0dfd7] border-l-4 ${color} overflow-hidden`}>
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="font-serif font-semibold text-[#1a1a18]">{label}</p>
                <span className="text-[9px] text-[#9c9a92] tracking-widest uppercase font-medium pt-0.5">Scoring</span>
              </div>
              <p className="text-xs text-[#5f5e5a] leading-relaxed mb-2">{scoring}</p>
              <div className="flex gap-1.5 mb-3">
                {tags.map((t) => (
                  <span key={t} className="text-[10px] bg-[#f0efe8] text-[#73726c] rounded px-2 py-0.5 font-medium">{t}</span>
                ))}
              </div>
              <p className="text-xs text-[#73726c] leading-relaxed border-t border-[#f0efe8] pt-3">{text}</p>
              <div className="mt-3 space-y-1">
                {sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="block text-xs text-[#1d9e75] hover:underline">
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="text-xs text-[#9c9a92] pt-2 space-y-0.5">
          <p>Database: {stats.totalItems} items · Schema {stats.schemaVersion}</p>
          <p>MDR-status: in onderzoek · SIGHI-licentie: aangevraagd</p>
        </div>
      </div>

      <NavBar />
    </div>
  )
}
