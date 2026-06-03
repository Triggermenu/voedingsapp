import { useMemo, useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getAllItems } from '@/lib/db'
import { getSession, getAdminStatus, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'
import type { Condition } from '@/schemas/item'

const CONDITIONS: Condition[] = ['jicht', 'migraine', 'nierstenen', 'histamine']
const CONDITION_LABELS: Record<Condition, string> = {
  jicht: 'Jicht', migraine: 'Migraine', nierstenen: 'Nierstenen', histamine: 'Histamine',
}

const CATEGORY_LABELS: Record<string, string> = {
  groente: 'Groente', fruit: 'Fruit', granen: 'Granen & brood',
  peulvruchten: 'Peulvruchten', 'noten-zaden': 'Noten & zaden',
  vlees: 'Vlees & gevogelte', 'vis-schaaldieren': 'Vis & schaaldieren',
  zuivel: 'Zuivel & eieren', eieren: 'Eieren',
  'dranken-alcohol': 'Alcohol', 'dranken-non-alcohol': 'Dranken',
  zoetwaren: 'Zoetwaren & snacks', 'sauzen-kruiden': 'Sauzen & kruiden',
  'bereid-gerecht': 'Bereide gerechten',
}

const RISKS = [
  { id: 'R-001', title: 'SIGHI-licentie', status: 'open' as const, desc: 'Commerciële toestemming nog niet bevestigd. Vereist vóór publieke launch.' },
  { id: 'R-002', title: 'MDR-classificatie', status: 'open' as const, desc: 'Classificatie als medisch hulpmiddel nog onderzocht. Vereist extern advies.' },
  { id: 'R-003', title: 'Migraine evidence', status: 'mitigated' as const, desc: 'Inherent zwak domein. Gemitigeerd via whitelist + evidence-badges in UI.' },
  { id: 'R-004', title: 'Menuscan betrouwbaarheid', status: 'mitigated' as const, desc: 'AI kan verborgen ingrediënten missen. Prompt + disclaimer + rate limit.' },
  { id: 'R-005', title: 'API-kosten (misbruik)', status: 'mitigated' as const, desc: 'Rate limit (12 scans/uur per IP via Supabase) aanwezig. Budget-cap instellen op Anthropic dashboard (A-5).' },
  { id: 'R-006', title: 'Database-kwaliteit', status: 'mitigated' as const, desc: '16 CI gates blokkeren slechte data automatisch. Sentry escaleert naar Peter.' },
  { id: 'R-010', title: 'Admin-account beveiliging', status: 'open' as const, desc: 'Gecompromitteerd admin-account geeft volledige toegang tot feedback en rate limits. Mitigatie: sterk wachtwoord, rotatie 1× per 6 maanden (acties-peter.md C-2).' },
]

const PRIMARY_SOURCES = [
  { label: 'USDA Purine Database 2.0', condition: 'Jicht', url: 'https://www.ars.usda.gov/ARSUserFiles/80400535/Data/Purine/PURINEDATABASEDOCUMENTATION2025.pdf' },
  { label: 'Harvard Oxalate Table 2023', condition: 'Nierstenen', url: 'https://hsph.harvard.edu/wp-content/uploads/2024/07/OXALATE-TABLE-1.xlsx' },
  { label: 'SIGHI Food Compatibility List 2023', condition: 'Histamine', url: 'https://www.mastzellaktivering.info/downloads/foodlist/21_FoodList_EN_alphabetic_withCateg.pdf' },
  { label: 'EULAR 2022 Gout Guidelines', condition: 'Jicht', url: 'https://ard.bmj.com/content/81/11/1452' },
  { label: 'Hindiyeh 2020 SR (migraine & diet)', condition: 'Migraine', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7496357/' },
]

const PHASE_TARGETS = [
  { fase: 1, target: 150, label: 'Sweet spot — alle 4 aandoeningen' },
  { fase: 2, target: 300, label: 'NL-supermarkt dekking' },
  { fase: 3, target: 500, label: 'Cap — USDA + Harvard volledig' },
]

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-3">
      <p className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-1">{label}</p>
      <p className="font-serif font-semibold text-2xl text-[#1a1a18]">{value}</p>
      {sub && <p className="text-xs text-[#9c9a92] mt-0.5">{sub}</p>}
    </div>
  )
}

function ProgressBar({ value, max, color = 'bg-[#1d9e75]' }: { value: number; max: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-1.5 bg-[#e0dfd7] rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

type FeedbackRow = { id: string; message: string; type: string; context: string | null; created_at: string }
type RateLimitRow = { ip: string; count: number; lastSeen: string }

function LoginPrompt() {
  return (
    <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-6 text-center">
      <p className="text-sm text-[#9c9a92] mb-3">Log in om live data te zien.</p>
      <Link
        to="/admin/login"
        className="inline-block text-xs font-semibold text-[#1d9e75] border border-[#1d9e75] rounded-lg px-4 py-2 hover:bg-[#f0faf5] transition-colors"
      >
        Inloggen →
      </Link>
    </div>
  )
}

export function Admin() {
  const navigate = useNavigate()
  const items = useMemo(() => getAllItems(), [])

  // ── Auth state ─────────────────────────────────────────────────────────────
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // ── Live data ──────────────────────────────────────────────────────────────
  const [feedback, setFeedback] = useState<FeedbackRow[]>([])
  const [rateLimits, setRateLimits] = useState<RateLimitRow[]>([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveError, setLiveError] = useState<string | null>(null)
  const [resettingIp, setResettingIp] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      const s = await getSession()
      if (cancelled) return
      setSession(s)
      if (s) {
        const admin = await getAdminStatus(s.user.id)
        if (!cancelled) setIsAdmin(admin)
      }
      if (!cancelled) setAuthLoading(false)
    }

    void checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (cancelled) return
      setSession(s)
      if (!s) { setIsAdmin(false); setAuthLoading(false) }
    })

    return () => { cancelled = true; subscription.unsubscribe() }
  }, [])

  const loadLiveData = useCallback(async (accessToken: string) => {
    setLiveLoading(true)
    setLiveError(null)
    try {
      const headers = { Authorization: `Bearer ${accessToken}` }
      const [fbRes, rlRes] = await Promise.all([
        fetch('/api/admin/feedback', { headers }),
        fetch('/api/admin/rate-limits', { headers }),
      ])
      if (!fbRes.ok || !rlRes.ok) throw new Error('Ophalen mislukt')
      const [fbData, rlData] = await Promise.all([fbRes.json(), rlRes.json()])
      setFeedback(fbData.feedback ?? [])
      setRateLimits(rlData.rateLimits ?? [])
    } catch {
      setLiveError('Live data ophalen mislukt. Probeer opnieuw.')
    } finally {
      setLiveLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.access_token && isAdmin) {
      void loadLiveData(session.access_token)
    }
  }, [session, isAdmin, loadLiveData])

  async function handleResetIp(ip: string) {
    if (!session?.access_token) return
    setResettingIp(ip)
    try {
      const res = await fetch('/api/admin/reset-rate-limit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ip }),
      })
      if (res.ok) {
        setRateLimits((prev) => prev.filter((r) => r.ip !== ip))
      }
    } finally {
      setResettingIp(null)
    }
  }

  async function handleLogout() {
    await signOut()
    setSession(null)
    setIsAdmin(false)
    setFeedback([])
    setRateLimits([])
    navigate('/admin/login')
  }

  // ── Database stats ─────────────────────────────────────────────────────────
  const totalItems = items.length

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1)
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [items])

  const conditionStats = useMemo(() =>
    CONDITIONS.map((c) => {
      const scored = items.filter((i) => i.scores[c] !== null)
      const byEvidence = { A: 0, B: 0, C: 0, onbekend: 0 }
      for (const item of scored) {
        const ev = item.scores[c]?.evidence ?? 'onbekend'
        byEvidence[ev as keyof typeof byEvidence]++
      }
      const score3 = scored.filter((i) => i.scores[c]?.score === 3).length
      return { condition: c, scored: scored.length, total: totalItems, byEvidence, score3 }
    }), [items, totalItems])

  const itemsWith2Plus = useMemo(() =>
    items.filter((i) => CONDITIONS.filter((c) => i.scores[c] !== null).length >= 2).length,
    [items])

  const auditItems = useMemo(() => {
    const evidenceC: typeof items = []
    const zeroConditions: typeof items = []
    const score3EvidenceC: typeof items = []
    for (const item of items) {
      const scoredCount = CONDITIONS.filter((c) => item.scores[c] !== null).length
      if (scoredCount === 0) zeroConditions.push(item)
      for (const c of CONDITIONS) {
        const s = item.scores[c]
        if (!s) continue
        if (s.evidence === 'C') evidenceC.push(item)
        if (s.score === 3 && s.evidence === 'C') score3EvidenceC.push(item)
      }
    }
    return { evidenceC: [...new Set(evidenceC)], zeroConditions, score3EvidenceC: [...new Set(score3EvidenceC)] }
  }, [items])

  return (
    <div className="min-h-screen bg-[#f8f7f4] pb-16">
      {/* Header */}
      <div className="bg-white border-b border-[#e0dfd7] px-4 pt-safe pt-4 pb-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => navigate('/zoeken')}
              className="text-xs text-[#9c9a92] hover:text-[#1a1a18] transition-colors"
            >
              ← Terug
            </button>
            {!authLoading && (
              session && isAdmin ? (
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#9c9a92] hover:text-red-600 transition-colors"
                >
                  Uitloggen
                </button>
              ) : (
                <Link
                  to="/admin/login"
                  className="text-xs text-[#1d9e75] hover:underline"
                >
                  Inloggen
                </Link>
              )
            )}
          </div>
          <h1 className="font-serif text-2xl font-semibold text-[#1a1a18]">Admin</h1>
          <p className="text-xs text-[#9c9a92] mt-0.5">
            Database · Risico's · Bronnen
            {session && isAdmin && (
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#c6e3d5] text-emerald-800">
                Ingelogd
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-6">

        {/* ── 0. Bezoekers ──────────────────────────────────────────────── */}
        {session && isAdmin && (
          <section>
            <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
              Bezoekers
            </h2>
            <a
              href="https://vercel.com/triggermenu-s-projects/voedingsapp/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white border border-[#e0dfd7] rounded-xl px-4 py-4 hover:border-[#1d9e75] transition-colors group"
            >
              <div>
                <p className="text-sm font-medium text-[#1a1a18]">Vercel Analytics</p>
                <p className="text-xs text-[#9c9a92] mt-0.5">Bezoekers, paginaweergaven en Core Web Vitals</p>
              </div>
              <svg className="w-4 h-4 text-[#9c9a92] group-hover:text-[#1d9e75] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </section>
        )}

        {/* ── 1. Feedback inbox ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Feedback inbox
          </h2>
          {!session || !isAdmin ? (
            <LoginPrompt />
          ) : liveLoading ? (
            <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-6 text-center text-sm text-[#9c9a92]">Laden…</div>
          ) : liveError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center justify-between">
              <span>{liveError}</span>
              <button onClick={() => loadLiveData(session.access_token)} className="text-xs underline ml-3">Opnieuw</button>
            </div>
          ) : feedback.length === 0 ? (
            <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-6 text-center text-sm text-[#9c9a92]">
              Geen feedback ontvangen.
            </div>
          ) : (
            <div className="bg-white border border-[#e0dfd7] rounded-xl divide-y divide-[#f0efe8]">
              {feedback.map((fb) => (
                <div key={fb.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9c9a92]">{fb.type}</span>
                    <span className="text-[10px] text-[#9c9a92]">
                      {new Date(fb.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm text-[#1a1a18] leading-relaxed">{fb.message}</p>
                  {fb.context && (
                    <p className="text-[10px] text-[#9c9a92] mt-1">Pagina: {fb.context}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 2. Rate limits ────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Rate limits — laatste 24u
          </h2>
          {!session || !isAdmin ? (
            <LoginPrompt />
          ) : liveLoading ? (
            <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-6 text-center text-sm text-[#9c9a92]">Laden…</div>
          ) : rateLimits.length === 0 ? (
            <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-6 text-center text-sm text-[#9c9a92]">
              Geen scan-activiteit in de afgelopen 24 uur.
            </div>
          ) : (
            <div className="bg-white border border-[#e0dfd7] rounded-xl divide-y divide-[#f0efe8]">
              {rateLimits.map((rl) => (
                <div key={rl.ip} className="flex items-center justify-between px-4 py-2.5 gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-[#1a1a18] truncate">{rl.ip}</p>
                    <p className="text-[10px] text-[#9c9a92] mt-0.5">
                      Laatste scan: {new Date(rl.lastSeen).toLocaleString('nl-NL')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      rl.count >= 12 ? 'bg-red-100 text-red-700' :
                      rl.count >= 8  ? 'bg-amber-100 text-amber-700' :
                                        'bg-[#f0efe8] text-[#5f5e5a]'
                    }`}>
                      {rl.count}×
                    </span>
                    <button
                      onClick={() => handleResetIp(rl.ip)}
                      disabled={resettingIp === rl.ip}
                      className="text-[10px] font-semibold text-red-600 hover:text-red-800 disabled:opacity-40 transition-colors border border-red-200 rounded px-2 py-0.5 hover:bg-red-50"
                    >
                      {resettingIp === rl.ip ? '…' : 'Reset'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. Database overzicht ──────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Database
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
            <StatCard label="Totaal items" value={totalItems} />
            <StatCard label="≥2 aandoeningen" value={itemsWith2Plus} sub={`${Math.round((itemsWith2Plus / totalItems) * 100)}% gescoord`} />
            <StatCard label="Categorieën" value={byCategory.length} />
            <StatCard label="Cap" value={`${totalItems} / 700`} sub="Fase 4 — afgerond" />
          </div>

          {/* Fase-voortgang */}
          <div className="bg-white border border-[#e0dfd7] rounded-xl p-4 mb-4 space-y-3">
            {PHASE_TARGETS.map(({ fase, target, label }) => (
              <div key={fase}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#5f5e5a] font-medium">Fase {fase} — {label}</span>
                  <span className={`font-semibold ${totalItems >= target ? 'text-[#1d9e75]' : 'text-[#9c9a92]'}`}>
                    {Math.min(totalItems, target)}/{target}
                  </span>
                </div>
                <ProgressBar
                  value={totalItems}
                  max={target}
                  color={totalItems >= target ? 'bg-[#1d9e75]' : 'bg-[#e8a87c]'}
                />
              </div>
            ))}
          </div>

          {/* Per categorie */}
          <div className="bg-white border border-[#e0dfd7] rounded-xl divide-y divide-[#f0efe8]">
            {byCategory.map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm text-[#1a1a18]">{CATEGORY_LABELS[cat] ?? cat}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 hidden sm:block">
                    <ProgressBar value={count} max={Math.max(...byCategory.map(([, c]) => c))} />
                  </div>
                  <span className="text-xs font-semibold text-[#5f5e5a] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Score coverage per aandoening ──────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Score coverage
          </h2>
          <div className="bg-white border border-[#e0dfd7] rounded-xl divide-y divide-[#f0efe8]">
            {conditionStats.map(({ condition, scored, total, byEvidence, score3 }) => {
              const pct = Math.round((scored / total) * 100)
              return (
                <div key={condition} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#1a1a18]">{CONDITION_LABELS[condition]}</span>
                    <span className="text-xs text-[#9c9a92]">{scored}/{total} ({pct}%)</span>
                  </div>
                  <ProgressBar value={scored} max={total} />
                  <div className="flex gap-3 mt-2">
                    {(['A', 'B', 'C', 'onbekend'] as const).map((ev) => (
                      byEvidence[ev] > 0 && (
                        <span key={ev} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          ev === 'A' ? 'bg-[#c6e3d5] text-emerald-800' :
                          ev === 'B' ? 'bg-[#e8ddb5] text-yellow-800' :
                          ev === 'C' ? 'bg-[#f0c4a0] text-orange-800' :
                          'bg-[#e0dfd7] text-[#73726c]'
                        }`}>
                          EV·{ev} {byEvidence[ev]}×
                        </span>
                      )
                    ))}
                    {score3 > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#f0adad] text-red-800 ml-auto">
                        Score 3: {score3}×
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 5. Audit-signalen ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Audit-signalen
          </h2>
          <div className="space-y-3">
            {auditItems.zeroConditions.length > 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-red-800 mb-2">
                  ⚠ {auditItems.zeroConditions.length} item(s) zonder enige score — zou CI moeten blokkeren
                </p>
                <ul className="text-xs text-red-700 space-y-0.5">
                  {auditItems.zeroConditions.map((i) => (
                    <li key={i.id}>{i.name.nl} <span className="text-red-400">({i.id})</span></li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-[#f0faf5] border border-[#c6e3d5] rounded-xl px-4 py-3 text-sm text-emerald-800">
                ✓ Alle items hebben minimaal 1 score
              </div>
            )}

            {auditItems.score3EvidenceC.length > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-amber-800 mb-2">
                  ⚠ {auditItems.score3EvidenceC.length} item(s) met score 3 + evidence C — CI-overtreding (§4.4, regel 10)
                </p>
                <ul className="text-xs text-amber-700 space-y-0.5">
                  {auditItems.score3EvidenceC.map((i) => (
                    <li key={i.id}>{i.name.nl}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-[#f0faf5] border border-[#c6e3d5] rounded-xl px-4 py-3 text-sm text-emerald-800">
                ✓ Geen score 3 met evidence C
              </div>
            )}

            <div className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-3">
              <p className="text-sm font-medium text-[#1a1a18] mb-1">
                Items met evidence C — {auditItems.evidenceC.length} item(s)
              </p>
              <p className="text-xs text-[#73726c] mb-2">
                Laagste betrouwbaarheid. Kandidaten voor herbeoordeling bij nieuwe literatuur.
              </p>
              {auditItems.evidenceC.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {auditItems.evidenceC.slice(0, 12).map((i) => (
                    <span key={i.id} className="text-xs bg-[#f0efe8] text-[#5f5e5a] rounded px-2 py-0.5">
                      {i.name.nl}
                    </span>
                  ))}
                  {auditItems.evidenceC.length > 12 && (
                    <span className="text-xs text-[#9c9a92] py-0.5">
                      +{auditItems.evidenceC.length - 12} meer
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 6. Risico's ──────────────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Risico's
          </h2>
          <div className="bg-white border border-[#e0dfd7] rounded-xl divide-y divide-[#f0efe8]">
            {RISKS.map((r) => (
              <div key={r.id} className="px-4 py-3 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    r.status === 'open' ? 'bg-red-100 text-red-700' : 'bg-[#c6e3d5] text-emerald-800'
                  }`}>
                    {r.status === 'open' ? 'Open' : 'Gemitigeerd'}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#1a1a18]">
                    <span className="text-[#9c9a92] font-normal mr-1">{r.id}</span>
                    {r.title}
                  </p>
                  <p className="text-xs text-[#73726c] mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. Primaire bronnen ───────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Primaire bronnen
          </h2>
          <div className="bg-white border border-[#e0dfd7] rounded-xl divide-y divide-[#f0efe8]">
            {PRIMARY_SOURCES.map((src) => (
              <div key={src.label} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-[#1a1a18] font-medium truncate">{src.label}</p>
                  <p className="text-[10px] text-[#9c9a92] mt-0.5 uppercase tracking-widest">{src.condition}</p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs text-[#1d9e75] hover:underline flex items-center gap-1"
                >
                  Bron
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. Snelle links ──────────────────────────────────────────── */}
        <section>
          <h2 className="text-[10px] tracking-widest text-[#9c9a92] uppercase font-semibold mb-3">
            Snelle links
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: 'GitHub repo', url: 'https://github.com/PeterWolterman/voedingsapp' },
              { label: 'CI / Actions', url: 'https://github.com/PeterWolterman/voedingsapp/actions' },
              { label: "Open PR's", url: 'https://github.com/PeterWolterman/voedingsapp/pulls' },
              { label: 'Vercel dashboard', url: 'https://vercel.com/dashboard' },
              { label: 'Anthropic console', url: 'https://console.anthropic.com' },
              { label: 'Sentry', url: 'https://sentry.io' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white border border-[#e0dfd7] rounded-xl px-4 py-3 text-sm text-[#1a1a18] hover:border-[#1d9e75] transition-colors flex items-center justify-between gap-2"
              >
                {link.label}
                <svg className="w-3.5 h-3.5 text-[#9c9a92] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
