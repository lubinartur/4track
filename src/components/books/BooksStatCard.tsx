interface BooksStatCardProps {
  label: string;
  value: string;
}

export default function BooksStatCard({ label, value }: BooksStatCardProps) {
  return (
    <div className="flex-1 rounded-[20px] border border-white/5 bg-[#141420]/50 p-3.5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08),inset_0_-1px_0_0_rgba(0,0,0,0.2)] backdrop-blur-sm">
      <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-tertiary">
        {label}
      </div>
      <div className="text-[16px] font-light leading-tight text-primary">
        {value}
      </div>
    </div>
  );
}
