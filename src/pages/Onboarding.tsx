import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { saveProfile, acceptDisclaimer } from '@/lib/profile'
import { Logo } from '@/components/Logo'

const CONDITION_META: Record<Condition, { label: string; sub: string; icon: React.ReactNode }> = {
  jicht: {
    label: 'Jicht',
    sub: 'Purine-arm advies',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
      </svg>
    ),
  },
  migraine: {
    label: 'Migraine',
    sub: 'Triggers vermijden',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  nierstenen: {
    label: 'Nierstenen',
    sub: 'Oxalaat-monitoring',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15a2.25 2.25 0 01-1.8 2.25v.75A2.25 2.25 0 0115.75 20.25h-7.5A2.25 2.25 0 016 18v-.75a2.25 2.25 0 01-1.8-2.25" />
      </svg>
    ),
  },
  histamine: {
    label: 'Histamine',
    sub: 'SIGHI-compatibel',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
}

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex justify-center gap-1.5 my-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i === step ? 'w-6 bg-[#1a1a18]' : i < step ? 'w-2 bg-[#1a1a18]/40' : 'w-2 bg-[#c8c7bf]'
          }`}
        />
      ))}
    </div>
  )
}

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Condition[]>([])
  const [disclaimerChecked, setDisclaimerChecked] = useState(false)
  const [error, setError] = useState('')

  const toggle = (c: Condition) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const handleNext = () => {
    if (step === 1 && selected.length === 0) { setError('Kies minstens één aandoening'); return }
    setError('')
    setStep((s) => s + 1)
  }

  const handleStart = () => {
    if (!disclaimerChecked) return
    saveProfile({ conditions: selected })
    acceptDisclaimer()
    navigate('/zoeken')
  }

  const stepLabel = ['01 — WELKOM', '02 — PROFIEL', '03 — DISCLAIMER'][step]

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col max-w-md mx-auto">
      <div className="flex items-center justify-between px-5 pt-safe pt-3 pb-2">
        <Logo size={28} />
        <span className="text-[10px] tracking-widest text-[#9c9a92] font-medium">{stepLabel}</span>
      </div>

      <div className="flex-1 flex flex-col px-5 pb-8">
        {step === 0 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 pt-6">
              <p className="text-[11px] tracking-widest text-[#9c9a92] uppercase font-medium mb-4">Eet rustiger. Eet beter.</p>
              <h1 className="font-serif text-[2.6rem] leading-[1.1] font-semibold text-[#1a1a18] mb-5">
                Welke voeding past bij{' '}
                <em className="not-italic italic text-[#1d9e75]">jouw lichaam</em>?
              </h1>
              <p className="text-[#5f5e5a] text-[15px] leading-relaxed mb-6">
                Triggermenu vertaalt onderzoek over jicht, migraine, nierstenen en histamine-intolerantie naar één rustig stoplicht.
              </p>
              <div className="rounded-2xl bg-gradient-to-br from-[#e8f0eb] to-[#d4e6db] h-44 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#1d9e75]/30 flex items-center justify-center">
                  <Logo size={44} />
                </div>
              </div>
            </div>
            <StepDots step={step} />
            <button
              onClick={handleNext}
              className="w-full bg-[#1a1a18] hover:bg-[#2d2d2b] text-white font-medium py-4 rounded-2xl text-[15px] flex items-center justify-center gap-2 transition-colors"
            >
              Beginnen <span>→</span>
            </button>
            <p className="text-center text-xs text-[#9c9a92] mt-3">Geen account · geen tracking</p>
          </div>
        )}

        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 pt-4">
              <p className="text-xs text-[#9c9a92] mb-2">Stap 2 van 3</p>
              <h1 className="font-serif text-[2rem] leading-[1.15] font-semibold text-[#1a1a18] mb-1">
                Voor welke{' '}
                <em className="not-italic italic text-[#1d9e75]">aandoening</em>{' '}
                kies je advies?
              </h1>
              <p className="text-sm text-[#73726c] mb-5">Je kunt er meer dan één kiezen.</p>
              <div className="grid grid-cols-2 gap-3">
                {CONDITIONS.map((c) => {
                  const meta = CONDITION_META[c]
                  const isOn = selected.includes(c)
                  return (
                    <button
                      key={c}
                      onClick={() => toggle(c)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        isOn ? 'border-[#1d9e75] bg-[#f0faf5]' : 'border-[#e0dfd7] bg-white hover:border-[#c8c7bf]'
                      }`}
                    >
                      {isOn && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#1d9e75] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                      <span className={`mb-2 block ${isOn ? 'text-[#1d9e75]' : 'text-[#73726c]'}`}>{meta.icon}</span>
                      <p className="font-semibold text-[#1a1a18] text-sm">{meta.label}</p>
                      <p className="text-[11px] text-[#9c9a92] mt-0.5">{meta.sub}</p>
                    </button>
                  )
                })}
              </div>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </div>
            <StepDots step={step} />
            <button
              onClick={handleNext}
              className="w-full bg-[#1a1a18] hover:bg-[#2d2d2b] text-white font-medium py-4 rounded-2xl text-[15px] transition-colors"
            >
              {selected.length > 0 ? `Doorgaan · ${selected.length} gekozen` : 'Doorgaan'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 pt-4">
              <p className="text-[11px] tracking-widest text-[#9c9a92] uppercase font-medium mb-4">Even iets belangrijks</p>
              <h1 className="font-serif text-[2.2rem] leading-[1.15] font-semibold text-[#1a1a18] mb-6">
                Een <em className="not-italic italic text-[#1d9e75]">kompas</em>, geen recept.
              </h1>
              <div className="bg-white rounded-2xl border border-[#e0dfd7] divide-y divide-[#f0efe8]">
                {[
                  { n: '01', title: 'Indicatief, niet medisch advies', text: 'Triggermenu vervangt geen arts of diëtist — gebruik het als startpunt voor een gesprek.' },
                  { n: '02', title: 'Per persoon verschillend', text: 'Dezelfde voeding kan bij jou anders uitpakken. Houd zo nodig een dagboek bij.' },
                  { n: '03', title: 'Transparant onderbouwd', text: 'Iedere score linkt naar de bron: USDA, SIGHI, EULAR, AUA en peer-reviewed papers.' },
                ].map(({ n, title, text }) => (
                  <div key={n} className="px-4 py-3.5 flex gap-4">
                    <span className="text-xs font-semibold text-[#9c9a92] pt-0.5 w-5 flex-shrink-0">{n}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a18]">{title}</p>
                      <p className="text-xs text-[#73726c] mt-0.5 leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-3 mt-5 cursor-pointer" onClick={() => setDisclaimerChecked(!disclaimerChecked)}>
                <span className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${disclaimerChecked ? 'bg-[#1d9e75] border-[#1d9e75]' : 'border-[#c8c7bf]'}`}>
                  {disclaimerChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-[#3d3d3a] leading-relaxed">
                  Ik begrijp dat Triggermenu een hulpmiddel is en geen medisch advies vervangt.
                </span>
              </label>
            </div>
            <StepDots step={step} />
            <button
              onClick={handleStart}
              disabled={!disclaimerChecked}
              className="w-full bg-[#1d9e75] hover:bg-[#178a65] disabled:bg-[#c8c7bf] disabled:cursor-not-allowed text-white font-medium py-4 rounded-2xl text-[15px] transition-colors"
            >
              Aan de slag
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
