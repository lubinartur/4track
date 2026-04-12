import { Star } from 'lucide-react';

type ItemMetaRowProps = {
  rating: string;
  year: number;
  genresLabel: string;
  className?: string;
};

export default function ItemMetaRow({ rating, year, genresLabel, className }: ItemMetaRowProps) {
  return (
    <div
      className={['flex flex-wrap items-center gap-2 text-[12px] font-medium leading-none', className]
        .filter(Boolean)
        .join(' ')}
    >
      <Star
        size={14}
        strokeWidth={1.5}
        className="shrink-0 fill-[#ff5b00] text-[#ff5b00]"
        aria-hidden
      />
      <span className="text-[#ff5b00]">{rating}</span>
      <span className="text-[rgba(255,255,255,0.35)]">·</span>
      <span className="text-[rgba(255,255,255,0.5)]">{year}</span>
      <span className="text-[rgba(255,255,255,0.35)]">·</span>
      <span className="text-[rgba(255,255,255,0.5)]">{genresLabel}</span>
    </div>
  );
}
