import { Link } from 'react-router-dom'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import { getDatabaseStats } from '@/lib/db'

// Detail-/uitlegpagina: hoe komen de stoplichten tot stand?
// Bedoeld voor geïnteresseerden, diëtisten en onderzoekers. Bereikbaar via een link
// op de Bronnen-pagina. Inhoud loopt in de pas met methodologie.md + CLAUDE.md.

type Cond = { id: string; label: string; status: 'safe' | 'ok' | 'warn' | 'avoid' }
const CONDS: Cond[] = [
  { id: 'jicht', label: 'Jicht', status: 'ok' },
  { id: 'migraine', label: 'Migraine', status: 'ok' },
  { id: 'nierstenen', label: 'Nierstenen', status: 'warn' },
  { id: 'histamine', label: 'Histamine', status: 'avoid' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 26 }}>
      <h2 className="serif" style={{ fontSize: 19, fontWeight: 500, color: 'var(--ink)', margin: '0 0 8px', letterSpacing: -0.3 }}>
        {title}
      </h2>
      <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.62 }}>{children}</div>
    </div>
  )
}

function Src({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)', textDecoration: 'none' }}>
      {children}
    </a>
  )
}

export function Methodologie() {
  const stats = getDatabaseStats()

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ padding: '8px 22px 0' }} className="pt-safe">
        <Logo size={18} to="/zoeken" />
      </div>

      <div style={{ padding: '18px 22px 8px' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Methodologie</div>
        <h1 className="serif" style={{ fontSize: 26, lineHeight: 1.06, fontWeight: 500, margin: '8px 0 6px', letterSpacing: -0.5, color: 'var(--ink)' }}>
          Hoe een stoplicht tot stand komt.
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.55 }}>
          Een gedetailleerde uitleg voor geïnteresseerden, diëtisten en onderzoekers — welke bronnen,
          welke drempels en welke afwegingen achter elke kleur zitten.
        </p>
      </div>

      <div style={{ padding: '0 22px 16px' }}>
        {/* Status */}
        <div style={{
          marginTop: 10, padding: '12px 14px', borderRadius: 10,
          background: 'var(--brand-50)', border: '1px solid color-mix(in srgb, var(--brand) 18%, transparent)',
          fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55,
        }}>
          Triggermenu is een <strong style={{ color: 'var(--ink)' }}>informatieve beslishulp</strong>, geen medisch
          hulpmiddel en geen vervanging van arts of diëtist. De stoplichten zijn <strong style={{ color: 'var(--ink)' }}>populatie-inschattingen </strong>
          op basis van de best beschikbare evidence — geen individueel medisch oordeel. Individuele respons varieert,
          vooral bij migraine en histamine.
        </div>

        <Section title="1. De scoreschaal">
          Elk voedingsmiddel krijgt per aandoening een score van <strong>0 (groen, veilig)</strong>, <strong>1 (geel, met mate)</strong>,
          <strong> 2 (oranje, spaarzaam)</strong> of <strong>3 (rood, vermijden)</strong>; grijs = data niet beschikbaar.
          Elke niet-grijze score draagt een <strong>evidence-grade</strong> — A (directe database / meta-analyse),
          B (afgeleid / consensus / richtlijn) of C (beperkt / anekdotisch) — en minstens één controleerbare bron.
          De grade zegt hoe sterk de onderbouwing is, niet hoe risicovol het voedingsmiddel is.
        </Section>

        <Section title="2. Jicht — purine">
          Drempels (mg totaal purine per 100 g): <strong>&lt;50 → groen, 50–100 → geel, 100–200 → oranje, &gt;200 → rood</strong>.
          De score volgt in beginsel rechtstreeks de purinewaarde uit de{' '}
          <Src href="https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf">USDA Purine Database 2.0</Src>.
          Onderbouwde uitzonderingen:
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            <li><strong>Koffie = groen</strong> ondanks oude richtlijnen — Mendelian-randomization toont een beschermend effect.</li>
            <li><strong>Bier = rood</strong>, ongeacht puringehalte (ethanol remt urinezuur-uitscheiding).</li>
            <li><strong>Peulvruchten volgen de drempel, geplafonneerd op 2.</strong> Géén rood: {' '}
              <Src href="https://pubmed.ncbi.nlm.nih.gov/15014182/">Choi 2004 (NEJM, n=47.150)</Src> toont dat
              plantaardige/peulvrucht-purine — anders dan vlees (RR 1,41) en vis (RR 1,51) — het jichtrisico niet verhoogt.
              Laag-purine peulvruchten zijn daarom geel, niet oranje.</li>
          </ul>
        </Section>

        <Section title="3. Nierstenen — calciumoxalaat">
          Drempels (mg oxalaat per portie): <strong>&lt;10 → groen, 10–25 → geel, 25–50 → oranje, &gt;50 → rood</strong>,
          met een natrium-modifier (+1 bij &gt;600 mg/portie). Basis:{' '}
          <Src href="https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx">Harvard Oxalate Table 2023</Src>.
          Kern-uitzondering: <strong>calciumrijke producten zijn groen</strong> — een normale calciuminname{' '}
          <em>verlaagt</em> het steenrisico (<Src href="https://pubmed.ncbi.nlm.nih.gov/11742412/">Borghi RCT 2002</Src>);
          een laag-calciumdieet wordt afgeraden. Lage-oxalaatgroenten (bv. boerenkool) worden niet als spinazie behandeld.
        </Section>

        <Section title="4. Migraine — streng begrensd rood">
          Dit is een data-arm domein: geen kwantitatieve database, evidence overwegend laag.{' '}
          <Src href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/">Hindiyeh 2020</Src> is de leidende review.
          Daarom is <strong>rood streng beperkt</strong> tot twee mechanismen: <strong>bier</strong> (ethanol, populatiebreed)
          en <strong>gecureerd vlees boven de Henderson-nitrietdrempel</strong> (spek/bacon, dosis-afhankelijk).
          Veel klassieke "triggers" zijn op grond van modern onderzoek teruggebracht naar oranje, elk met een reden:
          <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
            <li><strong>Chocolade</strong> — waarschijnlijk prodroom-craving, geen oorzaak (<Src href="https://pubmed.ncbi.nlm.nih.gov/9453274/">Marcus 1997</Src>).</li>
            <li><strong>MSG</strong> — geen reproduceerbaar effect in geblindeerde studies (<Src href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4870486/">Obayashi 2016</Src>).</li>
            <li><strong>Gerijpte kaas / tyramine</strong> — bij intacte enzymfunctie geïnactiveerd; alleen in een gevoelige subgroep.</li>
            <li><strong>Gedistilleerd & wijn</strong> — trigger zit in congeneren, niet ethanol; wodka is juist mínst provocerend
              (<Src href="https://pubmed.ncbi.nlm.nih.gov/30565341/">Onderwater 2019</Src>).</li>
          </ul>
          Elke oranje/rode migraine-score draagt een <strong>triggerType</strong> (populatiebreed, dosis-afhankelijk,
          subgroep-bevestigd, subgroep-overschat, individueel-variabel …) zodat zichtbaar is <em>hoe</em> een trigger zich gedraagt.
        </Section>

        <Section title="5. Histamine-intolerantie">
          De <Src href="https://www.mastzellaktivierung.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf">SIGHI Compatibility List 2023</Src>{' '}
          (0–3-schaal) wordt direct overgenomen, aangevuld met HPLC-data uit een{' '}
          <Src href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12620675/">Braziliaanse systematic review 2024</Src>.
          Per item houden we bij of het een <strong>histamineliberator</strong> of <strong>DAO-blokker</strong> is.
          Tegenstrijdigheden worden expliciet gemarkeerd: citrus krijgt het label <em>"omstreden"</em> omdat de directe
          histamine-evidence beperkt is (<Src href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8143338/">San Mauro 2021</Src>).
        </Section>

        <Section title="6. Hoe we tegenstrijdige bronnen wegen">
          Bij conflict geldt een vaste, gedocumenteerde weging: mechanistisch sterke data (RCT, Mendelian randomization) &gt;
          correlationele richtlijnen; epidemiologische uitkomstdata &gt; biochemische samenstelling alleen; geblindeerde provocatie &gt;
          open-label zelfrapportage. Elke afwijking van een klassieke aanname staat met datum, bron en onderbouwing vastgelegd in
          ons interne besluitspoor, zodat de keuzes controleerbaar en herleidbaar zijn.
        </Section>

        <Section title="7. Kwaliteitsborging">
          De database ({stats.totalItems} items) wordt bij elke wijziging automatisch gevalideerd: schemacontrole, minstens één
          bereikbare bron per score, drempel-conformiteit, en een reeks regressie-checks die bewaken dat onze afwijkingen van oude
          aannames niet terugsijpelen (bv. koffie blijft groen, chocolade niet rood, rood-voor-migraine alleen met een populatiebreed/
          dosis-afhankelijk mechanisme). Inconsistenties tussen een score en zijn toelichting worden machinaal afgevangen.
        </Section>

        <Section title="8. Beperkingen — eerlijk benoemd">
          De scores zijn populatie-gemiddelden; jouw persoonlijke respons kan afwijken. De migraine-evidence is inherent zwak
          (gemitigeerd via strenge drempels en zichtbare evidence-badges). De SIGHI-licentie voor commercieel gebruik is aangevraagd.
          Het besluitspoor is opgesteld door één auteur; externe review door een diëtist/specialist wordt aanbevolen vóór commercieel
          gebruik. Feedback is welkom.
        </Section>

        <Section title="Bronnen per aandoening">
          De volledige, per-item bronvermelding is in de app zichtbaar. De ruggengraat-bronnen:
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {CONDS.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: 2, background: `var(--${c.status})`, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500, width: 78, flexShrink: 0 }}>{c.label}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {c.id === 'jicht' && 'USDA Purine DB 2.0 · EULAR 2022 · Choi 2004 · Kaneko'}
                  {c.id === 'migraine' && 'Hindiyeh 2020 · Finberg 2022 · Onderwater 2019 · ICHD-3'}
                  {c.id === 'nierstenen' && 'Harvard Oxalate 2023 · AUA Guideline · Borghi RCT'}
                  {c.id === 'histamine' && 'SIGHI 2023 · Braziliaanse SR 2024 · San Mauro 2021'}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/bronnen" style={{ fontSize: 13, color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>
              ← Terug naar Bronnen
            </Link>
          </div>
        </Section>
      </div>
      </div>

      <NavBar />
    </div>
  )
}
