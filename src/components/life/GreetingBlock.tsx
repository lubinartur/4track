import Link from 'next/link';

export default function GreetingBlock() {
  return (
    <div className="relative mb-10 pt-8">
      <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-tertiary">
        TONIGHT
      </div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="flex-1 text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Good morning, Alex.
        </h1>
        <Link
          href="/profile"
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/8"
          aria-label="Profile"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            className="text-white/50"
          >
            <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path
              d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
