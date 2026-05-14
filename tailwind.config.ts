import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design token aliases — mapped to CSS custom properties
        brand:  'var(--brand)',
        'brand-2': 'var(--brand-2)',
        'brand-50': 'var(--brand-50)',
        bg:     'var(--bg)',
        paper:  'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink:    'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted:  'var(--muted)',
        rule:   'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
        safe:   'var(--safe)',
        'safe-bg':  'var(--safe-bg)',
        'safe-ink': 'var(--safe-ink)',
        ok:     'var(--ok)',
        'ok-bg':    'var(--ok-bg)',
        'ok-ink':   'var(--ok-ink)',
        warn:   'var(--warn)',
        'warn-bg':  'var(--warn-bg)',
        'warn-ink': 'var(--warn-ink)',
        avoid:  'var(--avoid)',
        'avoid-bg':  'var(--avoid-bg)',
        'avoid-ink': 'var(--avoid-ink)',
      },
      fontFamily: {
        sans:  ['"Inter Tight"', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces"', '"Times New Roman"', 'serif'],
        mono:  ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        tm: 'var(--radius)',
      },
      boxShadow: {
        tm: 'var(--shadow)',
      },
    },
  },
  plugins: [],
} satisfies Config
