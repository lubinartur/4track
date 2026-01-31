'use client';

interface PageShellProps {
  kicker?: string;
  title: string;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageShell({ kicker, title, rightIcon, children }: PageShellProps) {
  return (
    <>
      {/* Header with fixed vertical rhythm */}
      <div className="pt-10 mb-10">
        {kicker && (
          <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
            {kicker}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <h1 className="flex-1 text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-white/85" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            {title}
          </h1>
          {rightIcon && <div className="mt-1 shrink-0">{rightIcon}</div>}
        </div>
      </div>

      {/* Content */}
      {children}
    </>
  );
}
