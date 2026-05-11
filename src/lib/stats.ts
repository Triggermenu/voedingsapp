const STATS_KEY = 'triggermenu_stats_v1'

interface DayStats {
  date: string
  viewed: string[]
}

export function recordView(itemId: string): void {
  const today = new Date().toISOString().split('T')[0]
  try {
    const raw = localStorage.getItem(STATS_KEY)
    const stats: DayStats = raw ? (JSON.parse(raw) as DayStats) : { date: today, viewed: [] }
    if (stats.date !== today) { stats.date = today; stats.viewed = [] }
    if (!stats.viewed.includes(itemId)) stats.viewed.push(itemId)
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch { /* ignore */ }
}

export function getTodayStats(): DayStats {
  const today = new Date().toISOString().split('T')[0]
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return { date: today, viewed: [] }
    const stats = JSON.parse(raw) as DayStats
    return stats.date === today ? stats : { date: today, viewed: [] }
  } catch {
    return { date: today, viewed: [] }
  }
}
