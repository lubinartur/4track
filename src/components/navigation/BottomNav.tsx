'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui.store';
import { IconLife, IconFilms, IconSport, IconBooks } from './NavIcons';

export default function BottomNav() {
  const pathname = usePathname();
  const openAdd = useUIStore((state) => state.openAdd);

  const navItems = [
    { href: '/', icon: IconLife },
    { href: '/films', icon: IconFilms },
    { href: '/sport', icon: IconSport },
    { href: '/books', icon: IconBooks },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const bottomOffset = 'calc(1.25rem + env(safe-area-inset-bottom))';

  return (
    <>
      {/* Floating capsule dock - contains only 4 icons, symmetric around viewport center */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center pointer-events-none" style={{ paddingBottom: bottomOffset }}>
        <div className="mx-auto flex items-center gap-2 rounded-full border border-white/5 bg-[#141420]/80 backdrop-blur-xl px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] pointer-events-auto">
          {/* Left side icons (Life, Films) */}
          {navItems.slice(0, 2).map((item) => {
            const active = isActive(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-white/5"
              >
                <IconComponent isActive={active} />
                {/* Active dot indicator */}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff3d00]" />
                )}
              </Link>
            );
          })}

          {/* Gap for FAB (visual spacing - FAB is positioned separately) */}
          <div className="w-11" />

          {/* Right side icons (Sport, Books) */}
          {navItems.slice(2, 4).map((item) => {
            const active = isActive(item.href);
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors hover:bg-white/5"
              >
                <IconComponent isActive={active} />
                {/* Active dot indicator */}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#ff3d00]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Center FAB - fixed to viewport center (not dock center) */}
      <button
        onClick={openAdd}
        className="fixed z-50 flex items-center justify-center w-11 h-11 rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95 pointer-events-auto"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: bottomOffset,
        }}
        aria-label="Add"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-black">
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </>
  );
}
