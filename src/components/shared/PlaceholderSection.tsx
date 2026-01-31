interface PlaceholderSectionProps {
  title: string;
}

export default function PlaceholderSection({ title }: PlaceholderSectionProps) {
  return (
    <div className="mb-16">
      <div className="mb-3">
        <h2 className="text-[14px] font-medium uppercase tracking-[0.12em] text-white/70">
          {title}
        </h2>
        <p className="mt-1 text-[11px] text-white/50">
          Coming soon
        </p>
      </div>
      <div className="relative rounded-[20px] border border-white/5 bg-[#141420]/30 overflow-hidden shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm opacity-45 cursor-default">
        {/* Backdrop/Poster placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-[#3a2a4a] via-[#2a2a3a] to-[#1a1a2a]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#141420] via-[#141420]/80 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="h-5 bg-white/5 rounded mb-2 w-3/4" />
          <div className="h-4 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
