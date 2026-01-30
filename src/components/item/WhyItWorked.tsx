export default function WhyItWorked() {
  return (
    <div className="mb-8 rounded-[24px] border border-white/5 bg-[#141420]/50 p-4 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-tertiary">
          WHY IT WORKED
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          className="text-white/40"
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
