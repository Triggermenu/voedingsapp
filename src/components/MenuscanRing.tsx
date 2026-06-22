// Dekkingsring voor de menuscan (menuscan-herontwerp.md §9): toont welk deel van een gerecht
// in de gevalideerde database is herkend. Bewust NEUTRAAL gekleurd (grijze track → brand-groene
// vulling) zodat het niet botst met de trigger-stoplicht-kleuren (rood/oranje/groen).

interface Props {
  /** 0..1 — aandeel herkende ingrediënten. */
  coverage: number
  size?: number
}

export function MenuscanRing({ coverage, size = 46 }: Props) {
  const pct = Math.max(0, Math.min(1, coverage))
  const r = 24
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct)
  const label = Math.round(pct * 100)

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={`Databasedekking ${label} procent`}>
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--rule)" strokeWidth="7" />
      {pct > 0 && (
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
        />
      )}
      <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--ink)">{label}%</text>
    </svg>
  )
}
