export default function SportHeader() {
  return (
    <div className="relative mb-10 pt-12">
      <div className="mb-3.5 text-[10px] uppercase tracking-[0.2em] text-tertiary">
        THIS WEEK
      </div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="flex-1 text-[40px] font-light leading-[1.19] tracking-[-0.01em] text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Training.
        </h1>
        <button
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/8"
          aria-label="Curation"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            className="text-[#ff3d00]"
          >
            <path
              d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
