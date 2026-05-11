import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { getProfile, saveProfile, clearProfile } from '@/lib/profile'
import { getDatabaseStats } from '@/lib/db'
import { NavBar } from '@/components/NavBar'

export function Instellingen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const profile = getProfile()
  const stats = getDatabaseStats()

  const [selected, setSelected] = useState<Condition[]>(profile?.conditions ?? [])
  const [saved, setSaved] = useState(false)

  const toggle = (c: Condition) => {
    setSaved(false)
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const handleSave = () => {
    if (selected.length === 0) return
    saveProfile({ conditions: selected })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm(t('instellingen.resetConfirm'))) {
      clearProfile()
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      <div className="px-4 pt-safe pt-6 pb-4 border-b border-[#e0dfd7]">
        <h1 className="text-base font-medium text-[#1a1a18]">{t('instellingen.title')}</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profiel */}
        <div className="bg-white border border-[#e0dfd7] rounded-xl p-4 space-y-3">
          <div>
            <h2 className="text-sm font-medium text-[#1a1a18]">{t('instellingen.profile')}</h2>
            <p className="text-xs text-[#73726c] mt-0.5">{t('instellingen.profileHelp')}</p>
          </div>
          <div className="space-y-2">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                  selected.includes(c)
                    ? 'border-[#1d9e75] bg-emerald-50'
                    : 'border-[#e0dfd7] hover:border-[#c8c7bf]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selected.includes(c) ? 'border-[#1d9e75] bg-[#1d9e75]' : 'border-[#c8c7bf]'
                  }`}
                >
                  {selected.includes(c) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="text-sm text-[#1a1a18]">{t(`conditions.${c}`)}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={selected.length === 0}
            className="w-full bg-[#1d9e75] hover:bg-[#178a65] disabled:bg-[#c8c7bf] text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {saved ? `✓ ${t('instellingen.saved')}` : t('instellingen.save')}
          </button>
        </div>

        {/* Over de app */}
        <div className="bg-white border border-[#e0dfd7] rounded-xl p-4 space-y-2">
          <h2 className="text-sm font-medium text-[#1a1a18]">{t('instellingen.about')}</h2>
          <div className="text-xs text-[#73726c] space-y-1">
            <p>{t('instellingen.version')}: {stats.schemaVersion}</p>
            <p>{t('instellingen.items')}: {stats.totalItems}</p>
          </div>
          <Link
            to="/bronnen"
            className="block text-xs text-[#1d9e75] mt-2 hover:underline"
          >
            {t('instellingen.methodology')} →
          </Link>
        </div>

        {/* Profiel wissen */}
        <button
          onClick={handleReset}
          className="w-full text-xs text-red-500 hover:text-red-700 py-2 transition-colors"
        >
          {t('instellingen.reset')}
        </button>
      </div>

      <NavBar />
    </div>
  )
}
