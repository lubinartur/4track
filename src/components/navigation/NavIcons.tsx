interface IconProps {
  isActive?: boolean;
  className?: string;
}

const sharedSvgProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Home icon (lucide Home)
export const IconLife = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-orange-500' : 'text-white/50')}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// Films icon (lucide LayoutGrid / Clapperboard)
export const IconFilms = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-orange-500' : 'text-white/50')}
  >
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

// Sport icon (lucide placeholder - using Sparkles for now)
export const IconSport = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-orange-500' : 'text-white/50')}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

// Books icon (lucide BookOpen)
export const IconBooks = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-orange-500' : 'text-white/50')}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
