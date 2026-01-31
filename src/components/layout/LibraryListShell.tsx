'use client';

import BackButton from './BackButton';

interface LibraryListShellProps {
  kicker?: string;
  title: string;
  onBack?: () => void;
  fallbackPath?: string;
  children: React.ReactNode;
}

export default function LibraryListShell({ 
  kicker = 'LIBRARY', 
  title, 
  onBack,
  fallbackPath,
  children 
}: LibraryListShellProps) {
  return (
    <>
      {/* Header with back button - scrolls with page */}
      <div className="pt-10 mb-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {onBack ? (
              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-black/40 backdrop-blur-sm text-white/80 transition-colors hover:bg-black/60 hover:text-white"
                aria-label="Back"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4L6 10L12 16" />
                </svg>
              </button>
            ) : (
              <BackButton fallbackPath={fallbackPath} />
            )}
          </div>
          <div className="flex-1">
            {kicker && (
              <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                {kicker}
              </div>
            )}
            <h1 className="text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-white/85" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </>
  );
}
