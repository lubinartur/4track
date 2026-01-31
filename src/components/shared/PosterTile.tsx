'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface PosterTileProps {
  title: string;
  subtitle?: string;
  image?: string;
  badge?: string;
  reason?: string;
  actions?: React.ReactNode;
  href?: string;
  size?: 'lg' | 'md';
  disabled?: boolean;
}

export default function PosterTile({
  title,
  subtitle,
  image,
  badge,
  reason,
  actions,
  href,
  size = 'md',
  disabled = false,
}: PosterTileProps) {
  const isLarge = size === 'lg';
  
  // Size classes - unified sizing: all cards same size
  // lg (curated): same as PosterCard row size
  // md: smaller variant (if still used)
  const containerClass = isLarge 
    ? 'relative flex-shrink-0 w-[220px] sm:w-[240px] snap-start overflow-visible'
    : 'relative flex-shrink-0 w-[120px] sm:w-[160px] snap-start overflow-visible';
  const titleSizeClass = isLarge ? 'text-[14px]' : 'text-[11px]';
  const subtitleSizeClass = isLarge ? 'text-[11px]' : 'text-[10px]';
  const reasonSizeClass = isLarge ? 'text-[11px]' : 'text-[10px]';

  const content = (
    <motion.div
      className={`${containerClass} ${
        disabled ? 'opacity-40 cursor-default' : 'cursor-pointer'
      }`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={`relative aspect-[2/3] rounded-[24px] overflow-hidden border border-white/5 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a] shadow-lg`}>
        {/* Image */}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        {/* Badge overlay (top-left) */}
        {badge && (
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/70 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
              {badge}
            </span>
          </div>
        )}

        {/* Actions overlay (top-right) */}
        {actions && !disabled && (
          <div
            className="absolute top-2 right-2 z-20 flex gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            {actions}
          </div>
        )}

        {/* Bottom gradient overlay for text readability - no blur, only gradient */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[24px]" 
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 65%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 90%)'
          }}
        />

        {/* Bottom overlay - title, subtitle, reason */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
          <h3 className={`text-white font-medium leading-tight line-clamp-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${titleSizeClass}`}>
            {title}
          </h3>
          {subtitle && (
            <div className={`text-white/60 mt-0.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${subtitleSizeClass}`}>
              {subtitle}
            </div>
          )}
          {reason && (
            <p className={`text-white/50 mt-1 line-clamp-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] ${reasonSizeClass}`}>
              {reason}
            </p>
          )}
        </div>

        {/* Disabled overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <p className="text-[11px] text-white/60 font-medium">Coming soon</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (href && !disabled) {
    return (
      <Link 
        href={href} 
        onClick={(e) => {
          // Allow action buttons to work without navigation
          const target = e.target as HTMLElement;
          if (target.closest('[data-action-button]') || target.closest('button')) {
            e.preventDefault();
          }
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
}
