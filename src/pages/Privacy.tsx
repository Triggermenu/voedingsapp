import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'

export function Privacy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-16">
      <div className="px-4 pt-safe pt-4 pb-4 border-b border-[#e0dfd7]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-[#5f5e5a] hover:text-[#1a1a18] mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Terug
        </button>
        <div className="flex items-center gap-2 mb-3">
          <Logo size={26} />
          <span className="font-serif font-semibold text-[#1a1a18] text-base">Triggermenu</span>
        </div>
        <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">Juridisch</p>
        <h1 className="font-serif text-[1.9rem] leading-[1.15] font-semibold text-[#1a1a18]">
          Privacybeleid
        </h1>
        <p className="text-xs text-[#9c9a92] mt-1">Versie 1.0 · mei 2026</p>
      </div>

      <div className="px-4 py-5 space-y-6 max-w-prose text-sm text-[#3d3d3a] leading-relaxed">

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Wie is verantwoordelijk?</h2>
          <p>
            Triggermenu is een app van Peter Wolterman, bereikbaar via{' '}
            <a href="mailto:peter.wolterman@gmail.com" className="text-[#1d9e75] underline">
              peter.wolterman@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Welke gegevens worden opgeslagen?</h2>
          <p>
            Triggermenu slaat <strong>geen persoonsgegevens op centrale servers op</strong>. Alle
            gegevens — jouw aandoeningen, voorkeuren en gebruiksstatistieken — worden uitsluitend
            lokaal op jouw eigen apparaat bewaard via de browser (localStorage). Er is geen account,
            geen registratie en geen centrale database met gebruikersprofielen.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Menukaart scan (AI)</h2>
          <p>
            Wanneer je de menukaart scan gebruikt, wordt de foto die je maakt verstuurd naar de
            API van Anthropic (VS) voor analyse. Anthropic verwerkt de afbeelding om gerechten te
            beoordelen op basis van jouw aandoeningen. De afbeelding wordt <strong>niet permanent
            opgeslagen</strong> door Anthropic na verwerking, conform hun{' '}
            <a
              href="https://www.anthropic.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1d9e75] underline"
            >
              privacybeleid
            </a>
            . Gebruik de scan niet voor foto's met herkenbare personen.
          </p>
          <p>
            De scan is een <strong>betaalde functie</strong> waarvoor een toegangscode nodig is.
            Zonder toegangscode worden er geen gegevens verstuurd.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Foutregistratie (Sentry)</h2>
          <p>
            De app maakt gebruik van Sentry voor het registreren van technische fouten. Hierbij
            worden anonieme foutmeldingen verstuurd — geen persoonsgegevens. Je kunt dit voorkomen
            door JavaScript te blokkeren via je browserinstellingen.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Cookies en tracking</h2>
          <p>
            Triggermenu gebruikt <strong>geen tracking cookies</strong>, geen advertentienetwerken
            en geen analytics-diensten van derden. Er wordt geen profiel van jou opgebouwd voor
            commerciële doeleinden.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Jouw rechten (AVG)</h2>
          <p>
            Omdat er geen centrale opslag van persoonsgegevens plaatsvindt, kun je jouw gegevens
            op elk moment verwijderen via <em>Profiel → Profiel wissen</em> in de app. Dit verwijdert
            alle lokaal opgeslagen informatie van jouw apparaat.
          </p>
          <p>
            Voor vragen over privacy kun je contact opnemen via{' '}
            <a href="mailto:peter.wolterman@gmail.com" className="text-[#1d9e75] underline">
              peter.wolterman@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-base text-[#1a1a18]">Medische disclaimer</h2>
          <p>
            De informatie in Triggermenu is <strong>geen medisch advies</strong>. De app biedt
            algemene voedingsinformatie ter ondersteuning van bewuste voedingskeuzes. Raadpleeg
            altijd een arts of diëtist voor persoonlijk advies.
          </p>
        </section>

      </div>
    </div>
  )
}
