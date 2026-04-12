import type { MovieItem } from '@/types/movie';
import MovieRow from './MovieRow';
import SectionHeader from './SectionHeader';

type MovieSectionProps = {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
  items: MovieItem[];
};

export default function MovieSection({
  title,
  actionLabel,
  onActionClick,
  items,
}: MovieSectionProps) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <SectionHeader title={title} actionLabel={actionLabel} onActionClick={onActionClick} />
      <MovieRow items={items} />
    </section>
  );
}
