interface OverviewRowProps {
  iconType: 'films' | 'sport' | 'books';
  label: string;
  metric: string;
}

const IconFilms = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/45">
    <rect x="2" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1.2" fill="none" rx="1" />
    <rect x="12" y="2" width="6" height="6" stroke="currentColor" strokeWidth="1.2" fill="none" rx="1" />
    <rect x="2" y="12" width="6" height="6" stroke="currentColor" strokeWidth="1.2" fill="none" rx="1" />
    <rect x="12" y="12" width="6" height="6" stroke="currentColor" strokeWidth="1.2" fill="none" rx="1" />
  </svg>
);

const IconSport = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/45">
    <path d="M10 2L12 8L18 10L12 12L10 18L8 12L2 10L8 8L10 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

const IconBooks = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/45">
    <path d="M4 3H8C9.1 3 10 3.9 10 5V17C10 15.9 9.1 15 8 15H4V3Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M16 3H12C10.9 3 10 3.9 10 5V17C10 15.9 10.9 15 12 15H16V3Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export default function OverviewRow({ iconType, label, metric }: OverviewRowProps) {
  const IconComponent = {
    films: IconFilms,
    sport: IconSport,
    books: IconBooks,
  }[iconType];

  return (
    <div className="rounded-[32px] border border-white/5 bg-[#141420]/50 p-4 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.2)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center">
            <IconComponent />
          </div>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-tertiary">
            {label}
          </div>
        </div>
        <div className="text-[13px] leading-snug text-white/80">{metric}</div>
      </div>
    </div>
  );
}
