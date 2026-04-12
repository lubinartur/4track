import type { MovieItem } from '@/types/movie';
import MovieCard from './MovieCard';

type MovieRowProps = {
  items: MovieItem[];
};

export default function MovieRow({ items }: MovieRowProps) {
  return (
    <div
      className="-mx-4 overflow-x-auto overflow-y-visible scrollbar-hide px-4"
      role="list"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex w-max flex-nowrap gap-4 pb-0.5 pt-0.5">
        {items.map((item) => (
          <div key={item.id} role="listitem" className="shrink-0">
            <MovieCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
