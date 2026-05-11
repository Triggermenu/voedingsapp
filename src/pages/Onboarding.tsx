import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Condition } from '@/schemas/item'
import { CONDITIONS } from '@/schemas/item'
import { saveProfile, acceptDisclaimer } from '@/lib/profile'

const STEP_WELCOME = 0
const STEP_CONDITIONS = 1
const STEP_DISCLAIMER = 2

export function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(STEP_WELCOME)
  const [selected, setSelected] = useState<Condition[]>([])
  const [disclaimerChecked, setDisclaimerChecked] = useState(false)
  const [error, setError] = useState('')

  const toggle = (c: Condition) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const handleNext = () => {
    if (step === STEP_CONDITIONS && selected.length === 0) {
      setError(t('onboarding.atLeastOne'))
      return
    }
    setError('')
    setStep((s) => s + 1)
  }

  const handleStart = () => {
    if (!disclaimerChecked) return
    saveProfile({ conditions: selected })
    acceptDisclaimer()
    navigate('/zoeken')
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">🥦</span>
            <h1 className="text-xl font-medium text-[#1a1a18]">{t('app.name')}</h1>
          </div>
          {/* Step dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-[#1d9e75]' : i < step ? 'w-4 bg-[#1d9e75]/40' : 'w-4 bg-[#e0dfd7]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e0dfd7] p-6 shadow-sm">
          {step === STEP_WELCOME && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1a1a18]">{t('onboarding.welcome')}</h2>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">{t('onboarding.welcomeText')}</p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                {t('onboarding.notMedical')}
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-[#1d9e75] hover:bg-[#178a65] text-white font-medium py-3 rounded-xl transition-colors"
              >
                {t('onboarding.next')}
              </button>
            </div>
          )}

          {step === STEP_CONDITIONS && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-[#1a1a18]">{t('onboarding.chooseConditions')}</h2>
                <p className="text-sm text-[#73726c] mt-1">{t('onboarding.chooseConditionsHelp')}</p>
              </div>
              <div className="space-y-2">
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => toggle(c)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                      selected.includes(c)
                        ? 'border-[#1d9e75] bg-emerald-50 text-[#1a1a18]'
                        : 'border-[#e0dfd7] bg-white text-[#3d3d3a] hover:border-[#c8c7bf]'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        selected.includes(c) ? 'border-[#1d9e75] bg-[#1d9e75]' : 'border-[#c8c7bf]'
                      }`}
                    >
                      {selected.includes(c) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className="font-medium">{t(`conditions.${c}`)}</span>
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                onClick={handleNext}
                className="w-full bg-[#1d9e75] hover:bg-[#178a65] text-white font-medium py-3 rounded-xl transition-colors"
              >
                {t('onboarding.next')}
              </button>
            </div>
          )}

          {step === STEP_DISCLAIMER && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-[#1a1a18]">{t('onboarding.disclaimer')}</h2>
              <p className="text-sm text-[#3d3d3a] leading-relaxed">{t('onboarding.disclaimerText')}</p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclaimerChecked}
                  onChange={(e) => setDisclaimerChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#1d9e75]"
                />
                <span className="text-sm text-[#3d3d3a] leading-relaxed">
                  {t('onboarding.disclaimerAccept')}
                </span>
              </label>
              <button
                onClick={handleStart}
                disabled={!disclaimerChecked}
                className="w-full bg-[#1d9e75] hover:bg-[#178a65] disabled:bg-[#c8c7bf] disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
              >
                {t('onboarding.start')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
