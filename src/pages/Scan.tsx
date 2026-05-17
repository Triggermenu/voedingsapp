import { useState, useRef } from 'react'
import { getProfile } from '@/lib/profile'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'
import type { Condition } from '@/schemas/item'

const SCORE_LABELS: Record<number, string> = { 0: 'Veilig', 1: 'Matig', 2: 'Voorzichtig', 3: 'Vermijden' }
const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht', migraine: 'Migraine', nierstenen: 'Nierstenen', histamine: 'Histamine',
}

interface ScanResult {
  dish: string
  scores: Partial<Record<Condition, { score: number; note: string }>>
  overallNote: string
}

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

export function Scan() {
  const profile = getProfile()
  const conditions = profile?.conditions ?? []

  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScanResult[] | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setResults(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!imageFile) return
    setLoading(true)
    setError('')
    try {
      const base64 = await fileToBase64(imageFile)
      const res = await fetch('/api/menuscan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, conditions, mediaType: imageFile.type }),
      })
      if (res.status === 429) {
        const data = await res.json().catch(() => null) as { error?: string } | null
        setError(data?.error ?? 'Te veel scans. Probeer het later opnieuw.')
        return
      }
      if (!res.ok) { setError('Er ging iets mis. Probeer opnieuw.'); return }
      const data = await res.json() as { results: ScanResult[] }
      setResults(data.results)
    } catch {
      setError('Kon de server niet bereiken. Controleer je verbinding.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setPreview(null)
    setImageFile(null)
    setResults(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="px-4 pt-safe pt-5 pb-4 border-b border-[#e0dfd7]">
        <div className="flex items-center gap-2 mb-3">
          <Logo size={26} />
          <span className="font-serif font-semibold text-[#1a1a18] text-base">Triggermenu</span>
        </div>
        <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">Menukaart scan</p>
        <h1 className="font-serif text-[1.9rem] leading-[1.15] font-semibold text-[#1a1a18]">
          Foto een menu,{' '}
          <em className="not-italic italic text-[#1d9e75]">wij beoordelen</em>.
        </h1>
        <p className="text-sm text-[#73726c] mt-1">
          Maak een foto van een restaurantmenukaart — elk gerecht krijgt een stoplichtadvies.
        </p>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Image upload */}
        {!results && (
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
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
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
              <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold">
                {results.length} gerechten beoordeeld
              </p>
              <button onClick={reset} className="text-xs text-[#1d9e75] font-medium">
                Nieuwe scan
              </button>
            </div>

            {results.map((r, i) => (
              <div key={i} className="bg-white border border-[#e0dfd7] rounded-xl p-4 space-y-2.5">
                <p className="font-serif font-semibold text-[#1a1a18]">{r.dish}</p>
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
            ))}

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
              Dit is een AI-inschatting op basis van de menukaart — geen medisch advies. Raadpleeg
              altijd je diëtist of arts bij twijfel. Scores kunnen afwijken van de database.
            </div>
          </div>
        )}
      </div>

      <NavBar />
    </div>
  )
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
