export type MovieItem = {
  id: string;
  title: string;
  rating: string;
  year: number;
  genre: string;
  posterUrl: string;
  /** When set, the card links to `/item/{itemSlug}`. */
  itemSlug?: string;
};
