import type { MovieItem } from '@/types/movie';
import MovieSection from '@/components/MovieSection';

type RecommendedSectionProps = {
  items: MovieItem[];
};

export default function RecommendedSection({ items }: RecommendedSectionProps) {
  return <MovieSection title="More matches" actionLabel="See all" items={items} />;
}
