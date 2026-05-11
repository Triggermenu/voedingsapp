const STATS_KEY = 'triggermenu_stats_v1'
// Cap to avoid unbounded localStorage growth when many items are viewed in one day
const MAX_VIEWED = 500

interface DayStats {
  date: string
  viewed: string[]
}

/**
 * Returns today's date as YYYY-MM-DD in the user's *local* timezone.
 * Using toISOString() would give a UTC date that rolls over 1–2 h early
 * for users in positive UTC offsets (e.g. UTC+2 → midnight at 22:00 local).
 */
function localDateString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function recordView(itemId: string): void {
  const today = localDateString()
  try {
    const raw = localStorage.getItem(STATS_KEY)
    const stats: DayStats = raw ? (JSON.parse(raw) as DayStats) : { date: today, viewed: [] }
    // Reset on day change
    if (stats.date !== today) { stats.date = today; stats.viewed = [] }
    if (!stats.viewed.includes(itemId)) {
      // Guard against unbounded growth
      if (stats.viewed.length < MAX_VIEWED) {
        stats.viewed.push(itemId)
      }
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch { /* quota exceeded or parse error — fail silently */ }
}

export function getTodayStats(): DayStats {
  const today = localDateString()
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return { date: today, viewed: [] }
    const stats = JSON.parse(raw) as DayStats
    if (!stats || typeof stats !== 'object' || !Array.isArray(stats.viewed)) {
      return { date: today, viewed: [] }
    }
    return stats.date === today ? stats : { date: today, viewed: [] }
  } catch {
    return { date: today, viewed: [] }
  }
}
