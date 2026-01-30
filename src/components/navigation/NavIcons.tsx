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
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IconLife = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-[#ff3d00]' : 'text-white/45')}
  >
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 10v9h12v-9" />
    <path d="M10 19v-5h4v5" />
  </svg>
);

export const IconFilms = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-[#ff3d00]' : 'text-white/45')}
  >
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <rect x="14" y="14" width="6" height="6" rx="1.5" />
  </svg>
);

export const IconSport = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-[#ff3d00]' : 'text-white/45')}
  >
    <path d="M3 9v6" />
    <path d="M7 7v10" />
    <path d="M10 12h4" />
    <path d="M14 7v10" />
    <path d="M18 9v6" />
  </svg>
);

export const IconBooks = ({ isActive, className }: IconProps) => (
  <svg
    {...sharedSvgProps}
    className={className || (isActive ? 'text-[#ff3d00]' : 'text-white/45')}
  >
    <path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4Z" />
    <path d="M5 18h11" />
    <path d="M9 8h7" />
  </svg>
);
