import { NavLink } from 'react-router-dom'

const TABS = [
  {
    to: '/zoeken',
    label: 'Zoeken',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    to: '/scan',
    label: 'Scan',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    to: '/bronnen',
    label: 'Bronnen',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    to: '/instellingen',
    label: 'Profiel',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
]

export function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0dfd7] safe-area-bottom z-50">
      <div className="flex items-stretch max-w-lg mx-auto">
        {TABS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex-1 relative flex flex-col items-center justify-center gap-1 py-2 text-xs transition-colors"
          >
            {({ isActive }) => (
              <>
                <span className={`absolute top-0 left-4 right-4 h-0.5 rounded-full transition-all duration-200 ${isActive ? 'bg-[#1d9e75]' : 'bg-transparent'}`} />
                <span className={isActive ? 'text-[#1d9e75]' : 'text-[#9c9a92]'}>{icon}</span>
                <span className={`transition-colors text-[10px] font-medium ${isActive ? 'text-[#1d9e75]' : 'text-[#9c9a92]'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
