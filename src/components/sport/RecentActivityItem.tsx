interface RecentActivityItemProps {
  name: string;
  date: string;
  note: string;
}

export default function RecentActivityItem({ name, date, note }: RecentActivityItemProps) {
  return (
    <div className="rounded-[20px] border border-white/3 bg-[#141420]/50 p-4 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="mb-1.5 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-[15px] font-medium leading-tight text-primary">
          {name}
        </h3>
        <div className="text-[11px] text-tertiary whitespace-nowrap">
          {date}
        </div>
      </div>
      <p className="text-[13px] leading-relaxed text-secondary">
        {note}
      </p>
    </div>
  );
}
