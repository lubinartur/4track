/** Normalized movie row for Discover search / `SearchResultItem`. */
export type DiscoverSearchResultItem = {
  id: string;
  title: string;
  rating: string;
  year: number;
  genresLabel: string;
  posterUrl: string;
  itemSlug?: string;
};
