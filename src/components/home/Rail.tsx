'use client';

import Link from 'next/link';

interface RailProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  viewAllHref?: string;
  disabled?: boolean;
  itemCount?: number;
}

export default function Rail({ title, subtitle, children, viewAllHref, disabled, itemCount }: RailProps) {
  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-4 flex items-end justify-between px-4">
        <div>
          <h2 className="text-[18px] font-medium tracking-tight text-white/85">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-[12px] text-white/50">
              {subtitle}
            </p>
          )}
        </div>
        {viewAllHref && !disabled && (itemCount == null || itemCount > 2) && (
          <Link
            href={viewAllHref}
            className="text-[13px] font-medium text-orange-500 transition-colors hover:text-orange-400 flex items-center gap-1"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        )}
      </div>

      {/* Horizontal scroll container */}
      <div className="relative">
        {/* Left gradient fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#0b0b0f] to-transparent" />
        
        {/* Scrollable content */}
        <div
          className={`overflow-x-auto px-4 scrollbar-hide flex-nowrap ${
            disabled ? 'opacity-50' : ''
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div className="flex gap-4 pb-2 snap-x snap-mandatory overflow-visible flex-nowrap">
            {children}
          </div>
        </div>

        {/* Right gradient fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#0b0b0f] to-transparent" />
      </div>
    </div>
  );
}
