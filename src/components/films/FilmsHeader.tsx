export default function FilmsHeader() {
  return (
    <div className="relative mb-8 pt-12">
      <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-tertiary">
        TONIGHT
      </div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="flex-1 text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Watching.
        </h1>
        <button
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/8"
          aria-label="Curation"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            className="text-white/50"
          >
            <path
              d="M10 2L12.5 7.5L18.5 8.5L14 12.5L15 18.5L10 15.5L5 18.5L6 12.5L1.5 8.5L7.5 7.5L10 2Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
