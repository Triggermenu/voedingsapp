import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { getProfile, saveProfile, clearProfile } from '@/lib/profile'
import { getTodayStats } from '@/lib/stats'
import { getAllItems } from '@/lib/db'
import { getCombinedScore } from '@/lib/scoring'
import { NavBar } from '@/components/NavBar'
import { Logo } from '@/components/Logo'

const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht',
  migraine: 'Migraine',
  nierstenen: 'Nierstenen',
  histamine: 'Histamine',
}

export function Instellingen() {
  const navigate = useNavigate()
  const profile = getProfile()
  const conditions = profile?.conditions ?? []
  const [selected, setSelected] = useState<Condition[]>(conditions)
  const [saved, setSaved] = useState(false)

  const todayStats = getTodayStats()
  const allItems = getAllItems()
  const viewedItems = allItems.filter((i) => todayStats.viewed.includes(i.id))

  const scoreCounts = viewedItems.reduce((acc, item) => {
    const s = getCombinedScore(item, conditions).score
    if (s === 0) acc.veilig++
    else if (s === 1) acc.matig++
    else if (s === 2) acc.voorzichtig++
    else if (s === 3) acc.vermijden++
    return acc
  }, { veilig: 0, matig: 0, voorzichtig: 0, vermijden: 0 })

  const safePercent = viewedItems.length > 0
    ? Math.round((scoreCounts.veilig / viewedItems.length) * 100)
    : null

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
    if (window.confirm('Weet je het zeker? Je profiel en instellingen worden gewist.')) {
      clearProfile()
      navigate('/onboarding')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-24">
      {/* Header */}
      <div className="px-4 pt-safe pt-5 pb-4 border-b border-[#e0dfd7]">
        <div className="flex items-center gap-2 mb-3">
          <Logo size={26} />
          <span className="font-serif font-semibold text-[#1a1a18] text-base">Triggermenu</span>
        </div>
        <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">Mijn profiel</p>
        <h1 className="font-serif text-[1.9rem] leading-[1.15] font-semibold text-[#1a1a18]">
          Wat moet ik voor{' '}
          <em className="not-italic italic text-[#1d9e75]">jou</em> in de gaten houden?
        </h1>
        <p className="text-sm text-[#73726c] mt-1">Je zoekresultaten en menuscan passen zich aan.</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Conditions */}
        <div className="space-y-2">
          {CONDITIONS.map((c) => {
            const isOn = selected.includes(c)
            return (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                  isOn ? 'border-[#1d9e75] bg-[#f0faf5]' : 'border-[#e0dfd7] bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isOn ? 'border-[#1d9e75] bg-[#1d9e75]' : 'border-[#c8c7bf]'}`}>
                    {isOn && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="font-medium text-[#1a1a18]">{CONDITION_LABELS[c]}</span>
                </div>
                {isOn && (
                  <span className="text-[10px] tracking-widest text-[#1d9e75] font-semibold uppercase">Actief</span>
                )}
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={selected.length === 0}
          className="w-full bg-[#1d9e75] hover:bg-[#178a65] disabled:bg-[#c8c7bf] text-white font-medium py-3.5 rounded-xl transition-colors"
        >
          {saved ? '✓ Opgeslagen' : 'Opslaan'}
        </button>

        {/* Today stats */}
        {viewedItems.length > 0 && (
          <div className="bg-white border border-[#e0dfd7] rounded-xl p-4">
            <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">Vandaag</p>
            <div className="flex items-end justify-between mb-2">
              <div>
                <p className="font-semibold text-[#1a1a18]">{viewedItems.length} items bekeken</p>
                <p className="text-xs text-[#9c9a92] mt-0.5">
                  {scoreCounts.veilig} veilig · {scoreCounts.matig} matig · {scoreCounts.vermijden} vermijden
                </p>
              </div>
              {safePercent !== null && (
                <span className="font-serif text-2xl font-semibold text-[#1d9e75]">{safePercent}%</span>
              )}
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-[#f0efe8] overflow-hidden flex">
              <div className="bg-emerald-500 h-full transition-all" style={{ width: `${(scoreCounts.veilig / viewedItems.length) * 100}%` }} />
              <div className="bg-yellow-400 h-full transition-all" style={{ width: `${(scoreCounts.matig / viewedItems.length) * 100}%` }} />
              <div className="bg-orange-500 h-full transition-all" style={{ width: `${(scoreCounts.voorzichtig / viewedItems.length) * 100}%` }} />
              <div className="bg-red-600 h-full transition-all" style={{ width: `${(scoreCounts.vermijden / viewedItems.length) * 100}%` }} />
            </div>
          </div>
        )}

        <button onClick={handleReset} className="w-full text-xs text-[#9c9a92] hover:text-red-500 py-2 transition-colors">
          Profiel wissen
        </button>
      </div>

      <NavBar />
    </div>
  )
}
