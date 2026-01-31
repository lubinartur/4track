'use client';

interface CarouselRowProps {
  children: React.ReactNode;
}

export function CarouselRow({ children }: CarouselRowProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="flex gap-4 pr-4 pb-2 snap-x snap-mandatory flex-nowrap">
        {children}
      </div>
    </div>
  );
}
