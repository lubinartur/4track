interface SessionCardProps {
  title: string;
  meta: string;
  score: string;
  tags: string[];
}

export default function SessionCard({ title, meta, score, tags }: SessionCardProps) {
  return (
    <div className="relative rounded-[28px] border border-white/5 bg-[#141420]/50 p-5 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <h3 className="mb-2 text-[18px] font-medium leading-tight text-primary">
            {title}
          </h3>
          <div className="text-[13px] text-secondary">
            {meta}
          </div>
        </div>
        <div className="text-[36px] font-light leading-none tracking-tight text-[#ff3d00]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          {score}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="rounded-full border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
