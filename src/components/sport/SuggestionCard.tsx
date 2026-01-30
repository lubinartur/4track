export default function SuggestionCard() {
  return (
    <div className="rounded-[24px] border border-white/3 bg-[#141420]/50 p-5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="mb-3">
        <div className="mb-1 text-[13px] font-medium text-primary">
          Today: Push (moderate)
        </div>
        <p className="text-[12px] leading-relaxed text-secondary">
          Focus on upper body strength with moderate intensity
        </p>
      </div>
      <button className="rounded-xl border border-white/5 bg-white/[0.04] px-4 py-2 text-[12px] font-medium text-primary transition-all hover:bg-white/[0.08] active:scale-[0.98]">
        Open
      </button>
    </div>
  );
}
