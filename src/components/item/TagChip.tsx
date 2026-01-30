interface TagChipProps {
  label: string;
}

export default function TagChip({ label }: TagChipProps) {
  return (
    <span className="rounded-full border border-white/5 bg-[#141420]/50 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-secondary backdrop-blur-sm">
      {label}
    </span>
  );
}
