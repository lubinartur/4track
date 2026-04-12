/** Discover Search — local fallback catalog when `TMDB_API_KEY` is unset. */
import type { DiscoverSearchResultItem } from '@/types/discoverSearch';

export type { DiscoverSearchResultItem } from '@/types/discoverSearch';

const p = (file: string) => `https://image.tmdb.org/t/p/w500/${file}`;

export const discoverSearchCatalog: DiscoverSearchResultItem[] = [
  {
    id: 'sr-fight-club',
    title: 'Fight Club',
    rating: '8.6',
    year: 2019,
    genresLabel: 'Sci-Fi / Action',
    posterUrl: p('pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg'),
    itemSlug: 'fight-club',
  },
  {
    id: 'sr-the-fight',
    title: 'The Fight',
    rating: '8.6',
    year: 2019,
    genresLabel: 'Sci-Fi / Action',
    posterUrl: p('3bhkrj58Vtu7enYsRolD1fJpdPy.jpg'),
    itemSlug: 'the-fight',
  },
];

/** Case-insensitive title substring match; empty query returns full catalog. */
export function filterDiscoverSearchResults(query: string): DiscoverSearchResultItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return discoverSearchCatalog;
  return discoverSearchCatalog.filter((item) => item.title.toLowerCase().includes(q));
}
