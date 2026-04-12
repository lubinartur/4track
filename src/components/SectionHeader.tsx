'use client';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

export default function SectionHeader({ title, actionLabel, onActionClick }: SectionHeaderProps) {
  return (
    <header className="flex min-h-6 items-center justify-between gap-3">
      <h2 className="min-w-0 flex-1 truncate text-[20px] font-medium leading-none tracking-[-0.02em] text-white">
        {title}
      </h2>
      {actionLabel ? (
        <button
          type="button"
          onClick={() => onActionClick?.()}
          className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-normal leading-none text-[#ff5b00] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5b00]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e111a]"
        >
          {actionLabel}
          <span className="inline-flex h-[6px] w-5 text-current" aria-hidden>
            <svg viewBox="0 0 20 6" fill="none" className="h-full w-full">
              <path
                d="M0 3h14m0 0L11.5 0.5M14 3l-2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      ) : null}
    </header>
  );
}
