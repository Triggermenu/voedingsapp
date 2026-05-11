import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getProfile } from '@/lib/profile'
import { NavBar } from '@/components/NavBar'
import { StoplichtBadge } from '@/components/StoplichtBadge'
import type { Condition } from '@/schemas/item'

const ACCESS_CODE_KEY = 'voedingsapp_scan_code'

interface ScanResult {
  dish: string
  scores: Partial<Record<Condition, { score: number; note: string }>>
  overallNote: string
}

export function Scan() {
  const { t } = useTranslation()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []

  const [accessCode, setAccessCode] = useState(() => localStorage.getItem(ACCESS_CODE_KEY) ?? '')
  const [codeSaved, setCodeSaved] = useState(!!localStorage.getItem(ACCESS_CODE_KEY))
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ScanResult[] | null>(null)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const saveCode = () => {
    localStorage.setItem(ACCESS_CODE_KEY, accessCode)
    setCodeSaved(true)
  }

  const handleFile = (file: File) => {
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResults(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!image || !accessCode) return
    setLoading(true)
    setError('')

    try {
      const base64 = await fileToBase64(image)
      const res = await fetch('/api/menuscan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Code': accessCode,
        },
        body: JSON.stringify({ image: base64, conditions, mediaType: image.type }),
      })

      if (res.status === 401) {
        setError('Ongeldige toegangscode. Controleer de code en probeer opnieuw.')
        return
      }
      if (!res.ok) {
        setError(t('scan.error'))
        return
      }

      const data = await res.json() as { results: ScanResult[] }
      setResults(data.results)
    } catch {
      setError(t('scan.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      <div className="px-4 pt-safe pt-6 pb-3">
        <h1 className="text-base font-medium text-[#1a1a18]">{t('scan.title')}</h1>
        <p className="text-sm text-[#73726c] mt-1">{t('scan.subtitle')}</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Access code */}
        {!codeSaved ? (
          <div className="bg-white border border-[#e0dfd7] rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-[#1a1a18]">{t('scan.enterCode')}</p>
            <div className="flex gap-2">
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder={t('scan.enterCodePlaceholder')}
                className="flex-1 px-3 py-2 border border-[#e0dfd7] rounded-lg text-sm focus:outline-none focus:border-[#1d9e75]"
              />
              <button
                onClick={saveCode}
                disabled={!accessCode}
                className="px-4 py-2 bg-[#1d9e75] text-white text-sm font-medium rounded-lg disabled:bg-[#c8c7bf]"
              >
                {t('scan.saveCode')}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Image upload */}
            <div
              className="bg-white border-2 border-dashed border-[#e0dfd7] rounded-xl p-6 text-center cursor-pointer hover:border-[#1d9e75] transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="space-y-2">
                  <div className="text-3xl">📷</div>
                  <p className="text-sm text-[#73726c]">{t('scan.upload')}</p>
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

            {image && (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-[#1d9e75] hover:bg-[#178a65] disabled:bg-[#c8c7bf] text-white font-medium py-3 rounded-xl transition-colors"
              >
                {loading ? t('scan.analyzing') : t('scan.analyze')}
              </button>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {results && (
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="bg-white border border-[#e0dfd7] rounded-xl p-4 space-y-2">
                    <p className="font-medium text-sm text-[#1a1a18]">{r.dish}</p>
                    <div className="flex flex-wrap gap-2">
                      {conditions.map((c) => {
                        const s = r.scores[c]
                        return s ? (
                          <div key={c} className="flex items-center gap-1.5">
                            <StoplichtBadge score={s.score} size="sm" />
                            <span className="text-xs text-[#73726c]">{c}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                    {r.overallNote && (
                      <p className="text-xs text-[#73726c] leading-relaxed">{r.overallNote}</p>
                    )}
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 leading-relaxed">
                  {t('scan.disclaimer')}
                </div>
              </div>
            )}

            <button
              onClick={() => { setCodeSaved(false); localStorage.removeItem(ACCESS_CODE_KEY) }}
              className="text-xs text-[#9c9a92] underline"
            >
              Toegangscode wijzigen
            </button>
          </>
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
