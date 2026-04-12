import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Home, Layers, Search, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'discover', label: 'Discover', href: '/discover' },
  { id: 'library', label: 'Library', href: '/library' },
  { id: 'profile', label: 'Profile', href: '/profile' },
] as const;

type BottomNavigationProps = {
  activeItem: string;
};

const icons = {
  home: Home,
  discover: Search,
  library: Layers,
  profile: Settings,
} as const;

type NavId = keyof typeof icons;

/** FAB: 56×56, rounded-[18px]. Notch: 72×72, same rx ratio (18×72/56), rotate 45°. viewBox includes y<0 so the hole isn’t clipped. */
const NOTCH_VIEWBOX = '0 -90 358 158';
const NOTCH_CX = 179;
const NOTCH_CY = -90;
const NOTCH_SIDE = 72;
const NOTCH_RX = (18 * NOTCH_SIDE) / 56;
const NOTCH_HALF = NOTCH_SIDE / 2;

const DOCK_NOTCH_MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${NOTCH_VIEWBOX}" preserveAspectRatio="none" overflow="visible"><rect x="0" y="-90" width="358" height="158" fill="#fff"/><g transform="translate(${NOTCH_CX} ${NOTCH_CY})"><rect x="-${NOTCH_HALF}" y="-${NOTCH_HALF}" width="${NOTCH_SIDE}" height="${NOTCH_SIDE}" rx="${NOTCH_RX}" ry="${NOTCH_RX}" transform="rotate(45)" fill="#000"/></g></svg>`;

const dockNotchMaskUrl = `url("data:image/svg+xml,${encodeURIComponent(DOCK_NOTCH_MASK_SVG)}")`;

function NavLink({
  id,
  label,
  href,
  active,
}: {
  id: NavId;
  label: string;
  href: string;
  active: boolean;
}) {
  const Icon = icons[id];
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      aria-label={active ? undefined : label}
      title={active ? undefined : label}
      className={
        active
          ? 'flex min-w-[52px] flex-col items-center gap-1 px-2 py-1 text-[#ff5b00] transition-colors'
          : 'flex min-w-[44px] flex-col items-center justify-center px-2.5 py-2 text-[rgba(255,255,255,0.45)] transition-colors hover:text-white/60'
      }
    >
      <span className="text-current">
        <Icon size={24} strokeWidth={1.5} aria-hidden className="shrink-0" />
      </span>
      {active ? (
        <span className="max-w-[5rem] truncate text-center text-[12px] font-medium leading-tight tracking-[-0.01em]">
          {label}
        </span>
      ) : null}
    </Link>
  );
}

export default function BottomNavigation({ activeItem }: BottomNavigationProps) {
  const left = NAV_ITEMS.slice(0, 2);
  const right = NAV_ITEMS.slice(2, 4);

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center"
    >
      <div
        className="pointer-events-auto w-full max-w-[390px] px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="relative flex min-h-[108px] flex-col items-center justify-end pb-0 pt-0">
          {/* ::before = dock shell; SVG mask cuts a real transparent diamond (page shows through) */}
          <div
            className="relative z-0 flex h-[68px] min-h-[68px] w-full max-w-[358px] items-center gap-16 px-5 py-1.5 before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[26px] before:border before:border-white/[0.06] before:bg-[#0e111a]/88 before:shadow-[0_10px_36px_rgba(0,0,0,0.38)] before:backdrop-blur-md before:content-[''] before:[mask-image:var(--dock-notch-mask)] before:[mask-size:100%_100%] before:[mask-repeat:no-repeat] before:[-webkit-mask-image:var(--dock-notch-mask)] before:[-webkit-mask-size:100%_100%] before:[-webkit-mask-repeat:no-repeat]"
            style={{ '--dock-notch-mask': dockNotchMaskUrl } as CSSProperties}
          >
            <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center gap-3">
              {left.map((item) => (
                <NavLink
                  key={item.id}
                  id={item.id as NavId}
                  label={item.label}
                  href={item.href}
                  active={activeItem === item.id}
                />
              ))}
            </div>

            <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center gap-3">
              {right.map((item) => (
                <NavLink
                  key={item.id}
                  id={item.id as NavId}
                  label={item.label}
                  href={item.href}
                  active={activeItem === item.id}
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[5px] z-20 -translate-x-1/2 -translate-y-[calc(26%+3px-20px)]">
            <button
              type="button"
              className="pointer-events-auto flex h-[56px] w-[56px] rotate-45 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#ff5b00] via-[#ff5b00] to-[#e04800] text-white shadow-[0_0_24px_rgba(255,120,0,0.45),0_0_48px_rgba(255,120,0,0.25)] transition-transform active:scale-[0.96]"
              aria-label="Add"
            >
              <span className="-rotate-45 flex h-6 w-6 items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
