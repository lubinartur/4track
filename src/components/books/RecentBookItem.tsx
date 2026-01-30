interface RecentBookItemProps {
  title: string;
  status: string;
  date: string;
}

export default function RecentBookItem({ title, status, date }: RecentBookItemProps) {
  return (
    <div className="rounded-[20px] border border-white/5 bg-[#141420]/50 p-4 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="flex-1 text-[15px] font-medium leading-tight text-primary">
          {title}
        </h3>
        <div className="text-[11px] text-tertiary whitespace-nowrap">
          {date}
        </div>
      </div>
      <div className="text-[12px] text-secondary">
        {status}
      </div>
    </div>
  );
}
