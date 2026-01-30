interface CurrentlyReadingCardProps {
  title: string;
  author: string;
}

export default function CurrentlyReadingCard({ title, author }: CurrentlyReadingCardProps) {
  return (
    <div className="rounded-[28px] border border-white/5 bg-[#141420]/50 p-6 shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
      <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.12em] text-tertiary">
        CURRENTLY READING
      </div>
      <h2 className="mb-2 text-[22px] font-light leading-tight text-primary" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
        {title}
      </h2>
      <p className="text-[14px] leading-relaxed text-secondary">
        {author}
      </p>
    </div>
  );
}
