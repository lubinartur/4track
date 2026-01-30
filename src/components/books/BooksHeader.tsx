export default function BooksHeader() {
  return (
    <div className="relative mb-10 pt-12">
      <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-tertiary">
        THIS WEEK
      </div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="flex-1 text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Reading.
        </h1>
        <button
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/8"
          aria-label="Settings"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            className="text-white/50"
          >
            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path
              d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 4.34L14.24 5.76M5.76 14.24L4.34 15.66M15.66 15.66L14.24 14.24M5.76 5.76L4.34 4.34"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
