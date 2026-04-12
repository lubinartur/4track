import MovieSection from '@/components/MovieSection';
import {
  becauseYouLikedMovies,
  hiddenGemsMovies,
  recommendedMovies,
} from '@/app/discover/mockData';

type DiscoverRowsProps = {
  /** Content category from top tabs — drives feed filtering. */
  activeTab: string;
};

export default function DiscoverRows({ activeTab }: DiscoverRowsProps) {
  return (
    <div className="mt-8 flex flex-col gap-8" data-active-category={activeTab}>
      <MovieSection
        title="Recommended for you"
        actionLabel="See all"
        items={recommendedMovies}
      />

      <MovieSection
        title="Because you liked X"
        actionLabel="Refine"
        items={becauseYouLikedMovies}
      />

      <MovieSection
        title="Hidden Gems"
        actionLabel="See all"
        items={hiddenGemsMovies}
      />
    </div>
  );
}
