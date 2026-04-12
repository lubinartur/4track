type TagChipProps = {
  label: string;
};

export default function TagChip({ label }: TagChipProps) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-orange-400/20 bg-orange-500/[0.08] px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide text-orange-100/90">
      {label}
    </span>
  );
}
