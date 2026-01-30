interface RatingBlockProps {
  rating: string;
}

export default function RatingBlock({ rating }: RatingBlockProps) {
  return (
    <div className="mb-6 text-center">
      <div className="mb-2 text-[48px] font-light leading-none tracking-tight text-[#ff3d00]">
        {rating}
      </div>
      <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-tertiary">
        YOUR RATING
      </div>
    </div>
  );
}
