import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, hasAcceptedScanConsent, acceptScanConsent } from '@/lib/profile'
import { track } from '@/lib/analytics'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import type { Condition } from '@/schemas/item'

const SCORE_LABELS: Record<number, string> = { 0: 'Veilig', 1: 'Met mate', 2: 'Spaarzaam', 3: 'Vermijden' }
const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht', migraine: 'Migraine', nierstenen: 'Nierstenen', histamine: 'Histamine',
}

interface Phase1Result {
  dish: string
  scores: Partial<Record<Condition, { score: number; note: string }>>
  overallNote: string
}

interface Phase2Detail {
  dish: string
  explanation: string
  waiterQuestions: string[]
}

// Merged type used once both phases are done
type ScanResult = Phase1Result & Partial<Pick<Phase2Detail, 'explanation' | 'waiterQuestions'>>

function ScorePill({ score }: { score: number }) {
  const styles =
    score === 0 ? 'bg-[#c6e3d5] text-emerald-800' :
    score === 1 ? 'bg-[#e8ddb5] text-yellow-800' :
    score === 2 ? 'bg-[#f0c4a0] text-orange-800' :
    'bg-[#f0adad] text-red-800'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {SCORE_LABELS[score] ?? 'Onbekend'}
    </span>
  )
}

// Aparte, uitdrukkelijke toestemming voor de menuscan (gezondheidsgegevens →
// Vercel + Anthropic). Los van de medische disclaimer uit de onboarding — A-7 / R-007.
function ScanConsentGate({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="bg-white border border-[#e0dfd7] rounded-xl p-5 space-y-3">
      <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold">Eenmalige toestemming</p>
      <h2 className="font-serif text-lg font-semibold text-[#1a1a18] leading-snug">
        Voor de menuscan verwerken we gezondheidsgegevens
      </h2>
      <ul className="text-xs text-[#73726c] leading-relaxed space-y-1.5 list-disc pl-4">
        <li>Je foto van de menukaart en je gekozen aandoening(en) gaan naar onze server (Vercel, EU) en naar Anthropic (AI-analyse, VS).</li>
        <li>De foto wordt <strong>niet opgeslagen</strong> en na de analyse niet bewaard.</li>
        <li>Verwerking gebeurt op basis van jouw uitdrukkelijke toestemming; je hoeft geen account te maken.</li>
      </ul>
      <p className="text-xs text-[#73726c]">
        Meer details in de{' '}
        <Link to="/privacy" className="text-[#1d9e75] font-medium underline">privacyverklaring</Link>.
      </p>
      <button
        onClick={onAccept}
        className="w-full bg-[#1d9e75] hover:bg-[#178a65] text-white font-medium py-3 rounded-xl transition-colors"
      >
        Ik geef toestemming en ga verder
      </button>
    </div>
  )
}

export function Scan() {
  const profile = getProfile()
  const conditions = profile?.conditions ?? []

  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScanResult[] | null>(null)
  const [phase2Loading, setPhase2Loading] = useState(false)
  const [error, setError] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [scanConsent, setScanConsent] = useState(hasAcceptedScanConsent())
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    // Geef de vorige object-URL vrij — de foto wordt niet langer dan nodig bewaard.
    if (preview) URL.revokeObjectURL(preview)

    if (!file.type.startsWith('image/')) {
      setError('Alleen afbeeldingen worden ondersteund (JPEG, PNG, HEIC, WEBP).')
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('Afbeelding is te groot (max 12 MB). Maak een foto met lagere resolutie of kies een kleinere afbeelding.')
      return
    }

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setResults(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!imageFile) return
    setLoading(true)
    setError('')
    setResults(null)
    track('menuscan_gestart')

    try {
      // Fase 1: afbeelding → scores (snel)
      const base64 = await fileToBase64(imageFile)
      const res1 = await fetch('/api/menuscan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: 1, image: base64, conditions, mediaType: 'image/jpeg' }),
      })
      if (res1.status === 429) {
        const data = await res1.json().catch(() => null) as { error?: string } | null
        setError(data?.error ?? 'Te veel scans. Probeer het later opnieuw.')
        return
      }
      if (!res1.ok) {
        const errData = await res1.json().catch(() => null) as { error?: string } | null
        setError(errData?.error ?? 'Er ging iets mis. Probeer opnieuw.')
        return
      }
      const data1 = await res1.json() as { results: Phase1Result[] }
      const phase1Results: ScanResult[] = data1.results
      setResults(phase1Results)
      setLoading(false)
      track('menuscan_gelukt', { gerechten: phase1Results.length })

      // Fase 2: tekst-only → uitleg + obervragen (op de achtergrond, NDJSON-stream)
      setPhase2Loading(true)
      try {
        const res2 = await fetch('/api/menuscan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase: 2,
            conditions,
            dishes: phase1Results.map((r) => ({ dish: r.dish, scores: r.scores })),
          }),
        })
        if (res2.ok && res2.body) {
          const applyDetail = (detail: Phase2Detail) => {
            setResults((prev) => {
              if (!prev) return prev
              return prev.map((r) =>
                r.dish === detail.dish
                  ? { ...r, explanation: detail.explanation, waiterQuestions: detail.waiterQuestions }
                  : r,
              )
            })
          }
          const reader = res2.body.getReader()
          const decoder = new TextDecoder()
          let buffer = ''
          // Lees stream: elke regel = één gevalideerd detail-object
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            let nl: number
            while ((nl = buffer.indexOf('\n')) !== -1) {
              const line = buffer.slice(0, nl).trim()
              buffer = buffer.slice(nl + 1)
              if (!line) continue
              try {
                applyDetail(JSON.parse(line) as Phase2Detail)
              } catch {
                // partial / malformed regel — overslaan
              }
            }
          }
          // Laatste regel zonder afsluitende \n
          const tail = buffer.trim()
          if (tail) {
            try { applyDetail(JSON.parse(tail) as Phase2Detail) } catch { /* skip */ }
          }
        }
      } catch {
        // fase 2 mislukt stilletjes — scores zijn al zichtbaar
      } finally {
        setPhase2Loading(false)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'AFBEELDING_NIET_LEESBAAR') {
        setError('Kon de afbeelding niet verwerken. Probeer een andere foto (JPEG of PNG werkt het best).')
      } else if (msg === 'CANVAS_LEEG') {
        setError('Afbeelding kon niet worden gecomprimeerd. Probeer een foto in een ander formaat.')
      } else {
        setError('Kon de server niet bereiken. Controleer je internetverbinding en probeer opnieuw.')
      }
      setLoading(false)
    }
  }

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setImageFile(null)
    setResults(null)
    setError('')
    setPhase2Loading(false)
    setExpandedIndex(null)
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="px-4 pt-safe pt-5 pb-4 border-b border-[#e0dfd7]">
        <div className="flex items-center gap-2 mb-3">
          <Logo size={26} to="/zoeken" />
        </div>
        <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">Menukaart scan</p>
        <h1 className="font-serif text-[1.9rem] leading-[1.15] font-semibold text-[#1a1a18]">
          Maak een foto van het menu,{' '}
          <em className="not-italic italic text-[#1d9e75]">wij beoordelen</em>.
        </h1>
        <p className="text-sm text-[#73726c] mt-1">
          Maak een foto van een restaurantmenukaart — elk gerecht krijgt een stoplichtadvies. We analyseren maximaal 15 gerechten per foto.
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Toestemming menuscan — los van de medische disclaimer (A-7 / R-007) */}
        {!scanConsent && (
          <ScanConsentGate onAccept={() => { acceptScanConsent(); setScanConsent(true) }} />
        )}

        {/* Image upload */}
        {scanConsent && !results && (
          <div
            className="bg-white border-2 border-dashed border-[#e0dfd7] rounded-xl overflow-hidden cursor-pointer hover:border-[#1d9e75] transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Menukaart preview" className="w-full max-h-64 object-contain" />
            ) : (
              <div className="p-8 text-center space-y-2">
                <svg className="w-10 h-10 mx-auto text-[#c8c7bf]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm font-medium text-[#1a1a18]">Foto maken of kiezen</p>
                <p className="text-xs text-[#9c9a92]">Tik om je camera of fotobibliotheek te openen</p>
                <p className="text-xs text-[#c8c7bf] pt-1">Camera werkt niet? Controleer je browserinstellingen → cameratoegang.</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {imageFile && !results && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-[#1d9e75] hover:bg-[#178a65] disabled:bg-[#c8c7bf] text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyseren…
              </>
            ) : 'Menu analyseren'}
          </button>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold">
                  {results.length} gerechten beoordeeld
                </p>
                {phase2Loading && (
                  <span className="flex items-center gap-1 text-[10px] text-[#9c9a92]">
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    uitleg laden…
                  </span>
                )}
              </div>
              <button onClick={reset} className="text-xs text-[#1d9e75] font-medium">
                Nieuwe scan
              </button>
            </div>

            {results.map((r, i) => {
              const isOpen = expandedIndex === i
              return (
                <div key={i} className="bg-white border border-[#e0dfd7] rounded-xl overflow-hidden">
                  {/* Hoofdrij */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif font-semibold text-[#1a1a18] leading-snug">{r.dish}</p>
                      <button
                        onClick={() => setExpandedIndex(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-label="Meer uitleg"
                        className="flex-shrink-0 w-6 h-6 rounded-full border border-[#c8c7bf] flex items-center justify-center text-[#73726c] hover:border-[#1d9e75] hover:text-[#1d9e75] transition-colors mt-0.5"
                      >
                        <span className="text-[11px] font-semibold leading-none">i</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((c) => {
                        const s = r.scores[c]
                        if (!s) return null
                        return (
                          <div key={c} className="flex items-center gap-1.5">
                            <ScorePill score={s.score} />
                            <span className="text-xs text-[#73726c]">{CONDITION_LABELS[c]}</span>
                          </div>
                        )
                      })}
                    </div>
                    {r.overallNote && (
                      <p className="text-xs text-[#73726c] leading-relaxed border-t border-[#f0efe8] pt-2">
                        {r.overallNote}
                      </p>
                    )}
                  </div>

                  {/* Uitklapblok */}
                  {isOpen && (
                    <div className="border-t border-[#f0efe8] bg-[#faf9f6] px-4 py-3 space-y-3">
                      {/* Spinner tijdens fase 2 */}
                      {phase2Loading && !r.explanation && (
                        <div className="flex items-center gap-2 text-xs text-[#9c9a92]">
                          <svg className="w-3.5 h-3.5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Uitleg wordt geladen…
                        </div>
                      )}

                      {/* Uitleg per aandoening */}
                      {r.explanation && (
                        <div>
                          <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">Waarom deze score?</p>
                          <p className="text-xs text-[#1a1a18] leading-relaxed">{r.explanation}</p>
                        </div>
                      )}

                      {/* Niet beschikbaar na fase 2 */}
                      {!phase2Loading && !r.explanation && (
                        <p className="text-xs text-[#9c9a92] italic">Geen uitleg beschikbaar.</p>
                      )}

                      {/* Vragen voor de ober */}
                      {r.waiterQuestions && r.waiterQuestions.length > 0 && (
                        <div>
                          <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1.5">Vraag aan de ober</p>
                          <ul className="space-y-1.5">
                            {r.waiterQuestions.map((q, qi) => (
                              <li key={qi} className="flex items-start gap-2">
                                <span className="text-[#1d9e75] mt-0.5 flex-shrink-0">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm.5 7.5h-1v-4h1v4zm0-5h-1V2.5h1V3.5z" fill="currentColor"/>
                                  </svg>
                                </span>
                                <span className="text-xs text-[#1a1a18] leading-relaxed italic">"{q}"</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
              Dit is een AI-inschatting op basis van de menukaart — geen medisch advies. Raadpleeg
              altijd je diëtist of arts bij twijfel. Scores kunnen afwijken van de database.
            </div>

            {/* Deel-knop */}
            <button
              onClick={() => shareResults(results!, conditions)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#e0dfd7] text-sm text-[#73726c] font-medium hover:border-[#1d9e75] hover:text-[#1d9e75] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              Deel resultaten
            </button>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  )
}

const SCORE_EMOJI: Record<number, string> = { 0: '🟢', 1: '🟡', 2: '🟠', 3: '🔴' }

function shareResults(results: ScanResult[], conditions: string[]) {
  const lines = results.map((r) => {
    const scores = conditions
      .map((c) => {
        const s = r.scores[c as keyof typeof r.scores]
        return s ? `${CONDITION_LABELS[c as keyof typeof CONDITION_LABELS]}: ${SCORE_EMOJI[s.score] ?? '?'} ${SCORE_LABELS[s.score]}` : null
      })
      .filter(Boolean)
      .join(' · ')
    return `${r.dish}\n${scores}`
  }).join('\n\n')

  const text = `Menukaart analyse via Triggermenu\n\n${lines}\n\ntriggermenu.nl`

  if (navigator.share) {
    navigator.share({ title: 'Triggermenu menukaart scan', text }).catch(() => {})
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Gekopieerd naar klembord'))
  }
}

/**
 * Comprimeer afbeelding naar max 1568px (Anthropic's interne vision-limiet —
 * groter heeft geen nut, alleen meer upload-tijd en vision-tokens) en JPEG 0.85.
 * Houdt de base64-payload ruim onder Vercel's 4.5MB body-limiet.
 */
async function fileToBase64(file: File): Promise<string> {
  const MAX_PX = 1568
  const QUALITY = 0.85

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('AFBEELDING_NIET_LEESBAAR')
  }
  const { width, height } = bitmap

  const scale = Math.min(1, MAX_PX / Math.max(width, height))
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) { reject(new Error('CANVAS_LEEG')); return }
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(blob)
      },
      'image/jpeg',
      QUALITY,
    )
  })
}
